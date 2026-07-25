package ma.barid.backend.auth.controller;

import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.enums.StatutClient;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.auth.service.AuthService;
import ma.barid.backend.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.dto.ClientListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commercial/pre-inscriptions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMMERCIAL')")
public class ValidationCommercialController {

    private final ClientRepository clientRepository;
    private final AuthService authService;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<List<ClientListResponse>> listerEnAttente() {
        List<ClientListResponse> result = clientRepository.findAll().stream()
                .filter(c -> c.getStatut() == StatutClient.PRE_INSCRIPTION)
                .map(c -> ClientListResponse.builder()
                        .idUtilisateur(c.getIdUtilisateur())
                        .raisonSociale(c.getRaisonSociale())
                        .email(c.getEmail())
                        .telephone(c.getTelephone())
                        .ville(c.getVille().getNomVille())
                        .statut(c.getStatut().name())
                        .build())
                .toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/valider")
    public ResponseEntity<String> valider(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        String motDePasseClair = authService.genererIdentifiantEtMotDePasse(client, client.getRaisonSociale());
        client.setStatut(StatutClient.VALIDE);
        clientRepository.save(client);

        emailService.envoyerIdentifiants(client.getEmail(), client.getIdentifiant(), motDePasseClair);

        return ResponseEntity.ok("Client valide, identifiants envoyes par email");
    }

    @PostMapping("/{id}/refuser")
    public ResponseEntity<String> refuser(@PathVariable Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        client.setStatut(StatutClient.REFUSE);
        clientRepository.save(client);

        return ResponseEntity.ok("Demande refusee");
    }
}