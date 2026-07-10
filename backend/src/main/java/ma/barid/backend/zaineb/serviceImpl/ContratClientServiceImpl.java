package ma.barid.backend.zaineb.serviceimpl;


import lombok.RequiredArgsConstructor;
import ma.barid.backend.zaineb.mapper.ContratClientMapper;

import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.entity.ContratClient;
import ma.barid.backend.zaineb.repository.ContratClientRepository;
import ma.barid.backend.zaineb.service.ContratClientService;

import org.springframework.stereotype.Service;


import java.util.List;



@Service
@RequiredArgsConstructor
public class ContratClientServiceImpl implements ContratClientService {



    private final ContratClientRepository repository;

    private final ContratClientMapper mapper;





    @Override
    public List<ContratClientDTO> getAll(){

        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();

    }





    @Override
    public ContratClientDTO getById(Long id){

        ContratClient contrat = repository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Contrat introuvable")
                );


        return mapper.toDTO(contrat);

    }





    @Override
    public ContratClientDTO save(ContratClientDTO dto){

        ContratClient contrat = mapper.toEntity(dto);

        return mapper.toDTO(repository.save(contrat));

    }





    @Override
    public void delete(Long id){

        repository.deleteById(id);

    }
    @Override
    // A ajouter/adapter dans ContratClientServiceImpl.java
    private final ClientRepository clientRepository; // import ma.barid.backend.auth.repository.ClientRepository (lecture seule)
    private final GrilleRemiseRepository grilleRemiseRepository;

    public ContratClientDTO save(ContratClientDTO dto) {
        ContratClient contrat = mapper.toEntity(dto);

        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));
            contrat.setClient(client);
        }
        if (dto.getGrilleRemiseId() != null) {
            GrilleRemise grille = grilleRemiseRepository.findById(dto.getGrilleRemiseId())
                    .orElseThrow(() -> new RuntimeException("Grille de remise introuvable"));
            contrat.setGrilleRemise(grille);
        }

        return mapper.toDTO(contratClientRepository.save(contrat));
    }

}