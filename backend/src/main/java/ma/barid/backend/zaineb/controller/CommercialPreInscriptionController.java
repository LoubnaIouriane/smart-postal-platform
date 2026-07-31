package ma.barid.backend.zaineb.controller;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.zaineb.service.CommercialPreInscriptionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commercial/preinscriptions")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CommercialPreInscriptionController {

    private final CommercialPreInscriptionService service;


    // Liste des demandes de pré-inscription
    @GetMapping
    public List<Client> getDemandes() {

        return service.getDemandes();

    }


    // Validation d'une demande
    @PutMapping("/{id}/valider")
    public Client valider(
            @PathVariable Long id
    ) {

        return service.valider(id);

    }


    // Refus d'une demande
    @PutMapping("/{id}/refuser")
    public Client refuser(
            @PathVariable Long id
    ) {

        return service.refuser(id);

    }

}