package ma.barid.backend.zaineb.controller;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client; // import en lecture seule, aucune modification
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.zaineb.dto.ClientSummaryDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commercial/clients")
@RequiredArgsConstructor
public class ClientReadController {

    private final ClientRepository clientRepository; // repository d'Etudiant 1, reutilise tel quel

    @GetMapping
    public List<ClientSummaryDTO> getAll() {
        return clientRepository.findAll().stream()
                .map(this::toSummary)
                .toList();
    }

    private ClientSummaryDTO toSummary(Client c) {
        return ClientSummaryDTO.builder()
                .idClient(c.getIdUtilisateur())
                .raisonSociale(c.getRaisonSociale())
                .email(c.getEmail())
                .telephone(c.getTelephone())
                .ville(c.getVille() != null ? c.getVille().getNomVille() : null)
                .agence(c.getAgence() != null ? c.getAgence().getNomAgence() : null)
                .statut(c.getStatut().name())
                .dateInscription(c.getDateCreation()) // AJOUTE : champ herite de Utilisateur
                .build();
    }
}