package ma.barid.backend.zaineb.repository;

import ma.barid.backend.zaineb.entity.RemiseClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemiseClientRepository extends JpaRepository<RemiseClient, Long> {

    List<RemiseClient> findByClientIdUtilisateur(Long clientId);

}