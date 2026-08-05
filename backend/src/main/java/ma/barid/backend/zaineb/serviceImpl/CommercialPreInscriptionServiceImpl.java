package ma.barid.backend.zaineb.serviceimpl;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.enums.StatutClient;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.zaineb.service.CommercialPreInscriptionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommercialPreInscriptionServiceImpl
        implements CommercialPreInscriptionService {


    private final ClientRepository clientRepository;



    @Override
    public List<Client> getDemandes() {

        return clientRepository.findByStatut(
                StatutClient.PRE_INSCRIPTION
        );

    }




    @Override
    public Client valider(Long id) {


        Client client = clientRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Client introuvable"
                        )
                );


        client.setStatut(
                StatutClient.VALIDE
        );


        client.setActif(true);


        return clientRepository.save(client);

    }





    @Override
    public Client refuser(Long id) {


        Client client = clientRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Client introuvable"
                        )
                );


        client.setStatut(
                StatutClient.REFUSE
        );


        return clientRepository.save(client);

    }

}