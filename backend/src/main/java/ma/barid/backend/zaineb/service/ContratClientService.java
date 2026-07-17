package ma.barid.backend.zaineb.service;

import ma.barid.backend.zaineb.dto.ContratClientDTO;

import java.util.List;

public interface ContratClientService {

    List<ContratClientDTO> getAll();

    ContratClientDTO getById(Long id);

    ContratClientDTO save(ContratClientDTO dto);

    void delete(Long id);
}