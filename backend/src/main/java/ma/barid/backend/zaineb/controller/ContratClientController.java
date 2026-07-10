package ma.barid.backend.zaineb.controller;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.service.ContratClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commercial/contrats")
@RequiredArgsConstructor
public class ContratClientController {

    private final ContratClientService contratClientService;

    @GetMapping
    public List getAll() { return contratClientService.getAll(); }

    @GetMapping("/{id}")
    public ContratClientDTO getById(@PathVariable Long id) { return contratClientService.getById(id); }

    @PostMapping
    public ContratClientDTO create(@RequestBody ContratClientDTO dto) { return contratClientService.save(dto); }

    @PutMapping("/{id}")
    public ContratClientDTO update(@PathVariable Long id, @RequestBody ContratClientDTO dto) {
        dto.setIdContrat(id);
        return contratClientService.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { contratClientService.delete(id); }
}