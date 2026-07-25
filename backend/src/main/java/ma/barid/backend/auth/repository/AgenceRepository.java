package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Ville;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgenceRepository extends JpaRepository<Agence, Long> {
    List<Agence> findByVille(Ville ville);
    Optional<Agence> findFirstByVille(Ville ville);
}
