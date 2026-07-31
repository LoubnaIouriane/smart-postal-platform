package ma.barid.backend.zaineb.serviceimpl;

import lombok.RequiredArgsConstructor;

import ma.barid.backend.zaineb.entity.ContratClient;
import ma.barid.backend.zaineb.repository.ContratClientRepository;
import ma.barid.backend.zaineb.service.ContratClientService;
import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.mapper.ContratClientMapper;

import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ContratClientServiceImpl implements ContratClientService {



    private final ContratClientRepository contratRepository;

    private final ContratClientMapper mapper;



    @Override
    public List<ContratClientDTO> getAll() {

        return contratRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());

    }




    @Override
    public ContratClientDTO getById(Long id) {


        ContratClient contrat = contratRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Contrat introuvable")
                );


        return mapper.toDTO(contrat);

    }





    @Override
    public ContratClientDTO save(ContratClientDTO dto) {


        ContratClient contrat = mapper.toEntity(dto);


        ContratClient saved = contratRepository.save(contrat);


        return mapper.toDTO(saved);

    }





    @Override
    public void delete(Long id) {

        contratRepository.deleteById(id);

    }


}