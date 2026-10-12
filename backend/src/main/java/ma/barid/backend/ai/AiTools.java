package ma.barid.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.enums.StatutClient;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.auth.repository.UtilisateurRepository;
import ma.barid.backend.expedition.*;
import ma.barid.backend.facturation.entity.Facture;
import ma.barid.backend.facturation.enums.StatutPaiement;
import ma.barid.backend.facturation.repository.FactureRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AiTools {
    private final ExpeditionRepository expRepo;
    private final TranchePoidsRepository trancheRepo;
    private final ClientRepository clientRepo;
    private final UtilisateurRepository userRepo;
    private final FactureRepository factureRepo;
    private final ObjectMapper om;

    /** CLIENT / COMMERCIAL / ADMIN / FACTEUR (le JwtFilter ajoute le préfixe ROLE_). */
    public static String roleOf(Authentication a) {
        return a.getAuthorities().stream().map(g -> g.getAuthority().replace("ROLE_", "")).findFirst().orElse("NONE");
    }

    private static Map<String, Object> strP(String d) { return Map.of("type", "string", "description", d); }
    private static Map<String, Object> numP(String d) { return Map.of("type", "number", "description", d); }
    private static Map<String, Object> tool(String n, String d, Map<String, Object> p, List<String> req) {
        return Map.of("name", n, "description", d, "input_schema", Map.of("type", "object", "properties", p, "required", req));
    }

    /** Le modèle ne voit QUE les outils de son rôle (FACTEUR : aucun). */
    public List<Map<String, Object>> forRole(String role) {
        return switch (role) {
            case "ADMIN" -> List.of(
                    tool("global_stats", "Statistiques d'un mois : expéditions (nombre, par statut, montant) et facturation (factures, TTC, remises, impayés)", Map.of("month", strP("Mois YYYY-MM")), List.of("month")),
                    tool("compare_months", "Compare deux mois et calcule les variations en % (expéditions, montant, facturation, remises)", Map.of("month_a", strP("Mois de référence YYYY-MM (le plus ancien)"), "month_b", strP("Mois comparé YYYY-MM (le plus récent)")), List.of("month_a", "month_b")),
                    tool("trend_last_months", "Évolution mensuelle sur les N derniers mois", Map.of("months", numP("Nombre de mois, 1 à 12")), List.of("months")),
                    tool("detect_anomalies", "Anomalies à examiner : envois non collectés depuis 48h, taux d'annulation, montants les plus élevés, factures impayées échues", Map.of(), List.of()));
            case "COMMERCIAL" -> List.of(
                    tool("list_clients", "Liste les clients validés (30 max), avec filtre optionnel sur la raison sociale", Map.of("search", strP("Texte à chercher dans la raison sociale (optionnel)")), List.of()),
                    tool("client_activity", "Résume l'activité d'un client : expéditions, montants, statuts, factures", Map.of("client_id", numP("idClient obtenu via list_clients")), List.of("client_id")),
                    tool("search_client_shipments", "20 dernières expéditions d'un client", Map.of("client_id", numP("idClient")), List.of("client_id")));
            case "CLIENT" -> List.of(
                    tool("track_shipment", "Statut et détails d'UN DE MES envois à partir du code de suivi (ex. EXP000000012)", Map.of("tracking_number", strP("Code de suivi")), List.of("tracking_number")),
                    tool("list_my_shipments", "Mes 20 dernières expéditions", Map.of(), List.of()),
                    tool("estimate_price", "Tarif d'un envoi selon son poids", Map.of("poids_kg", numP("Poids en kg (0,001 à 31)")), List.of("poids_kg")));
            default -> List.of();
        };
    }

    public String execute(String name, JsonNode in, Authentication auth) {
        try {
            if (forRole(roleOf(auth)).stream().noneMatch(t -> t.get("name").equals(name)))
                return om.writeValueAsString(Map.of("erreur", "Outil non autorisé pour ce rôle"));
            Object out = switch (name) {
                case "track_shipment" -> track(in, auth);
                case "list_my_shipments" -> expRepo.findTop20ByClient_IdUtilisateurOrderByDateCreationDesc(meId(auth)).stream().map(this::dto).toList();
                case "estimate_price" -> estimate(in);
                case "list_clients" -> listClients(in);
                case "client_activity" -> activity(in);
                case "search_client_shipments" -> expRepo.findTop20ByClient_IdUtilisateurOrderByDateCreationDesc(in.path("client_id").asLong()).stream().map(this::dto).toList();
                case "global_stats" -> stats(in.path("month").asText());
                case "compare_months" -> compare(in);
                case "trend_last_months" -> trend(in);
                case "detect_anomalies" -> anomalies();
                default -> Map.of("erreur", "Outil inconnu");
            };
            return om.writeValueAsString(out);
        } catch (Exception e) {
            return "{\"erreur\":\"" + String.valueOf(e.getMessage()).replace("\"", "'") + "\"}";
        }
    }

    // ---------- CLIENT : l'identité vient du JWT, jamais du modèle ----------
    private Long meId(Authentication a) { return userRepo.findByIdentifiant(a.getName()).orElseThrow().getIdUtilisateur(); }

    private Object track(JsonNode in, Authentication a) {
        String code = in.path("tracking_number").asText().trim().toUpperCase();
        return expRepo.findByCodeTrackingAndClient_IdUtilisateur(code, meId(a)).<Object>map(this::dto)
                .orElse(Map.of("erreur", "Aucune expédition trouvée avec ce code parmi vos envois."));
    }

    private Object estimate(JsonNode in) {
        double kg = in.path("poids_kg").asDouble(0);
        if (kg < 0.001 || kg > 31) return Map.of("erreur", "Le poids doit être compris entre 0,001 et 31 kg.");
        return trancheRepo.findTrancheForPoids(BigDecimal.valueOf(kg)).<Object>map(t -> Map.of(
                        "poidsKg", kg,
                        "prixMAD", t.getPrix(),
                        "tranche", t.getPoidsMin() + " à " + t.getPoidsMax() + " kg",
                        "regle", "Le tarif dépend uniquement du poids (tranches), pas de la distance ni des villes."))
                .orElse(Map.of("erreur", "Aucune tranche tarifaire pour ce poids."));
    }

    // ---------- COMMERCIAL : même périmètre que /commercial/clients ----------
    private Object listClients(JsonNode in) {
        String s = in.path("search").asText("").toLowerCase();
        return clientRepo.findByStatut(StatutClient.VALIDE).stream()
                .filter(c -> c.getRaisonSociale().toLowerCase().contains(s)).limit(30)
                .map(c -> Map.of("idClient", c.getIdUtilisateur(), "raisonSociale", c.getRaisonSociale(), "ville", c.getVille().getNomVille()))
                .toList();
    }

    private Object activity(JsonNode in) {
        long id = in.path("client_id").asLong();
        Client c = clientRepo.findById(id).orElse(null);
        if (c == null) return Map.of("erreur", "Client introuvable");
        List<Expedition> l = expRepo.findByClient_IdUtilisateur(id);
        List<Facture> f = factureRepo.findByClientId(id);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("client", c.getRaisonSociale());
        m.put("nbExpeditions", l.size());
        m.put("parStatut", countByStatut(l));
        m.put("montantExpeditionsHorsAnnulees", sumMontant(l));
        m.put("derniereExpedition", l.stream().map(Expedition::getDateCreation).filter(Objects::nonNull).max(Comparator.naturalOrder()).map(String::valueOf).orElse("aucune"));
        m.put("nbFactures", f.size());
        m.put("facturesNonPayeesTTC", r2(f.stream().filter(x -> x.getStatutPaiement() == StatutPaiement.NON_PAYEE).mapToDouble(Facture::getMontantTTC).sum()));
        return m;
    }

    // ---------- ADMIN ----------
    private Map<String, Object> stats(String month) {
        YearMonth ym = YearMonth.parse(month);
        List<Expedition> l = expRepo.findByDateCreationBetween(ym.atDay(1).atStartOfDay(), ym.atEndOfMonth().atTime(LocalTime.MAX));
        List<Facture> f = factureRepo.findByDateEmissionBetween(ym.atDay(1), ym.atEndOfMonth());
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("mois", month);
        m.put("nbExpeditions", l.size());
        m.put("parStatut", countByStatut(l));
        m.put("montantExpeditionsHorsAnnulees", sumMontant(l));
        m.put("nbFactures", f.size());
        m.put("totalFacturesTTC", r2(f.stream().mapToDouble(Facture::getMontantTTC).sum()));
        m.put("totalRemises", r2(f.stream().mapToDouble(Facture::getMontantRemise).sum()));
        m.put("facturesNonPayeesTTC", r2(f.stream().filter(x -> x.getStatutPaiement() == StatutPaiement.NON_PAYEE).mapToDouble(Facture::getMontantTTC).sum()));
        return m;
    }

    private Object compare(JsonNode in) {
        Map<String, Object> a = stats(in.path("month_a").asText()), b = stats(in.path("month_b").asText());
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("reference", a);
        m.put("compare", b);
        for (String k : List.of("nbExpeditions", "montantExpeditionsHorsAnnulees", "totalFacturesTTC", "totalRemises"))
            m.put("variation_" + k + "_pct", pct(d(a, k), d(b, k)));
        return m;
    }

    private Object trend(JsonNode in) {
        int n = Math.max(1, Math.min(12, in.path("months").asInt(6)));
        List<Object> out = new ArrayList<>();
        for (int i = n - 1; i >= 0; i--) {
            Map<String, Object> s = stats(YearMonth.now().minusMonths(i).toString());
            out.add(Map.of("mois", s.get("mois"), "nbExpeditions", s.get("nbExpeditions"),
                    "montantExpeditions", s.get("montantExpeditionsHorsAnnulees"), "totalFacturesTTC", s.get("totalFacturesTTC")));
        }
        return out;
    }

    private Object anomalies() {
        LocalDateTime now = LocalDateTime.now();
        List<Expedition> mois = expRepo.findByDateCreationBetween(YearMonth.now().atDay(1).atStartOfDay(), now);
        long annulees = mois.stream().filter(e -> e.getStatut() == StatutExpedition.ANNULEE).count();
        List<Facture> impayees = factureRepo.findByDateEmissionBetween(LocalDate.now().minusDays(180), LocalDate.now()).stream()
                .filter(x -> x.getStatutPaiement() == StatutPaiement.NON_PAYEE && x.getDateEcheance().isBefore(LocalDate.now())).toList();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("expeditionsNonCollecteesDepuis48h", expRepo.findTop20ByStatutInAndDateCreationBeforeOrderByDateCreationAsc(
                List.of(StatutExpedition.EN_ATTENTE, StatutExpedition.VALIDEE), now.minusHours(48)).stream().map(this::dto).toList());
        m.put("nbExpeditionsMoisCourant", mois.size());
        m.put("tauxAnnulationMoisCourantPct", mois.isEmpty() ? 0 : r2(annulees * 100.0 / mois.size()));
        m.put("top5MontantsEleves", expRepo.findTop5ByOrderByMontantDesc().stream().map(this::dto).toList());
        m.put("facturesImpayeesEchues", Map.of("nb", impayees.size(),
                "totalTTC", r2(impayees.stream().mapToDouble(Facture::getMontantTTC).sum()),
                "exemples", impayees.stream().limit(5).map(x -> Map.of("numero", x.getNumeroFacture(), "client", x.getClientRaisonSociale(),
                        "ttc", x.getMontantTTC(), "echeance", String.valueOf(x.getDateEcheance()))).toList()));
        return m;
    }

    // ---------- utilitaires ----------
    /** On n'expose volontairement ni téléphone ni adresse du destinataire. */
    private Map<String, Object> dto(Expedition e) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("codeTracking", e.getCodeTracking());
        m.put("type", String.valueOf(e.getTypeEnvoi()));
        m.put("statut", String.valueOf(e.getStatut()));
        m.put("depart", e.getVilleDepart().getNomVille());
        m.put("destination", e.getVilleDestination().getNomVille());
        m.put("destinataire", e.getNomDestinataire());
        m.put("poidsKg", e.getPoidsReel() != null ? e.getPoidsReel() : e.getPoids());
        m.put("montantMAD", e.getMontant());
        m.put("creeLe", String.valueOf(e.getDateCreation()));
        m.put("collectePrevueLe", String.valueOf(e.getHeureCollecte()));
        m.put("annuleeLe", String.valueOf(e.getDateAnnulation()));
        return m;
    }

    private static Map<String, Long> countByStatut(List<Expedition> l) {
        return l.stream().collect(Collectors.groupingBy(e -> e.getStatut().name(), TreeMap::new, Collectors.counting()));
    }
    private static double sumMontant(List<Expedition> l) {
        return r2(l.stream().filter(e -> e.getStatut() != StatutExpedition.ANNULEE && e.getMontant() != null).mapToDouble(e -> e.getMontant().doubleValue()).sum());
    }
    private static double r2(double v) { return Math.round(v * 100) / 100.0; }
    private static double d(Map<String, Object> m, String k) { return ((Number) m.get(k)).doubleValue(); }
    private static String pct(double a, double b) { return a == 0 ? "n/a" : String.format(Locale.US, "%.1f", (b - a) * 100 / a); }
}