// auth/controller/AdminController.java
package ma.barid.backend.auth.controller;

import ma.barid.backend.auth.dto.*;
import ma.barid.backend.auth.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> stats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/villes")
    public ResponseEntity<List<VilleResponse>> listVilles() {
        return ResponseEntity.ok(adminService.listVilles());
    }

    // ---- Agences ----
    @GetMapping("/agences")
    public ResponseEntity<List<AgenceResponse>> listAgences() {
        return ResponseEntity.ok(adminService.listAgences());
    }

    @PostMapping("/agences")
    public ResponseEntity<AgenceResponse> createAgence(@Valid @RequestBody AgenceRequest request) {
        return ResponseEntity.ok(adminService.createAgence(request));
    }

    @PutMapping("/agences/{idAgence}")
    public ResponseEntity<AgenceResponse> updateAgence(@PathVariable Long idAgence,
                                                       @Valid @RequestBody AgenceRequest request) {
        return ResponseEntity.ok(adminService.updateAgence(idAgence, request));
    }

    @DeleteMapping("/agences/{idAgence}")
    public ResponseEntity<String> deleteAgence(@PathVariable Long idAgence) {
        adminService.deleteAgence(idAgence);
        return ResponseEntity.ok("Agence supprimee avec succes");
    }

    // ---- Commerciaux ----
    @GetMapping("/commerciaux")
    public ResponseEntity<List<CommercialResponse>> listCommerciaux() {
        return ResponseEntity.ok(adminService.listCommerciaux());
    }

    @PostMapping("/commerciaux")
    public ResponseEntity<CommercialResponse> createCommercial(@Valid @RequestBody CommercialRequest request) {
        return ResponseEntity.ok(adminService.createCommercial(request));
    }

    @PutMapping("/commerciaux/{id}")
    public ResponseEntity<CommercialResponse> updateCommercial(@PathVariable Long id,
                                                               @Valid @RequestBody CommercialRequest request) {
        return ResponseEntity.ok(adminService.updateCommercial(id, request));
    }

    @DeleteMapping("/commerciaux/{id}")
    public ResponseEntity<String> deleteCommercial(@PathVariable Long id) {
        adminService.deleteCommercial(id);
        return ResponseEntity.ok("Commercial supprime avec succes");
    }

    // ---- Facteurs ----
    @GetMapping("/facteurs")
    public ResponseEntity<List<FacteurResponse>> listFacteurs() {
        return ResponseEntity.ok(adminService.listFacteurs());
    }

    @PostMapping("/facteurs")
    public ResponseEntity<FacteurResponse> createFacteur(@Valid @RequestBody FacteurRequest request) {
        return ResponseEntity.ok(adminService.createFacteur(request));
    }

    @PutMapping("/facteurs/{id}")
    public ResponseEntity<FacteurResponse> updateFacteur(@PathVariable Long id,
                                                         @Valid @RequestBody FacteurRequest request) {
        return ResponseEntity.ok(adminService.updateFacteur(id, request));
    }

    @DeleteMapping("/facteurs/{id}")
    public ResponseEntity<String> deleteFacteur(@PathVariable Long id) {
        adminService.deleteFacteur(id);
        return ResponseEntity.ok("Facteur supprime avec succes");
    }
}
