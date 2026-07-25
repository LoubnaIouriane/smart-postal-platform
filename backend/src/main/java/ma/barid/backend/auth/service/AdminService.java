package ma.barid.backend.auth.service;

import ma.barid.backend.auth.dto.*;

import java.util.List;

public interface AdminService {

    DashboardStatsResponse getDashboardStats();

    List<VilleResponse> listVilles();

    // ---- Agences ----
    List<AgenceResponse> listAgences();
    AgenceResponse createAgence(AgenceRequest request);
    AgenceResponse updateAgence(Long idAgence, AgenceRequest request);
    void deleteAgence(Long idAgence);

    // ---- Commerciaux ----
    List<CommercialResponse> listCommerciaux();
    CommercialResponse createCommercial(CommercialRequest request);
    CommercialResponse updateCommercial(Long id, CommercialRequest request);
    void deleteCommercial(Long id);

    // ---- Facteurs ----
    List<FacteurResponse> listFacteurs();
    FacteurResponse createFacteur(FacteurRequest request);
    FacteurResponse updateFacteur(Long id, FacteurRequest request);
    void deleteFacteur(Long id);
}
