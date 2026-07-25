package ma.barid.backend.zaineb.controller;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.zaineb.dto.GrilleRemiseDTO;
import ma.barid.backend.zaineb.service.GrilleRemiseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commercial/grilles-remise")
@RequiredArgsConstructor
public class GrilleRemiseController {

    private final GrilleRemiseService grilleRemiseService;

    @GetMapping
    public List getAll() { return grilleRemiseService.getAll(); }

    @GetMapping("/{id}")
    public GrilleRemiseDTO getById(@PathVariable Long id) { return grilleRemiseService.getById(id); }

    @PostMapping
    public GrilleRemiseDTO create(@RequestBody GrilleRemiseDTO dto) { return grilleRemiseService.save(dto); }

    @PutMapping("/{id}")
    public GrilleRemiseDTO update(@PathVariable Long id, @RequestBody GrilleRemiseDTO dto) {
        dto.setIdGrille(id);
        return grilleRemiseService.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { grilleRemiseService.delete(id); }
}