package ma.barid.backend.auth.serviceImpl;

import ma.barid.backend.auth.dto.*;

import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Facteur;
import ma.barid.backend.auth.entity.Role;
import ma.barid.backend.auth.entity.Utilisateur;
import ma.barid.backend.auth.entity.Ville;

import ma.barid.backend.auth.enums.RoleName;
import ma.barid.backend.auth.enums.StatutClient;

import ma.barid.backend.auth.repository.AgenceRepository;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.auth.repository.FacteurRepository;
import ma.barid.backend.auth.repository.RoleRepository;
import ma.barid.backend.auth.repository.UtilisateurRepository;
import ma.barid.backend.auth.repository.VilleRepository;

import ma.barid.backend.expedition.ExpeditionRepository;

import ma.barid.backend.zaineb.entity.Commercial;
import ma.barid.backend.zaineb.repository.CommercialRepository;

import ma.barid.backend.auth.service.AdminService;
import ma.barid.backend.auth.service.EmailService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final AgenceRepository agenceRepository;
    private final VilleRepository villeRepository;
    private final ClientRepository clientRepository;
    private final CommercialRepository commercialRepository;
    private final FacteurRepository facteurRepository;
    private final ExpeditionRepository expeditionRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // =========================================================
    // DASHBOARD
    // =========================================================
    @Override
    public DashboardStatsResponse getDashboardStats() {

        List<ma.barid.backend.auth.entity.Client> tousLesClients = clientRepository.findAll();
        List<ma.barid.backend.expedition.Expedition> toutesLesExpeditions = expeditionRepository.findAll();

        // ---- Line chart : pre-inscriptions par mois (6 derniers mois) ----
        Map<String, Long> parMois = new LinkedHashMap<>();
        YearMonth moisCourant = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            YearMonth mois = moisCourant.minusMonths(i);
            long count = tousLesClients.stream()
                    .filter(c -> c.getDateCreation() != null)
                    .filter(c -> YearMonth.from(c.getDateCreation()).equals(mois))
                    .count();
            parMois.put(mois.toString(), count);
        }

        // ---- Bar chart : expeditions par statut ----
        Map<String, Long> statutExpeditions = toutesLesExpeditions.stream()
                .collect(Collectors.groupingBy(e -> e.getStatut().name(), Collectors.counting()));

        // ---- Bar chart : clients par ville ----
        Map<String, Long> clientsParVille = tousLesClients.stream()
                .filter(c -> c.getVille() != null)
                .collect(Collectors.groupingBy(c -> c.getVille().getNomVille(), Collectors.counting()));

        // ---- Activite (nombre de pre-inscriptions creees) ----
        LocalDate aujourdHui = LocalDate.now();
        LocalDate debutSemaine = aujourdHui.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate debutMois = aujourdHui.withDayOfMonth(1);

        long activiteAujourdHui = tousLesClients.stream()
                .filter(c -> c.getDateCreation() != null)
                .filter(c -> c.getDateCreation().toLocalDate().equals(aujourdHui))
                .count();
        long activiteCetteSemaine = tousLesClients.stream()
                .filter(c -> c.getDateCreation() != null)
                .filter(c -> !c.getDateCreation().toLocalDate().isBefore(debutSemaine))
                .count();
        long activiteCeMois = tousLesClients.stream()
                .filter(c -> c.getDateCreation() != null)
                .filter(c -> !c.getDateCreation().toLocalDate().isBefore(debutMois))
                .count();

        // ---- Team performance ----
        long totalClients = tousLesClients.size();
        long clientsValides = tousLesClients.stream()
                .filter(c -> c.getStatut() == StatutClient.VALIDE)
                .count();
        double tauxValidationCommerciaux = totalClients == 0 ? 0.0 :
                Math.round((clientsValides * 100.0 / totalClients) * 10) / 10.0;

        long totalAgences = agenceRepository.count();
        long agencesCompletes = agenceRepository.findAll().stream()
                .filter(a -> commercialRepository.existsByAgence_IdAgence(a.getIdAgence())
                        && facteurRepository.existsByAgence_IdAgence(a.getIdAgence()))
                .count();
        double tauxAgencesCompletes = totalAgences == 0 ? 0.0 :
                Math.round((agencesCompletes * 100.0 / totalAgences) * 10) / 10.0;

        long totalExpeditionsAssignees = toutesLesExpeditions.stream()
                .filter(e -> e.getFacteurAssigne() != null)
                .count();
        long expeditionsLivrees = toutesLesExpeditions.stream()
                .filter(e -> e.getStatut() == ma.barid.backend.expedition.StatutExpedition.COLLECTEE)
                .count();
        double tauxLivraisonFacteurs = totalExpeditionsAssignees == 0 ? 0.0 :
                Math.round((expeditionsLivrees * 100.0 / totalExpeditionsAssignees) * 10) / 10.0;

        // ---- Calendrier du jour ----
        long preInscriptionsAValider = tousLesClients.stream()
                .filter(c -> c.getStatut() == StatutClient.PRE_INSCRIPTION)
                .count();

        long colisADistribuerAujourdHui = toutesLesExpeditions.stream()
                .filter(e -> e.getStatut() == ma.barid.backend.expedition.StatutExpedition.EN_ATTENTE)
                .count();

        long expeditionsCreesAujourdHui = toutesLesExpeditions.stream()
                .filter(e -> e.getDateCreation() != null)
                .filter(e -> e.getDateCreation().toLocalDate().equals(aujourdHui))
                .count();

        return DashboardStatsResponse.builder()
                .nombreClients(totalClients)
                .nombreCommerciaux(commercialRepository.count())
                .nombreFacteurs(facteurRepository.count())
                .nombreAgences(totalAgences)
                .preInscriptionsParMois(parMois)
                .statutExpeditions(statutExpeditions)
                .clientsParVille(clientsParVille)
                .activiteAujourdHui(activiteAujourdHui)
                .activiteCetteSemaine(activiteCetteSemaine)
                .activiteCeMois(activiteCeMois)
                .tauxLivraisonFacteurs(tauxLivraisonFacteurs)
                .tauxValidationCommerciaux(tauxValidationCommerciaux)
                .tauxAgencesCompletes(tauxAgencesCompletes)
                .colisADistribuerAujourdHui(colisADistribuerAujourdHui)
                .preInscriptionsAValider(preInscriptionsAValider)
                .expeditionsCreesAujourdHui(expeditionsCreesAujourdHui)
                .build();
    }

    // =========================================================
    // VILLES
    // =========================================================
    @Override
    public List<VilleResponse> listVilles() {
        return villeRepository.findAll().stream()
                .map(v -> VilleResponse.builder()
                        .idVille(v.getIdVille())
                        .nomVille(v.getNomVille())
                        .codeVille(v.getCodeVille())
                        .build())
                .toList();
    }

    // =========================================================
    // AGENCES
    // =========================================================
    @Override
    public List<AgenceResponse> listAgences() {
        return agenceRepository.findAll().stream().map(this::toAgenceResponse).toList();
    }

    @Override
    public AgenceResponse createAgence(AgenceRequest request) {
        Ville ville = villeRepository.findById(request.getIdVille())
                .orElseThrow(() -> new RuntimeException("Ville introuvable"));

        Agence agence = Agence.builder()
                .nomAgence(request.getNomAgence())
                .adresse(request.getAdresse())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .ville(ville)
                .build();
        agenceRepository.save(agence);

        if (estRempli(request.getCommercialNom())) {
            if (!estRempli(request.getCommercialEmail())) {
                throw new RuntimeException("L'email du commercial est obligatoire si son nom est renseigne");
            }
            creerCommercialPourAgence(agence, request.getCommercialNom(), request.getCommercialPrenom(),
                    request.getCommercialTelephone(), request.getCommercialEmail());
        }

        if (estRempli(request.getFacteurNom())) {
            if (!estRempli(request.getFacteurEmail())) {
                throw new RuntimeException("L'email du facteur est obligatoire si son nom est renseigne");
            }
            creerFacteurPourAgence(agence, request.getFacteurNom(), request.getFacteurPrenom(),
                    request.getFacteurTelephone(), request.getFacteurEmail());
        }

        return toAgenceResponse(agence);
    }

    @Override
    public AgenceResponse updateAgence(Long idAgence, AgenceRequest request) {
        Agence agence = agenceRepository.findById(idAgence)
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));
        Ville ville = villeRepository.findById(request.getIdVille())
                .orElseThrow(() -> new RuntimeException("Ville introuvable"));

        agence.setNomAgence(request.getNomAgence());
        agence.setAdresse(request.getAdresse());
        agence.setTelephone(request.getTelephone());
        agence.setEmail(request.getEmail());
        agence.setVille(ville);

        agenceRepository.save(agence);
        return toAgenceResponse(agence);
    }

    @Override
    public void deleteAgence(Long idAgence) {
        Agence agence = agenceRepository.findById(idAgence)
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        if (clientRepository.existsByAgence_IdAgence(idAgence)) {
            throw new RuntimeException("Impossible de supprimer cette agence : des clients y sont encore rattaches.");
        }
        if (commercialRepository.existsByAgence_IdAgence(idAgence)) {
            throw new RuntimeException("Impossible de supprimer cette agence : un commercial y est encore affecte. Supprimez-le d'abord.");
        }
        if (facteurRepository.existsByAgence_IdAgence(idAgence)) {
            throw new RuntimeException("Impossible de supprimer cette agence : un facteur y est encore affecte. Supprimez-le d'abord.");
        }

        agenceRepository.delete(agence);
    }

    // =========================================================
    // COMMERCIAUX
    // =========================================================
    @Override
    public List<CommercialResponse> listCommerciaux() {
        return commercialRepository.findAll().stream().map(this::toCommercialResponse).toList();
    }

    @Override
    public CommercialResponse createCommercial(CommercialRequest request) {
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        Commercial commercial = creerCommercialPourAgence(agence, request.getNom(), request.getPrenom(),
                request.getTelephone(), request.getEmail());

        return toCommercialResponse(commercial);
    }

    @Override
    public CommercialResponse updateCommercial(Long id, CommercialRequest request) {
        Commercial commercial = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));

        Agence nouvelleAgence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        boolean changeAgence = !commercial.getAgence().getIdAgence().equals(nouvelleAgence.getIdAgence());
        if (changeAgence && commercialRepository.existsByAgence_IdAgence(nouvelleAgence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un commercial affecte");
        }

        commercial.setNom(request.getNom());
        commercial.setPrenom(request.getPrenom());
        commercial.setTelephone(request.getTelephone());
        commercial.setAgence(nouvelleAgence);

        if (!commercial.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est deja utilise");
            }
            commercial.setEmail(request.getEmail());
        }

        commercialRepository.save(commercial);

        return toCommercialResponse(commercial);
    }

    @Override
    public void deleteCommercial(Long id) {
        Commercial commercial = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));
        commercialRepository.delete(commercial);
    }

    // =========================================================
    // FACTEURS
    // =========================================================
    @Override
    public List<FacteurResponse> listFacteurs() {
        return facteurRepository.findAll().stream().map(this::toFacteurResponse).toList();
    }

    @Override
    public FacteurResponse createFacteur(FacteurRequest request) {
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        Facteur facteur = creerFacteurPourAgence(agence, request.getNom(), request.getPrenom(),
                request.getTelephone(), request.getEmail());

        return toFacteurResponse(facteur);
    }

    @Override
    public FacteurResponse updateFacteur(Long id, FacteurRequest request) {
        Facteur facteur = facteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facteur introuvable"));

        Agence nouvelleAgence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        boolean changeAgence = !facteur.getAgence().getIdAgence().equals(nouvelleAgence.getIdAgence());
        if (changeAgence && facteurRepository.existsByAgence_IdAgence(nouvelleAgence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un facteur affecte");
        }

        facteur.setNom(request.getNom());
        facteur.setPrenom(request.getPrenom());
        facteur.setTelephone(request.getTelephone());
        facteur.setAgence(nouvelleAgence);

        Utilisateur utilisateur = facteur.getUtilisateur();
        if (!utilisateur.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est deja utilise");
            }
            utilisateur.setEmail(request.getEmail());
            utilisateurRepository.save(utilisateur);
        }

        facteurRepository.save(facteur);
        return toFacteurResponse(facteur);
    }

    @Override
    public void deleteFacteur(Long id) {
        Facteur facteur = facteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facteur introuvable"));
        facteurRepository.delete(facteur);
    }

    // =========================================================
    // HELPERS PRIVES
    // =========================================================
    private boolean estRempli(String valeur) {
        return valeur != null && !valeur.isBlank();
    }

    private Commercial creerCommercialPourAgence(Agence agence, String nom, String prenom,
                                                 String telephone, String email) {
        if (utilisateurRepository.existsByEmail(email)) {
            throw new RuntimeException("Cet email est deja utilise");
        }
        if (commercialRepository.existsByAgence_IdAgence(agence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un commercial affecte");
        }

        Role role = roleRepository.findByNomRole(RoleName.COMMERCIAL.name())
                .orElseThrow(() -> new RuntimeException("Role COMMERCIAL introuvable"));

        String identifiant = genererIdentifiant("com", nom);
        String motDePasseClair = genererMotDePasseAleatoire();

        Commercial commercial = Commercial.builder()
                .identifiant(identifiant)
                .motDePasse(passwordEncoder.encode(motDePasseClair))
                .email(email)
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .role(role)
                .nom(nom)
                .prenom(prenom)
                .telephone(telephone)
                .agence(agence)
                .build();

        commercialRepository.save(commercial);

        emailService.envoyerIdentifiants(email, identifiant, motDePasseClair);
        return commercial;
    }

    private Facteur creerFacteurPourAgence(Agence agence, String nom, String prenom,
                                           String telephone, String email) {
        if (utilisateurRepository.existsByEmail(email)) {
            throw new RuntimeException("Cet email est deja utilise");
        }
        if (facteurRepository.existsByAgence_IdAgence(agence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un facteur affecte");
        }

        Role role = roleRepository.findByNomRole(RoleName.FACTEUR.name())
                .orElseThrow(() -> new RuntimeException("Role FACTEUR introuvable"));

        String identifiant = genererIdentifiant("fac", nom);
        String motDePasseClair = genererMotDePasseAleatoire();

        Utilisateur utilisateur = Utilisateur.builder()
                .identifiant(identifiant)
                .motDePasse(passwordEncoder.encode(motDePasseClair))
                .email(email)
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .role(role)
                .build();
        utilisateurRepository.save(utilisateur);

        Facteur facteur = Facteur.builder()
                .nom(nom)
                .prenom(prenom)
                .telephone(telephone)
                .utilisateur(utilisateur)
                .agence(agence)
                .build();
        facteurRepository.save(facteur);

        emailService.envoyerIdentifiants(email, identifiant, motDePasseClair);
        return facteur;
    }

    private String genererIdentifiant(String prefixe, String nom) {
        String base = (prefixe + nom).toLowerCase().replaceAll("[^a-z0-9]", "");
        if (base.length() > 8) base = base.substring(0, 8);

        String identifiant;
        int suffixe = 1;
        do {
            identifiant = base + suffixe;
            suffixe++;
        } while (utilisateurRepository.existsByIdentifiant(identifiant));

        return identifiant;
    }

    private String genererMotDePasseAleatoire() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private AgenceResponse toAgenceResponse(Agence a) {
        Optional<Commercial> commercial = commercialRepository.findByAgence_IdAgence(a.getIdAgence());
        Optional<Facteur> facteur = facteurRepository.findByAgence_IdAgence(a.getIdAgence());

        return AgenceResponse.builder()
                .idAgence(a.getIdAgence())
                .nomAgence(a.getNomAgence())
                .adresse(a.getAdresse())
                .telephone(a.getTelephone())
                .email(a.getEmail())
                .idVille(a.getVille().getIdVille())
                .nomVille(a.getVille().getNomVille())
                .hasCommercial(commercial.isPresent())
                .nomCommercial(commercial.map(c -> c.getPrenom() + " " + c.getNom()).orElse(null))
                .telephoneCommercial(commercial.map(Commercial::getTelephone).orElse(null))
                .emailCommercial(commercial.map(Commercial::getEmail).orElse(null))
                .hasFacteur(facteur.isPresent())
                .nomFacteur(facteur.map(f -> f.getPrenom() + " " + f.getNom()).orElse(null))
                .telephoneFacteur(facteur.map(Facteur::getTelephone).orElse(null))
                .build();
    }

    private CommercialResponse toCommercialResponse(Commercial c) {
        return CommercialResponse.builder()
                .idCommercial(c.getIdUtilisateur())
                .nom(c.getNom())
                .prenom(c.getPrenom())
                .identifiant(c.getIdentifiant())
                .email(c.getEmail())
                .telephone(c.getTelephone())
                .idAgence(c.getAgence().getIdAgence())
                .nomAgence(c.getAgence().getNomAgence())
                .actif(c.getActif())
                .build();
    }

    private FacteurResponse toFacteurResponse(Facteur f) {
        return FacteurResponse.builder()
                .idFacteur(f.getIdFacteur())
                .nom(f.getNom())
                .prenom(f.getPrenom())
                .identifiant(f.getUtilisateur().getIdentifiant())
                .email(f.getUtilisateur().getEmail())
                .telephone(f.getTelephone())
                .idAgence(f.getAgence().getIdAgence())
                .nomAgence(f.getAgence().getNomAgence())
                .actif(f.getUtilisateur().getActif())
                .build();
    }
}