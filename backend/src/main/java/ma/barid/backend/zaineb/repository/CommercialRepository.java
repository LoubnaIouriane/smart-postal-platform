package ma.barid.backend.zaineb.repository;


import ma.barid.backend.zaineb.entity.Commercial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CommercialRepository
        extends JpaRepository<Commercial, Long> {


    boolean existsByAgence_IdAgence(Long idAgence);


    Optional<Commercial> findByAgence_IdAgence(Long idAgence);


    boolean existsByIdentifiant(String identifiant);

}