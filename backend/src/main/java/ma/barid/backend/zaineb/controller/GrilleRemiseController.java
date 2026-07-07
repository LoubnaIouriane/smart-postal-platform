package ma.barid.backend.zaineb.controller;

import ma.barid.backend.zaineb.entity.GrilleRemise;
import ma.barid.backend.zaineb.repository.GrilleRemiseRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grilles-remise")
@CrossOrigin("*")
public class GrilleRemiseController {


    private final GrilleRemiseRepository grilleRepository;


    public GrilleRemiseController(GrilleRemiseRepository grilleRepository) {
        this.grilleRepository = grilleRepository;
    }


    @GetMapping
    public List<GrilleRemise> getAllGrilles() {
        return grilleRepository.findAll();
    }


    @GetMapping("/{id}")
    public GrilleRemise getGrilleById(@PathVariable Long id) {
        return grilleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grille remise introuvable"));
    }


    @PostMapping
    public GrilleRemise createGrille(
            @RequestBody GrilleRemise grille) {

        return grilleRepository.save(grille);
    }


    @PutMapping("/{id}")
    public GrilleRemise updateGrille(
            @PathVariable Long id,
            @RequestBody GrilleRemise grille) {

        GrilleRemise existing = grilleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grille remise introuvable"));

        existing.setNom(grille.getNom());
        existing.setTauxRemise(grille.getTauxRemise());

        return grilleRepository.save(existing);
    }


    @DeleteMapping("/{id}")
    public void deleteGrille(@PathVariable Long id) {
        grilleRepository.deleteById(id);
    }
}