package ma.barid.backend.zaineb.controller;

import ma.barid.backend.zaineb.entity.Commercial;
import ma.barid.backend.zaineb.repository.CommercialRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commerciaux")
@CrossOrigin("*")
public class CommercialController {


    private final CommercialRepository commercialRepository;


    public CommercialController(CommercialRepository commercialRepository) {
        this.commercialRepository = commercialRepository;
    }


    @GetMapping
    public List<Commercial> getAllCommercials() {

        return commercialRepository.findAll();
    }


    @GetMapping("/{id}")
    public Commercial getCommercialById(
            @PathVariable Long id) {

        return commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));
    }


    @PostMapping
    public Commercial createCommercial(
            @RequestBody Commercial commercial) {

        return commercialRepository.save(commercial);
    }


    @PutMapping("/{id}")
    public Commercial updateCommercial(
            @PathVariable Long id,
            @RequestBody Commercial commercial) {


        Commercial existing = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));


        existing.setNom(commercial.getNom());

        existing.setPrenom(commercial.getPrenom());

        existing.setEmail(commercial.getEmail());

        existing.setTelephone(commercial.getTelephone());

        existing.setAgence(commercial.getAgence());


        return commercialRepository.save(existing);
    }


    @DeleteMapping("/{id}")
    public void deleteCommercial(
            @PathVariable Long id) {

        commercialRepository.deleteById(id);
    }
}