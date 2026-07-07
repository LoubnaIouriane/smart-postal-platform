package ma.barid.backend.zaineb.service;

import ma.barid.backend.zaineb.dto.CommercialDTO;

import java.util.List;

public interface CommercialService {

    List<CommercialDTO> getAll();

    CommercialDTO getById(Long id);

    CommercialDTO save(CommercialDTO dto);

    void delete(Long id);
}