// auth/repository/AgenceRepository.java
package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Ville;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AgenceRepository extends JpaRepository<Agence, String> {
    Optional<Agence> findByVille(Ville ville);
}