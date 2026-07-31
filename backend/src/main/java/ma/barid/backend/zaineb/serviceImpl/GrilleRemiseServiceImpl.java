package ma.barid.backend.zaineb.serviceimpl;


import lombok.RequiredArgsConstructor;

import ma.barid.backend.zaineb.dto.GrilleRemiseDTO;
import ma.barid.backend.zaineb.entity.GrilleRemise;
import ma.barid.backend.zaineb.mapper.GrilleRemiseMapper;
import ma.barid.backend.zaineb.repository.GrilleRemiseRepository;
import ma.barid.backend.zaineb.service.GrilleRemiseService;

import org.springframework.stereotype.Service;

import java.util.List;



@Service
@RequiredArgsConstructor
public class GrilleRemiseServiceImpl implements GrilleRemiseService {


    private final GrilleRemiseRepository repository;

    private final GrilleRemiseMapper mapper;




    @Override
    public List<GrilleRemiseDTO> getAll(){


        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();

    }




    @Override
    public GrilleRemiseDTO getById(Long id){


        GrilleRemise grille = repository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Grille remise introuvable")
                );


        return mapper.toDTO(grille);

    }





    @Override
    public GrilleRemiseDTO save(GrilleRemiseDTO dto){


        GrilleRemise grille = mapper.toEntity(dto);


        return mapper.toDTO(repository.save(grille));

    }




    @Override
    public void delete(Long id){


        repository.deleteById(id);

    }


}