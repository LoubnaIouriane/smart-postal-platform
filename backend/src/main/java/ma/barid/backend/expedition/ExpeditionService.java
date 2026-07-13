package ma.barid.backend.expedition;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpeditionService {

    private final ExpeditionRepository repository;

    public ExpeditionService(ExpeditionRepository repository) {
        this.repository = repository;
    }

    public Expedition creerExpedition(Expedition expedition) {
        expedition.setCodeTracking(genererCodeTracking());
        expedition.setStatut(StatutExpedition.EN_ATTENTE);
        expedition.setDateCreation(LocalDateTime.now());
        return repository.save(expedition);
    }

    public List<Expedition> listerExpeditions() {
        return repository.findAll();
    }

    private String genererCodeTracking() {
        long count = repository.count() + 1;
        return "EXP" + String.format("%09d", count);
    }
}