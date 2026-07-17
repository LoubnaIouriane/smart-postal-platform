package ma.barid.backend.zaineb.repository;

import ma.barid.backend.zaineb.entity.ContratClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContratClientRepository extends JpaRepository<ContratClient, Long> {

}