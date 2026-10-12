
package ma.barid.backend.expedition;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ExpeditionRepository extends JpaRepository<Expedition, Long> {

    // Rechercher une expédition par son code de tracking
    Optional<Expedition> findByCodeTracking(String codeTracking);

    // Rechercher les expéditions selon leur statut
    List<Expedition> findByStatut(StatutExpedition statut);

    // Rechercher les expéditions selon plusieurs statuts
    List<Expedition> findByStatutIn(List<StatutExpedition> statuts);

    // Rechercher une expédition par son code et l'identifiant du client
    Optional<Expedition> findByCodeTrackingAndClient_IdUtilisateur(
            String codeTracking,
            Long idClient
    );

    // Récupérer les 20 dernières expéditions d'un client
    List<Expedition> findTop20ByClient_IdUtilisateurOrderByDateCreationDesc(
            Long idClient
    );

    // Récupérer toutes les expéditions d'un client
    List<Expedition> findByClient_IdUtilisateur(Long idClient);

    // Rechercher les expéditions créées entre deux dates
    List<Expedition> findByDateCreationBetween(
            LocalDateTime debut,
            LocalDateTime fin
    );

    // Récupérer les 20 anciennes expéditions correspondant aux statuts
    // et créées avant la date limite
    List<Expedition> findTop20ByStatutInAndDateCreationBeforeOrderByDateCreationAsc(
            List<StatutExpedition> statuts,
            LocalDateTime limite
    );

    // Récupérer les 5 expéditions ayant les montants les plus élevés
    List<Expedition> findTop5ByOrderByMontantDesc();
}
