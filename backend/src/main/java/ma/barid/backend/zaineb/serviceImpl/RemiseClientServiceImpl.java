package ma.barid.backend.zaineb.serviceimpl;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.zaineb.dto.RemiseClientDTO;
import ma.barid.backend.zaineb.entity.RemiseClient;
import ma.barid.backend.zaineb.repository.RemiseClientRepository;
import ma.barid.backend.zaineb.service.RemiseClientService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RemiseClientServiceImpl implements RemiseClientService {

    private final RemiseClientRepository repository;
    private final ClientRepository clientRepository;


    @Override
    public List<RemiseClientDTO> getByClient(Long clientId) {

        return repository.findByClientIdUtilisateur(clientId)
                .stream()
                .map(r -> RemiseClientDTO.builder()
                        .idRemiseClient(r.getIdRemiseClient())
                        .montantMin(r.getMontantMin())
                        .montantMax(r.getMontantMax())
                        .tauxRemise(r.getTauxRemise())
                        .clientId(r.getClient().getIdUtilisateur())
                        .build()
                )
                .toList();
    }


    @Override
    public RemiseClientDTO save(RemiseClientDTO dto) {

        RemiseClient r = new RemiseClient();

        r.setMontantMin(dto.getMontantMin());
        r.setMontantMax(dto.getMontantMax());
        r.setTauxRemise(dto.getTauxRemise());


        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(
                        () -> new RuntimeException("Client introuvable")
                );


        r.setClient(client);


        RemiseClient saved = repository.save(r);


        return RemiseClientDTO.builder()
                .idRemiseClient(saved.getIdRemiseClient())
                .montantMin(saved.getMontantMin())
                .montantMax(saved.getMontantMax())
                .tauxRemise(saved.getTauxRemise())
                .clientId(saved.getClient().getIdUtilisateur())
                .build();
    }



    @Override
    public void delete(Long id) {

        repository.deleteById(id);

    }

}