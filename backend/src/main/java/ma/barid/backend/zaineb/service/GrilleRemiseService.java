package ma.barid.backend.zaineb.service;

import ma.barid.backend.zaineb.dto.GrilleRemiseDTO;

import java.util.List;

public interface GrilleRemiseService {

    List<GrilleRemiseDTO> getAll();

    GrilleRemiseDTO getById(Long id);

    GrilleRemiseDTO save(GrilleRemiseDTO dto);

    void delete(Long id);
}