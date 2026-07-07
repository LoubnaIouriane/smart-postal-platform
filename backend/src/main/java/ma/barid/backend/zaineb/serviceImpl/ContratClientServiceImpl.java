package ma.barid.backend.zaineb.serviceimpl;


import lombok.RequiredArgsConstructor;

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

}