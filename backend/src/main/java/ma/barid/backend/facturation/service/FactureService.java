package ma.barid.backend.facturation.service;

import ma.barid.backend.facturation.dto.FactureCreateRequest;
import ma.barid.backend.facturation.dto.FactureDTO;
import ma.barid.backend.facturation.dto.FactureGenerationRequest;

import java.time.LocalDate;
import java.util.List;

public interface FactureService {
    List<FactureDTO> getAll();
    FactureDTO getById(Long id);
    List<FactureDTO> getByClient(Long clientId);
    FactureDTO create(FactureCreateRequest request);
    FactureDTO genererDepuisExpeditions(FactureGenerationRequest request);
    FactureDTO marquerPayee(Long id);
    List<FactureDTO> rechercher(String statut, LocalDate debut, LocalDate fin);
    boolean appartientA(Long idFacture, String identifiantUtilisateur);
}
