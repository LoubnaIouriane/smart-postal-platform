package ma.barid.backend.expedition;

import ma.barid.backend.auth.entity.Ville;
import ma.barid.backend.auth.repository.VilleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpeditionService {

    private static final BigDecimal POIDS_MAX = new BigDecimal("31");
    private static final BigDecimal POIDS_MIN = new BigDecimal("0.001");

    private final ExpeditionRepository repository;
    private final TranchePoidsRepository trancheRepository;
    private final VilleRepository villeRepository;

    public ExpeditionService(ExpeditionRepository repository,
                             TranchePoidsRepository trancheRepository,
                             VilleRepository villeRepository) {
        this.repository = repository;
        this.trancheRepository = trancheRepository;
        this.villeRepository = villeRepository;
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
        expedition.setNomDestinataire(request.getNomDestinataire());
        expedition.setTelephoneDestinataire(request.getTelephoneDestinataire());
        expedition.setCodeTracking(genererCodeTracking());
        expedition.setStatut(StatutExpedition.EN_ATTENTE);
        expedition.setDateCreation(LocalDateTime.now());
        expedition.setMontant(calculerPrix(request.getPoids()));

        return repository.save(expedition);
    }

    public List<Expedition> listerExpeditions() {
        return repository.findAll();
    }

    public List<Ville> listerVilles() {
        return villeRepository.findAll();
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