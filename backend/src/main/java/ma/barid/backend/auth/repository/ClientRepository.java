// auth/repository/ClientRepository.java
package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}