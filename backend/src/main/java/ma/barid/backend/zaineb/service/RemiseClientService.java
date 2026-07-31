package ma.barid.backend.zaineb.service;

import ma.barid.backend.zaineb.dto.RemiseClientDTO;

import java.util.List;

public interface RemiseClientService {


    List<RemiseClientDTO> getByClient(Long clientId);


    RemiseClientDTO save(RemiseClientDTO dto);


    void delete(Long id);

}