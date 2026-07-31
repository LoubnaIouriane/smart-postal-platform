package ma.barid.backend.zaineb.repository;


import ma.barid.backend.zaineb.entity.GrilleRemise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GrilleRemiseRepository
        extends JpaRepository<GrilleRemise, Long> {

}