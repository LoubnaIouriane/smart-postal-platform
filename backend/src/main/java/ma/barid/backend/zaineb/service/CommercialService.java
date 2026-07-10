package ma.barid.backend.zaineb.service;

import ma.barid.backend.zaineb.dto.CommercialCreateRequest;
import ma.barid.backend.zaineb.dto.CommercialDTO;

import java.util.List;

public interface CommercialService {
    List getAll();
    CommercialDTO getById(Long id);
    CommercialDTO create(CommercialCreateRequest request);
    CommercialDTO update(Long id, CommercialCreateRequest request);
    void delete(Long id);
}