package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Commercial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommercialRepository extends JpaRepository<Commercial, Long> {
}
