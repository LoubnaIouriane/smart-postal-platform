package ma.barid.backend.facturation.serviceImpl;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.facturation.dto.FactureGenerationRequest;
import ma.barid.backend.facturation.service.FactureGenerationService;
import ma.barid.backend.facturation.service.FactureService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        LocalDate premierJourMoisPrecedent = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        LocalDate dernierJourMoisPrecedent = premierJourMoisPrecedent.withDayOfMonth(
                premierJourMoisPrecedent.lengthOfMonth()
        );

        for (Client client : clients) {
            try {
                FactureGenerationRequest request = new FactureGenerationRequest();
                request.setClientId(client.getIdUtilisateur());
                request.setDateDebut(premierJourMoisPrecedent);
                request.setDateFin(dernierJourMoisPrecedent);
                request.setTauxTVA(20.0);

                factureService.genererDepuisExpeditions(request);
                log.info("Facture mensuelle generee pour client id=" + client.getIdUtilisateur());
            } catch (RuntimeException exception) {
                log.info("Aucune facture mensuelle generee pour client id="
                        + client.getIdUtilisateur()
                        + " : "
                        + exception.getMessage());
            }
        }
    }
}
