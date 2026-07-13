package ma.barid.backend.expedition;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpeditionRepository extends JpaRepository<Expedition, Long> {
}