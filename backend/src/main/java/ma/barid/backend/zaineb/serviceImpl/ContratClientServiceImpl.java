package ma.barid.backend.zaineb.serviceImpl;
import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.auth.repository.ClientRepository;
import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.entity.ContratClient;
import ma.barid.backend.zaineb.entity.GrilleRemise;
import ma.barid.backend.zaineb.mapper.ContratClientMapper;
import ma.barid.backend.zaineb.repository.ContratClientRepository;
import ma.barid.backend.zaineb.repository.GrilleRemiseRepository;
import ma.barid.backend.zaineb.service.ContratClientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContratClientServiceImpl implements ContratClientService {

    private final ContratClientRepository contratRepository;
    private final ContratClientMapper mapper;

    // AJOUTES : necessaires pour resoudre clientId/grilleRemiseId en vraies entites
    private final ClientRepository clientRepository;
    private final GrilleRemiseRepository grilleRemiseRepository;

    @Override
    public List<ContratClientDTO> getAll() {
        return contratRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ContratClientDTO getById(Long id) {
        ContratClient contrat = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));
        return mapper.toDTO(contrat);
    }

    @Override
    public ContratClientDTO save(ContratClientDTO dto) {

        if (dto.getClientId() == null) {
            throw new RuntimeException("Le client est obligatoire pour creer un contrat");
        }

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        // Regle : un seul contrat actif par client (sauf si on modifie CE contrat)
        boolean clientDejaSousContrat = contratRepository.findAll().stream()
                .anyMatch(c ->
                        c.getClient() != null
                                && c.getClient().getIdUtilisateur().equals(dto.getClientId())
                                && !c.getIdContrat().equals(dto.getIdContrat())
                );
        if (clientDejaSousContrat) {
            throw new RuntimeException("Ce client a deja un contrat");
        }

        GrilleRemise grilleRemise = null;
        if (dto.getGrilleRemiseId() != null) {
            grilleRemise = grilleRemiseRepository.findById(dto.getGrilleRemiseId())
                    .orElseThrow(() -> new RuntimeException("Grille de remise introuvable"));
        }

        ContratClient contrat = mapper.toEntity(dto, client, grilleRemise);
        ContratClient saved = contratRepository.save(contrat);

        return mapper.toDTO(saved);
    }

    @Override
    public void delete(Long id) {
        contratRepository.deleteById(id);
    }
}