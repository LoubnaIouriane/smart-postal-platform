package ma.barid.backend.expedition;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpeditionRepository extends JpaRepository<Expedition, Long> {
    Optional<Expedition> findByCodeTracking(String codeTracking);
    List<Expedition> findByStatut(StatutExpedition statut);
    List<Expedition> findByStatutIn(List<StatutExpedition> statuts);
}