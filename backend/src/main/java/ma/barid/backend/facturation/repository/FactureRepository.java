package ma.barid.backend.facturation.repository;

import ma.barid.backend.facturation.entity.Facture;
import ma.barid.backend.facturation.enums.StatutPaiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    long countByNumeroFactureStartingWith(String prefix);
    List<Facture> findByClientId(Long clientId);
    List<Facture> findByStatutPaiementAndDateEmissionBetween(StatutPaiement statut, LocalDate debut, LocalDate fin);
    List<Facture> findByDateEmissionBetween(LocalDate debut, LocalDate fin);
}
