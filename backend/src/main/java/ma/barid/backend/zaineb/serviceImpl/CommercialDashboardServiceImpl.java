package ma.barid.backend.zaineb.serviceimpl;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.enums.StatutClient;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.zaineb.dto.CommercialDashboardDTO;
import ma.barid.backend.zaineb.repository.ContratClientRepository;
import ma.barid.backend.zaineb.service.CommercialDashboardService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommercialDashboardServiceImpl implements CommercialDashboardService {

    private final ClientRepository clientRepository;
    private final ContratClientRepository contratRepository;

    @Override
    public CommercialDashboardDTO getStatistiques() {

        return CommercialDashboardDTO.builder()
                .nombreClients(clientRepository.count())
                .nombreContrats(contratRepository.count())
                .demandesEnAttente(
                        (long) clientRepository.findByStatut(StatutClient.PRE_INSCRIPTION).size()
                )
                .build();

    }

}