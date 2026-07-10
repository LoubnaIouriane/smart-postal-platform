package ma.barid.backend.zaineb.repository;

import ma.barid.backend.zaineb.entity.Commercial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommercialRepository extends JpaRepository<Commercial, Long> {
    boolean existsByIdentifiant(String identifiant);
}
