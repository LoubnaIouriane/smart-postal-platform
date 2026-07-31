package ma.barid.backend.facturation.serviceImpl;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.facturation.dto.FactureCreateRequest;
import ma.barid.backend.facturation.service.FactureGenerationService;
import ma.barid.backend.facturation.service.FactureService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class FactureGenerationServiceImpl implements FactureGenerationService {

    private static final Logger log = Logger.getLogger(FactureGenerationServiceImpl.class.getName());

    private final ClientRepository clientRepository;
    private final FactureService factureService;

    // S'execute automatiquement le 1er de chaque mois a 01h00
    @Scheduled(cron = "0 0 1 1 * ?")
    @Override
    public void genererFacturesMensuelles() {
        List<Client> clients = clientRepository.findAll();

        for (Client client : clients) {
            // TODO (integration future avec le module Expedition d'Etudiant 3) :
            // recuperer ici la liste des expeditions du mois ecoule pour ce client,
            // et construire les lignes de facture a partir de leur poids/tarif reel.
            // Pour l'instant, on ne genere une facture que s'il y a au moins une ligne
            // fournie manuellement -- cette methode sert surtout de structure prete a brancher.

            log.info("Verification facturation mensuelle pour client id=" + client.getIdUtilisateur());
            // Exemple de generation (a activer une fois les donnees d'expedition disponibles) :
            //
            // FactureCreateRequest request = new FactureCreateRequest();
            // request.setClientId(client.getIdUtilisateur());
            // request.setTauxTVA(20.0);
            // request.setLignes(lignesCalculeesDepuisExpeditions);
            // factureService.create(request);
        }
    }
}
