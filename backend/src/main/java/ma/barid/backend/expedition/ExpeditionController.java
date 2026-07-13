package ma.barid.backend.expedition;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expeditions")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpeditionController {

    private final ExpeditionService service;

    public ExpeditionController(ExpeditionService service) {
        this.service = service;
    }

    @PostMapping
    public Expedition create(@RequestBody Expedition expedition) {
        return service.creerExpedition(expedition);
    }

    @GetMapping
    public List<Expedition> list() {
        return service.listerExpeditions();
    }
}