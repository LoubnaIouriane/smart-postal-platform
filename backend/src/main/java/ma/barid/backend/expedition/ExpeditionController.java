package ma.barid.backend.expedition;

import ma.barid.backend.auth.entity.Ville;
import ma.barid.backend.facteur.Facteur;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expeditions")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpeditionController {

    private final ExpeditionService service;

    public ExpeditionController(ExpeditionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ExpeditionRequest request) {
        try {
            return ResponseEntity.ok(service.creerExpedition(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<Expedition> list() {
        return service.listerExpeditions();
    }

    @GetMapping("/a-collecter")
    public List<Expedition> listACollecter() {
        return service.listerExpeditionsACollecter();
    }

    @GetMapping("/villes")
    public List<Ville> listVilles() {
        return service.listerVilles();
    }

    @GetMapping("/facteurs")
    public List<Facteur> listFacteurs() {
        return service.listerFacteurs();
    }

    @GetMapping("/tracking/{code}")
    public ResponseEntity<?> trackByCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(service.trouverParCode(code));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(@PathVariable Long id, @RequestBody ChangerStatutRequest request) {
        try {
            return ResponseEntity.ok(service.changerStatut(id, request.getStatut()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/annuler")
    public ResponseEntity<?> annuler(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.annulerExpedition(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/facteur")
    public ResponseEntity<?> assignerFacteur(@PathVariable Long id, @RequestBody AssignerFacteurRequest request) {
        try {
            return ResponseEntity.ok(service.assignerFacteur(id, request.getIdFacteur()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/poids-reel")
    public ResponseEntity<?> enregistrerPoidsReel(@PathVariable Long id, @RequestBody PoidsReelRequest request) {
        try {
            return ResponseEntity.ok(service.enregistrerPoidsReel(id, request.getPoidsReel()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}