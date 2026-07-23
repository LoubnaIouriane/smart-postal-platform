// auth/serviceImpl/AdminServiceImpl.java
package ma.barid.backend.auth.serviceImpl;

import ma.barid.backend.auth.dto.*;
import ma.barid.backend.auth.entity.*;
import ma.barid.backend.auth.enums.RoleName;
import ma.barid.backend.auth.repository.*;
import ma.barid.backend.auth.service.AdminService;
import ma.barid.backend.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final AgenceRepository agenceRepository;
    private final VilleRepository villeRepository;
    private final ClientRepository clientRepository;
    private final CommercialRepository commercialRepository;
    private final FacteurRepository facteurRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // =========================================================
    // DASHBOARD
    // =========================================================
    @Override
    public DashboardStatsResponse getDashboardStats() {
        return DashboardStatsResponse.builder()
                .nombreClients(clientRepository.count())
                .nombreCommerciaux(commercialRepository.count())
                .nombreFacteurs(facteurRepository.count())
                .nombreAgences(agenceRepository.count())
                .build();
    }

    // =========================================================
    // VILLES (lecture seule, pour les listes deroulantes)
    // =========================================================
    @Override
    public List<VilleResponse> listVilles() {
        return villeRepository.findAll().stream()
                .map(v -> VilleResponse.builder()
                        .idVille(v.getIdVille())
                        .nomVille(v.getNomVille())
                        .codeVille(v.getCodeVille())
                        .build())
                .toList();
    }

    // =========================================================
    // AGENCES
    // =========================================================
    @Override
    public List<AgenceResponse> listAgences() {
        return agenceRepository.findAll().stream().map(this::toAgenceResponse).toList();
    }

    @Override
    public AgenceResponse createAgence(AgenceRequest request) {
        Ville ville = villeRepository.findById(request.getIdVille())
                .orElseThrow(() -> new RuntimeException("Ville introuvable"));

        if (agenceRepository.findByVille(ville).isPresent()) {
            throw new RuntimeException("Cette ville possede deja une agence");
        }

        String idAgence = genererIdAgence();

        Agence agence = Agence.builder()
                .idAgence(idAgence)
                .nomAgence(request.getNomAgence())
                .adresse(request.getAdresse())
                .codePostal(request.getCodePostal())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .contactCommercial(request.getContactCommercial())
                .ville(ville)
                .build();

        agenceRepository.save(agence);
        return toAgenceResponse(agence);
    }

    @Override
    public AgenceResponse updateAgence(String idAgence, AgenceRequest request) {
        Agence agence = agenceRepository.findById(idAgence)
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));
        Ville ville = villeRepository.findById(request.getIdVille())
                .orElseThrow(() -> new RuntimeException("Ville introuvable"));

        agence.setNomAgence(request.getNomAgence());
        agence.setAdresse(request.getAdresse());
        agence.setCodePostal(request.getCodePostal());
        agence.setTelephone(request.getTelephone());
        agence.setEmail(request.getEmail());
        agence.setContactCommercial(request.getContactCommercial());
        agence.setVille(ville);

        agenceRepository.save(agence);
        return toAgenceResponse(agence);
    }

    @Override
    public void deleteAgence(String idAgence) {
        if (!agenceRepository.existsById(idAgence)) {
            throw new RuntimeException("Agence introuvable");
        }
        agenceRepository.deleteById(idAgence);
    }

    // =========================================================
    // COMMERCIAUX
    // =========================================================
    @Override
    public List<CommercialResponse> listCommerciaux() {
        return commercialRepository.findAll().stream().map(this::toCommercialResponse).toList();
    }

    @Override
    public CommercialResponse createCommercial(CommercialRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est deja utilise");
        }
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));
        Role role = roleRepository.findByNomRole(RoleName.COMMERCIAL.name())
                .orElseThrow(() -> new RuntimeException("Role COMMERCIAL introuvable"));

        String identifiant = genererIdentifiant("com", request.getNom());
        String motDePasseClair = genererMotDePasseAleatoire();

        Commercial commercial = Commercial.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .identifiant(identifiant)
                .motDePasse(passwordEncoder.encode(motDePasseClair))
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .role(role)
                .agence(agence)
                .build();

        commercialRepository.save(commercial);

        // Envoi des identifiants generes par email
        emailService.envoyerIdentifiants(commercial.getEmail(), identifiant, motDePasseClair);

        return toCommercialResponse(commercial);
    }

    @Override
    public CommercialResponse updateCommercial(Long id, CommercialRequest request) {
        Commercial commercial = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        commercial.setNom(request.getNom());
        commercial.setPrenom(request.getPrenom());
        commercial.setTelephone(request.getTelephone());
        commercial.setAgence(agence);

        if (!commercial.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est deja utilise");
            }
            commercial.setEmail(request.getEmail());
        }

        commercialRepository.save(commercial);
        return toCommercialResponse(commercial);
    }

    @Override
    public void deleteCommercial(Long id) {
        if (!commercialRepository.existsById(id)) {
            throw new RuntimeException("Commercial introuvable");
        }
        commercialRepository.deleteById(id);
    }

    // =========================================================
    // FACTEURS
    // =========================================================
    @Override
    public List<FacteurResponse> listFacteurs() {
        return facteurRepository.findAll().stream().map(this::toFacteurResponse).toList();
    }

    @Override
    public FacteurResponse createFacteur(FacteurRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est deja utilise");
        }
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));
        Role role = roleRepository.findByNomRole(RoleName.FACTEUR.name())
                .orElseThrow(() -> new RuntimeException("Role FACTEUR introuvable"));

        String identifiant = genererIdentifiant("fac", request.getNom());
        String motDePasseClair = genererMotDePasseAleatoire();

        Facteur facteur = Facteur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .identifiant(identifiant)
                .motDePasse(passwordEncoder.encode(motDePasseClair))
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .role(role)
                .agence(agence)
                .build();

        facteurRepository.save(facteur);

        emailService.envoyerIdentifiants(facteur.getEmail(), identifiant, motDePasseClair);

        return toFacteurResponse(facteur);
    }

    @Override
    public FacteurResponse updateFacteur(Long id, FacteurRequest request) {
        Facteur facteur = facteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facteur introuvable"));
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        facteur.setNom(request.getNom());
        facteur.setPrenom(request.getPrenom());
        facteur.setTelephone(request.getTelephone());
        facteur.setAgence(agence);

        if (!facteur.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est deja utilise");
            }
            facteur.setEmail(request.getEmail());
        }

        facteurRepository.save(facteur);
        return toFacteurResponse(facteur);
    }

    @Override
    public void deleteFacteur(Long id) {
        if (!facteurRepository.existsById(id)) {
            throw new RuntimeException("Facteur introuvable");
        }
        facteurRepository.deleteById(id);
    }

    // =========================================================
    // HELPERS PRIVES
    // =========================================================
    private String genererIdAgence() {
        long count = agenceRepository.count() + 1;
        String idAgence = String.format("AG%03d", count);
        while (agenceRepository.existsById(idAgence)) {
            count++;
            idAgence = String.format("AG%03d", count);
        }
        return idAgence;
    }

    /** Genere un identifiant unique du type "com" + nom + suffixe numerique. */
    private String genererIdentifiant(String prefixe, String nom) {
        String base = (prefixe + nom).toLowerCase().replaceAll("[^a-z0-9]", "");
        if (base.length() > 8) base = base.substring(0, 8);

        String identifiant;
        int suffixe = 1;
        do {
            identifiant = base + suffixe;
            suffixe++;
        } while (utilisateurRepository.existsByIdentifiant(identifiant));

        return identifiant;
    }

    /** Genere un mot de passe temporaire aleatoire de 10 caracteres. */
    private String genererMotDePasseAleatoire() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private AgenceResponse toAgenceResponse(Agence a) {
        return AgenceResponse.builder()
                .idAgence(a.getIdAgence())
                .nomAgence(a.getNomAgence())
                .adresse(a.getAdresse())
                .codePostal(a.getCodePostal())
                .telephone(a.getTelephone())
                .email(a.getEmail())
                .contactCommercial(a.getContactCommercial())
                .idVille(a.getVille().getIdVille())
                .nomVille(a.getVille().getNomVille())
                .build();
    }

    private CommercialResponse toCommercialResponse(Commercial c) {
        return CommercialResponse.builder()
                .idUtilisateur(c.getIdUtilisateur())
                .nom(c.getNom())
                .prenom(c.getPrenom())
                .identifiant(c.getIdentifiant())
                .email(c.getEmail())
                .telephone(c.getTelephone())
                .idAgence(c.getAgence().getIdAgence())
                .nomAgence(c.getAgence().getNomAgence())
                .actif(c.getActif())
                .build();
    }

    private FacteurResponse toFacteurResponse(Facteur f) {
        return FacteurResponse.builder()
                .idUtilisateur(f.getIdUtilisateur())
                .nom(f.getNom())
                .prenom(f.getPrenom())
                .identifiant(f.getIdentifiant())
                .email(f.getEmail())
                .telephone(f.getTelephone())
                .idAgence(f.getAgence().getIdAgence())
                .nomAgence(f.getAgence().getNomAgence())
                .actif(f.getActif())
                .build();
    }
}
