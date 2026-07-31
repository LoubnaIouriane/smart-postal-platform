package ma.barid.backend.zaineb.controller;


import lombok.RequiredArgsConstructor;
import ma.barid.backend.zaineb.dto.RemiseClientDTO;
import ma.barid.backend.zaineb.service.RemiseClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/commercial/remises-client")
@RequiredArgsConstructor
public class RemiseClientController {


    private final RemiseClientService service;



    @GetMapping("/{clientId}")
    public List<RemiseClientDTO> getByClient(
            @PathVariable Long clientId
    ){
        return service.getByClient(clientId);
    }



    @PostMapping
    public RemiseClientDTO save(
            @RequestBody RemiseClientDTO dto
    ){
        return service.save(dto);
    }



    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ){
        service.delete(id);
    }

}