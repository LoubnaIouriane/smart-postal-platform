// auth/repository/VilleRepository.java
package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Ville;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VilleRepository extends JpaRepository<Ville, Long> {
}