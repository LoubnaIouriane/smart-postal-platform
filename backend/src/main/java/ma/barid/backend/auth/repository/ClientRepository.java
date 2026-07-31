// auth/repository/ClientRepository.java

package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.enums.StatutClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {


    // Récupérer les clients selon leur statut
    List<Client> findByStatut(StatutClient statut);


}