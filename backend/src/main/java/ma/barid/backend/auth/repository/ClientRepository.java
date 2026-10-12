
package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.enums.StatutClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    boolean existsByAgence_IdAgence(Long idAgence);

    // Récupérer les clients selon leur statut
    List<Client> findByStatut(StatutClient statut);

    // Récupérer un client selon son identifiant
    Optional<Client> findByIdentifiant(String identifiant);
}
