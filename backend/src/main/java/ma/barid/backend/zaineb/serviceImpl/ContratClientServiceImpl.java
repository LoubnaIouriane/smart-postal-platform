package ma.barid.backend.zaineb.serviceimpl;

import lombok.RequiredArgsConstructor;

import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.repository.ClientRepository;

import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.entity.ContratClient;
import ma.barid.backend.zaineb.entity.GrilleRemise;
import ma.barid.backend.zaineb.mapper.ContratClientMapper;
import ma.barid.backend.zaineb.repository.ContratClientRepository;
import ma.barid.backend.zaineb.repository.GrilleRemiseRepository;
import ma.barid.backend.zaineb.service.ContratClientService;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ContratClientServiceImpl implements ContratClientService {


    private final ContratClientRepository repository;

    private final ContratClientMapper mapper;

    private final ClientRepository clientRepository;

    private final GrilleRemiseRepository grilleRemiseRepository;


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


        if(dto.getClientId() != null){

            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(
                            () -> new RuntimeException("Client introuvable")
                    );

            contrat.setClient(client);
        }


        if(dto.getGrilleRemiseId() != null){

            GrilleRemise grille = grilleRemiseRepository.findById(dto.getGrilleRemiseId())
                    .orElseThrow(
                            () -> new RuntimeException("Grille remise introuvable")
                    );

            contrat.setGrilleRemise(grille);
        }


        return mapper.toDTO(repository.save(contrat));
    }


    @Override
    public void delete(Long id){

        repository.deleteById(id);
    }

}