package ma.barid.backend.facturation.repository;

import ma.barid.backend.facturation.entity.LigneFacture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LigneFactureRepository extends JpaRepository<LigneFacture, Long> {
}
