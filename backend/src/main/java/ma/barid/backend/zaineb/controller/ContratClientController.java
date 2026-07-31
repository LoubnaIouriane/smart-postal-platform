package ma.barid.backend.zaineb.controller;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.service.ContratClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commercial/contrats")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ContratClientController {

    private final ContratClientService contratClientService;


    // Liste des contrats
    @GetMapping
    public List<ContratClientDTO> getAll() {

        return contratClientService.getAll();

    }


    // Détails d'un contrat
    @GetMapping("/{id}")
    public ContratClientDTO getById(
            @PathVariable Long id
    ) {

        return contratClientService.getById(id);

    }


    // Ajouter un contrat
    @PostMapping
    public ContratClientDTO create(
            @RequestBody ContratClientDTO dto
    ) {

        return contratClientService.save(dto);

    }


    // Modifier un contrat
    @PutMapping("/{id}")
    public ContratClientDTO update(
            @PathVariable Long id,
            @RequestBody ContratClientDTO dto
    ) {

        dto.setIdContrat(id);

        return contratClientService.save(dto);

    }


    // Supprimer un contrat
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        contratClientService.delete(id);

    }

}