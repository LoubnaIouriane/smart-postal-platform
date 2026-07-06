// auth/repository/RoleRepository.java
package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByNomRole(String nomRole);
}