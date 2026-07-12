package ma.barid.backend.zaineb.serviceImpl;

import lombok.RequiredArgsConstructor;
import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Role;
import ma.barid.backend.auth.repository.AgenceRepository;
import ma.barid.backend.auth.repository.RoleRepository;
import ma.barid.backend.zaineb.dto.CommercialCreateRequest;
import ma.barid.backend.zaineb.dto.CommercialDTO;
import ma.barid.backend.zaineb.entity.Commercial;
import ma.barid.backend.zaineb.mapper.CommercialMapper;
import ma.barid.backend.zaineb.repository.CommercialRepository;
import ma.barid.backend.zaineb.service.CommercialService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommercialServiceImpl implements CommercialService {

    private final CommercialRepository commercialRepository;
    private final CommercialMapper mapper;

    // Beans IMPORTES depuis le module auth (jamais modifies, juste reutilises)
    private final RoleRepository roleRepository;
    private final AgenceRepository agenceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List getAll() {
        return commercialRepository.findAll().stream().map(mapper::toDTO).toList();
    }

    @Override
    public CommercialDTO getById(Long id) {
        Commercial commercial = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));
        return mapper.toDTO(commercial);
    }

    @Override
    public CommercialDTO create(CommercialCreateRequest request) {
        if (commercialRepository.existsByIdentifiant(request.getIdentifiant())) {
            throw new RuntimeException("Cet identifiant est deja utilise");
        }

        Role roleCommercial = roleRepository.findByNomRole("COMMERCIAL")
                .orElseThrow(() -> new RuntimeException("Role COMMERCIAL introuvable"));

        Agence agence = agenceRepository.findById(request.getAgenceId())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        Commercial commercial = Commercial.builder()
                .identifiant(request.getIdentifiant())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .role(roleCommercial)
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .agence(agence)
                .build();

        return mapper.toDTO(commercialRepository.save(commercial));
    }

    @Override
    public CommercialDTO update(Long id, CommercialCreateRequest request) {
        Commercial commercial = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));

        Agence agence = agenceRepository.findById(request.getAgenceId())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        commercial.setNom(request.getNom());
        commercial.setPrenom(request.getPrenom());
        commercial.setEmail(request.getEmail());
        commercial.setTelephone(request.getTelephone());
        commercial.setAgence(agence);

        return mapper.toDTO(commercialRepository.save(commercial));
    }

    @Override
    public void delete(Long id) {
        commercialRepository.deleteById(id);
    }
}