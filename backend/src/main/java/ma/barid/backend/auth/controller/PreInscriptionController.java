// auth/controller/PreInscriptionController.java
package ma.barid.backend.auth.controller;

import ma.barid.backend.auth.dto.PreInscriptionRequest;
import ma.barid.backend.auth.service.PreInscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PreInscriptionController {

    private final PreInscriptionService preInscriptionService;

    @PostMapping("/pre-inscription")
    public ResponseEntity<String> preInscription(@Valid @RequestBody PreInscriptionRequest request) {

        System.out.println("===> PRE INSCRIPTION");

        preInscriptionService.creerDemande(request);

        return ResponseEntity.ok(
                "Demande de pre-inscription enregistree, en attente de validation");
    }

}
