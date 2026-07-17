package ma.barid.backend.facturation.serviceImpl;

import ma.barid.backend.facturation.dto.FactureCreateRequest;
import ma.barid.backend.facturation.dto.FactureDTO;
import ma.barid.backend.facturation.entity.Facture;
import ma.barid.backend.facturation.entity.LigneFacture;
import ma.barid.backend.facturation.enums.StatutPaiement;
import ma.barid.backend.facturation.exception.ResourceNotFoundException;
import ma.barid.backend.facturation.mapper.FactureMapper;
import ma.barid.backend.facturation.repository.FactureRepository;
import ma.barid.backend.facturation.service.FactureService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Service
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final FactureMapper mapper;

    public FactureServiceImpl(FactureRepository factureRepository, FactureMapper mapper) {
        this.factureRepository = factureRepository;
        this.mapper = mapper;
    }

    @Override
    public List<FactureDTO> getAll() {
        return mapper.toDTOList(factureRepository.findAll());
    }

    @Override
    public FactureDTO getById(Long id) {
        return mapper.toDTO(findEntity(id));
    }

    @Override
    public List<FactureDTO> getByClient(Long clientId) {
        return mapper.toDTOList(factureRepository.findByClientId(clientId));
    }

    @Override
    public FactureDTO create(FactureCreateRequest request) {
        double montantHT = 0.0;
        Facture facture = new Facture();

        for (FactureCreateRequest.LigneFactureRequest ligneRequest : request.getLignes()) {
            LigneFacture ligne = new LigneFacture();
            ligne.setDesignation(ligneRequest.getDesignation());
            ligne.setQuantite(ligneRequest.getQuantite());
            ligne.setPrixUnitaire(ligneRequest.getPrixUnitaire());
            ligne.setExpeditionId(ligneRequest.getExpeditionId());
            ligne.setMontantLigne(ligneRequest.getQuantite() * ligneRequest.getPrixUnitaire());
            ligne.setFacture(facture);
            facture.getLignes().add(ligne);
            montantHT += ligne.getMontantLigne();
        }

        double tauxRemise = request.getTauxRemise() != null ? request.getTauxRemise() : 0.0;
        double montantRemise = montantHT * (tauxRemise / 100.0);
        double montantHTApresRemise = montantHT - montantRemise;
        double tauxTVA = request.getTauxTVA() != null ? request.getTauxTVA() : 20.0;
        double montantTVA = montantHTApresRemise * (tauxTVA / 100.0);
        double montantTTC = montantHTApresRemise + montantTVA;

        String prefix = "FAC-" + Year.now().getValue() + "-";
        long count = factureRepository.countByNumeroFactureStartingWith(prefix) + 1;

        facture.setNumeroFacture(prefix + String.format("%06d", count));
        facture.setClientId(request.getClientId());
        facture.setClientRaisonSociale(defaultText(request.getClientRaisonSociale(), "Client " + request.getClientId()));
        facture.setClientIdentifiant(defaultText(request.getClientIdentifiant(), String.valueOf(request.getClientId())));
        facture.setDateEmission(LocalDate.now());
        facture.setDateEcheance(LocalDate.now().plusDays(30));
        facture.setMontantHT(montantHT);
        facture.setTauxRemise(tauxRemise);
        facture.setMontantRemise(montantRemise);
        facture.setTauxTVA(tauxTVA);
        facture.setMontantTVA(montantTVA);
        facture.setMontantTTC(montantTTC);
        facture.setStatutPaiement(StatutPaiement.NON_PAYEE);

        return mapper.toDTO(factureRepository.save(facture));
    }

    @Override
    public FactureDTO marquerPayee(Long id) {
        Facture facture = findEntity(id);
        facture.setStatutPaiement(StatutPaiement.PAYEE);
        facture.setDatePaiement(LocalDate.now());
        return mapper.toDTO(factureRepository.save(facture));
    }

    @Override
    public List<FactureDTO> rechercher(String statut, LocalDate debut, LocalDate fin) {
        LocalDate debutEffectif = debut != null ? debut : LocalDate.of(2000, 1, 1);
        LocalDate finEffective = fin != null ? fin : LocalDate.now();

        if (statut != null && !statut.isBlank()) {
            return mapper.toDTOList(factureRepository.findByStatutPaiementAndDateEmissionBetween(
                    StatutPaiement.valueOf(statut), debutEffectif, finEffective));
        }

        return mapper.toDTOList(factureRepository.findByDateEmissionBetween(debutEffectif, finEffective));
    }

    @Override
    public boolean appartientA(Long idFacture, String identifiantUtilisateur) {
        Facture facture = findEntity(idFacture);
        return facture.getClientIdentifiant() != null
                && facture.getClientIdentifiant().equals(identifiantUtilisateur);
    }

    private Facture findEntity(Long id) {
        return factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture introuvable avec id=" + id));
    }

    private String defaultText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
