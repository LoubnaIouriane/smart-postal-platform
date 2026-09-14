package ma.barid.backend.facturation.serviceImpl;

import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.facturation.dto.FactureCreateRequest;
import ma.barid.backend.facturation.dto.FactureDTO;
import ma.barid.backend.facturation.dto.FactureGenerationRequest;
import ma.barid.backend.facturation.entity.Facture;
import ma.barid.backend.facturation.entity.LigneFacture;
import ma.barid.backend.facturation.enums.StatutPaiement;
import ma.barid.backend.facturation.exception.ResourceNotFoundException;
import ma.barid.backend.facturation.mapper.FactureMapper;
import ma.barid.backend.facturation.repository.ExpeditionFacturationRepository;
import ma.barid.backend.facturation.repository.FacturableExpedition;
import ma.barid.backend.facturation.repository.FactureRepository;
import ma.barid.backend.facturation.service.FactureService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Service
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final ClientRepository clientRepository;
    private final ExpeditionFacturationRepository expeditionFacturationRepository;
    private final FactureMapper mapper;

    public FactureServiceImpl(
            FactureRepository factureRepository,
            ClientRepository clientRepository,
            ExpeditionFacturationRepository expeditionFacturationRepository,
            FactureMapper mapper
    ) {
        this.factureRepository = factureRepository;
        this.clientRepository = clientRepository;
        this.expeditionFacturationRepository = expeditionFacturationRepository;
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
        throw new IllegalStateException(
                "La facture ne doit pas etre creee manuellement. Elle doit etre generee depuis les expeditions en base."
        );
    }

    @Override
    public FactureDTO genererDepuisExpeditions(FactureGenerationRequest request) {
        if (request.getDateDebut().isAfter(request.getDateFin())) {
            throw new IllegalArgumentException("La date de debut doit etre avant la date de fin.");
        }

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec id=" + request.getClientId()));

        List<FacturableExpedition> expeditions = expeditionFacturationRepository.findFacturablesByClientAndPeriode(
                request.getClientId(),
                request.getDateDebut(),
                request.getDateFin()
        );

        if (expeditions.isEmpty()) {
            throw new IllegalArgumentException("Aucune expedition facturable trouvee pour ce client et cette periode.");
        }

        double montantHT = 0.0;
        Facture facture = new Facture();

        for (FacturableExpedition expedition : expeditions) {
            LigneFacture ligne = new LigneFacture();
            ligne.setDesignation(buildDesignation(expedition));
            ligne.setQuantite(1);
            ligne.setPrixUnitaire(expedition.getCoutCalcule());
            ligne.setExpeditionId(expedition.getIdExpedition());
            ligne.setCodeExpedition(expedition.getCodeExpedition());
            ligne.setTypeEnvoi(expedition.getTypeEnvoi());
            ligne.setPoidsDeclare(expedition.getPoidsDeclare());
            ligne.setPoidsReel(expedition.getPoidsReel());
            ligne.setDestinataireNom(expedition.getDestinataireNom());
            ligne.setDestinataireTelephone(expedition.getDestinataireTelephone());
            ligne.setDestinataireAdresse(expedition.getDestinataireAdresse());
            ligne.setMotifModificationTarif(expedition.getMotifModificationTarif());
            ligne.setVilleDepartId(expedition.getVilleDepartId());
            ligne.setVilleDestinationId(expedition.getVilleDestinationId());
            ligne.setMontantLigne(expedition.getCoutCalcule());
            ligne.setFacture(facture);
            facture.getLignes().add(ligne);
            montantHT += ligne.getMontantLigne();
        }

        double tauxRemise = calculerTauxRemise(expeditions.size());
        double montantRemise = montantHT * (tauxRemise / 100.0);
        double montantHTApresRemise = montantHT - montantRemise;
        double tauxTVA = request.getTauxTVA() != null ? request.getTauxTVA() : 20.0;
        double montantTVA = montantHTApresRemise * (tauxTVA / 100.0);
        double montantTTC = montantHTApresRemise + montantTVA;

        String prefix = "FAC-" + Year.now().getValue() + "-";
        long count = factureRepository.countByNumeroFactureStartingWith(prefix) + 1;

        facture.setNumeroFacture(prefix + String.format("%06d", count));
        facture.setClientId(request.getClientId());
        facture.setClientRaisonSociale(defaultText(client.getRaisonSociale(), "Client " + request.getClientId()));
        facture.setClientIdentifiant(defaultText(client.getIdentifiant(), String.valueOf(request.getClientId())));
        facture.setDateEmission(LocalDate.now());
        facture.setDateEcheance(LocalDate.now().plusDays(30));
        facture.setDateDebutFacturation(request.getDateDebut());
        facture.setDateFinFacturation(request.getDateFin());
        facture.setSourceGeneration("EXPEDITIONS_BASE_DONNEES");
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

    private String buildDesignation(FacturableExpedition expedition) {
        String code = defaultText(expedition.getCodeExpedition(), "EXP-" + expedition.getIdExpedition());
        String type = defaultText(expedition.getTypeEnvoi(), "Expedition");
        return type + " - " + code;
    }

    private double calculerTauxRemise(int nombreExpeditions) {
        if (nombreExpeditions >= 100) {
            return 15.0;
        }
        if (nombreExpeditions >= 50) {
            return 10.0;
        }
        if (nombreExpeditions >= 10) {
            return 5.0;
        }
        return 0.0;
    }
}
