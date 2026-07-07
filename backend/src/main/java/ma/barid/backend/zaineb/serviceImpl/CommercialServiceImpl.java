package ma.barid.backend.zaineb.serviceimpl;


import lombok.RequiredArgsConstructor;

import ma.barid.backend.zaineb.dto.CommercialDTO;
import ma.barid.backend.zaineb.entity.Commercial;
import ma.barid.backend.zaineb.mapper.CommercialMapper;
import ma.barid.backend.zaineb.repository.CommercialRepository;
import ma.barid.backend.zaineb.service.CommercialService;

import org.springframework.stereotype.Service;


import java.util.List;



@Service
@RequiredArgsConstructor
public class CommercialServiceImpl implements CommercialService {


    private final CommercialRepository repository;

    private final CommercialMapper mapper;




    @Override
    public List<CommercialDTO> getAll(){

        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();

    }





    @Override
    public CommercialDTO getById(Long id){

        Commercial commercial = repository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Commercial introuvable")
                );


        return mapper.toDTO(commercial);

    }





    @Override
    public CommercialDTO save(CommercialDTO dto){

        Commercial commercial = mapper.toEntity(dto);

        return mapper.toDTO(repository.save(commercial));

    }





    @Override
    public void delete(Long id){

        repository.deleteById(id);

    }

}