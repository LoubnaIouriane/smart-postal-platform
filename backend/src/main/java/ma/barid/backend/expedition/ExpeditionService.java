package ma.barid.backend.expedition;

import ma.barid.backend.auth.entity.Ville;
import ma.barid.backend.auth.repository.VilleRepository;
import ma.barid.backend.facteur.Facteur;
import ma.barid.backend.facteur.FacteurRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ExpeditionService {

    private static final BigDecimal POIDS_MAX = new BigDecimal("31");
    private static final BigDecimal POIDS_MIN = new BigDecimal("0.001");
    private static final long DELAI_ANNULATION_MINUTES = 10;

    private final ExpeditionRepository repository;
    private final TranchePoidsRepository trancheRepository;
    private final VilleRepository villeRepository;
    private final FacteurRepository facteurRepository;

    public ExpeditionService(ExpeditionRepository repository,
                             TranchePoidsRepository trancheRepository,
                             VilleRepository villeRepository,
                             FacteurRepository facteurRepository) {
        this.repository = repository;
        this.trancheRepository = trancheRepository;
        this.villeRepository = villeRepository;
        this.facteurRepository = facteurRepository;
    }

    public Expedition creerExpedition(ExpeditionRequest request) {
        if (request.getPoids() == null) {
            throw new IllegalArgumentException("Le poids est obligatoire.");
        }

        BigDecimal poidsBd = BigDecimal.valueOf(request.getPoids());

        if (poidsBd.compareTo(POIDS_MIN) < 0) {
            throw new IllegalArgumentException("Le poids minimum autorisé est de 0,001 kg.");
        }
        if (poidsBd.compareTo(POIDS_MAX) > 0) {
            throw new IllegalArgumentException("Le poids maximum autorisé est de 31 kg.");
        }

        Ville depart = villeRepository.findById(request.getIdVilleDepart())
                .orElseThrow(() -> new IllegalArgumentException("Ville de départ invalide."));
        Ville destination = villeRepository.findById(request.getIdVilleDestination())
                .orElseThrow(() -> new IllegalArgumentException("Ville de destination invalide."));

        Expedition expedition = new Expedition();
        expedition.setTypeEnvoi(request.getTypeEnvoi());
        expedition.setPoids(request.getPoids());
        expedition.setVilleDepart(depart);
        expedition.setVilleDestination(destination);
        expedition.setTelephoneExpediteur(request.getTelephoneExpediteur());
        expedition.setAdresseExpediteur(request.getAdresseExpediteur());
        expedition.setNomDestinataire(request.getNomDestinataire());
        expedition.setTelephoneDestinataire(request.getTelephoneDestinataire());
        expedition.setAdresseDestinataire(request.getAdresseDestinataire());
        expedition.setCodeTracking(genererCodeTracking());
        expedition.setStatut(StatutExpedition.EN_ATTENTE);
        expedition.setDateCreation(LocalDateTime.now());
        expedition.setMontant(calculerPrix(request.getPoids()));

        return repository.save(expedition);
    }

    public List<Expedition> listerExpeditions() {
        return repository.findAll();
    }

    public List<Expedition> listerExpeditionsACollecter() {
        return repository.findByStatutIn(List.of(StatutExpedition.EN_ATTENTE, StatutExpedition.VALIDEE));
    }

    public List<Ville> listerVilles() {
        return villeRepository.findAll();
    }

    public List<Facteur> listerFacteurs() {
        return facteurRepository.findAll();
    }

    public Expedition trouverParCode(String code) {
        return repository.findByCodeTracking(code)
                .orElseThrow(() -> new IllegalArgumentException("Aucune expédition trouvée avec ce code."));
    }

    public Expedition changerStatut(Long id, StatutExpedition nouveauStatut) {
        Expedition expedition = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expédition introuvable."));

        if (!transitionAutorisee(expedition.getStatut(), nouveauStatut)) {
            throw new IllegalArgumentException(
                    "Transition interdite : " + expedition.getStatut() + " → " + nouveauStatut);
        }

        expedition.setStatut(nouveauStatut);

        if (nouveauStatut == StatutExpedition.ANNULEE) {
            expedition.setDateAnnulation(LocalDateTime.now());
        }

        return repository.save(expedition);
    }

    private boolean transitionAutorisee(StatutExpedition actuel, StatutExpedition nouveau) {
        return switch (actuel) {
            case EN_ATTENTE -> nouveau == StatutExpedition.VALIDEE || nouveau == StatutExpedition.ANNULEE;
            case VALIDEE -> nouveau == StatutExpedition.COLLECTEE || nouveau == StatutExpedition.ANNULEE;
            case COLLECTEE, ANNULEE -> false;
        };
    }

    public Expedition annulerExpedition(Long id) {
        Expedition expedition = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expédition introuvable."));

        if (expedition.getStatut() == StatutExpedition.ANNULEE) {
            throw new IllegalArgumentException("Cette expédition est déjà annulée.");
        }
        if (expedition.getStatut() == StatutExpedition.COLLECTEE) {
            throw new IllegalArgumentException("Impossible d'annuler une expédition déjà collectée.");
        }

        if (expedition.getHeureCollecte() != null) {
            long minutesRestantes = ChronoUnit.MINUTES.between(LocalDateTime.now(), expedition.getHeureCollecte());
            if (minutesRestantes < DELAI_ANNULATION_MINUTES) {
                throw new IllegalArgumentException(
                        "Annulation impossible : moins de 10 minutes avant la collecte.");
            }
        }

        expedition.setStatut(StatutExpedition.ANNULEE);
        expedition.setDateAnnulation(LocalDateTime.now());
        return repository.save(expedition);
    }

    public Expedition assignerFacteur(Long idExpedition, Long idFacteur) {
        Expedition expedition = repository.findById(idExpedition)
                .orElseThrow(() -> new IllegalArgumentException("Expédition introuvable."));
        Facteur facteur = facteurRepository.findById(idFacteur)
                .orElseThrow(() -> new IllegalArgumentException("Facteur introuvable."));

        expedition.setFacteurAssigne(facteur);
        return repository.save(expedition);
    }

    public Expedition enregistrerPoidsReel(Long idExpedition, Double poidsReel) {
        Expedition expedition = repository.findById(idExpedition)
                .orElseThrow(() -> new IllegalArgumentException("Expédition introuvable."));

        expedition.setPoidsReel(poidsReel);

        if (!poidsReel.equals(expedition.getPoids())) {
            expedition.setPoids(poidsReel);
            expedition.setMontant(calculerPrix(poidsReel));
        }

        expedition.setStatut(StatutExpedition.COLLECTEE);
        return repository.save(expedition);
    }

    private String genererCodeTracking() {
        long count = repository.count() + 1;
        return "EXP" + String.format("%09d", count);
    }

    private BigDecimal calculerPrix(Double poids) {
        BigDecimal poidsBd = BigDecimal.valueOf(poids);
        return trancheRepository.findTrancheForPoids(poidsBd)
                .map(TranchePoids::getPrix)
                .orElse(BigDecimal.ZERO);
    }
}