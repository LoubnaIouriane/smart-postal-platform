package ma.barid.backend.expedition;

import ma.barid.backend.auth.entity.Ville;
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
            Expedition created = service.creerExpedition(request);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<Expedition> list() {
        return service.listerExpeditions();
    }

    @GetMapping("/villes")
    public List<Ville> listVilles() {
        return service.listerVilles();
    }
}