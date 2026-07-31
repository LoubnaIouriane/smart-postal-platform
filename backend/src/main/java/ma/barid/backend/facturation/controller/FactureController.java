package ma.barid.backend.facturation.controller;

import jakarta.validation.Valid;
import ma.barid.backend.facturation.dto.FactureCreateRequest;
import ma.barid.backend.facturation.dto.FactureDTO;
import ma.barid.backend.facturation.service.FactureGenerationService;
import ma.barid.backend.facturation.service.FacturePdfService;
import ma.barid.backend.facturation.service.FactureService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping({"/api/factures", "/facturation/factures"})
public class FactureController {

    private final FactureService factureService;
    private final FacturePdfService facturePdfService;
    private final FactureGenerationService factureGenerationService;

    public FactureController(
            FactureService factureService,
            FacturePdfService facturePdfService,
            FactureGenerationService factureGenerationService
    ) {
        this.factureService = factureService;
        this.facturePdfService = facturePdfService;
        this.factureGenerationService = factureGenerationService;
    }

    @GetMapping
    public List<FactureDTO> getAll() {
        return factureService.getAll();
    }

    @GetMapping("/{id}")
    public FactureDTO getById(@PathVariable Long id) {
        return factureService.getById(id);
    }

    @GetMapping("/client/{clientId}")
    public List<FactureDTO> getByClient(@PathVariable Long clientId) {
        return factureService.getByClient(clientId);
    }

    @GetMapping("/recherche")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public List<FactureDTO> rechercher(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        return factureService.rechercher(statut, debut, fin);
    }

    @PostMapping
    public ResponseEntity<FactureDTO> create(@Valid @RequestBody FactureCreateRequest request) {
        return ResponseEntity.status(201).body(factureService.create(request));
    }

    @PutMapping({"/{id}/paiement", "/{id}/marquer-payee"})
    public FactureDTO marquerPayee(@PathVariable Long id) {
        return factureService.marquerPayee(id);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> telechargerPdf(@PathVariable Long id, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            boolean estCommercial = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_COMMERCIAL"));
            if (!estCommercial && !factureService.appartientA(id, authentication.getName())) {
                return ResponseEntity.status(403).build();
            }
        }

        byte[] pdf = facturePdfService.genererPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/generer-mensuelles")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<String> declencherGenerationManuelle() {
        factureGenerationService.genererFacturesMensuelles();
        return ResponseEntity.ok("Generation mensuelle declenchee manuellement");
    }
}
