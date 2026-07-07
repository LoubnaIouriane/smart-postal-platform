package ma.barid.backend.zaineb.controller;

import ma.barid.backend.zaineb.entity.ContratClient;
import ma.barid.backend.zaineb.repository.ContratClientRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@CrossOrigin("*")
public class ContratClientController {


    private final ContratClientRepository contratRepository;


    public ContratClientController(ContratClientRepository contratRepository) {
        this.contratRepository = contratRepository;
    }


    @GetMapping
    public List<ContratClient> getAllContrats() {
        return contratRepository.findAll();
    }


    @GetMapping("/{id}")
    public ContratClient getContratById(@PathVariable Long id) {
        return contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));
    }


    @PostMapping
    public ContratClient createContrat(
            @RequestBody ContratClient contrat) {

        return contratRepository.save(contrat);
    }


    @PutMapping("/{id}")
    public ContratClient updateContrat(
            @PathVariable Long id,
            @RequestBody ContratClient contrat) {

        ContratClient existing = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));

        existing.setNumeroContrat(contrat.getNumeroContrat());
        existing.setDateDebut(contrat.getDateDebut());
        existing.setDateFin(contrat.getDateFin());
        existing.setStatut(contrat.getStatut());
        existing.setClient(contrat.getClient());
        existing.setGrilleRemise(contrat.getGrilleRemise());

        return contratRepository.save(existing);
    }


    @DeleteMapping("/{id}")
    public void deleteContrat(@PathVariable Long id) {
        contratRepository.deleteById(id);
    }
}