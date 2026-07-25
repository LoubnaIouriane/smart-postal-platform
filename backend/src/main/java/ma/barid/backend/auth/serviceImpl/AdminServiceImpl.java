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
import java.util.Optional;
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
    // VILLES
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

        Agence agence = Agence.builder()
                .nomAgence(request.getNomAgence())
                .adresse(request.getAdresse())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .ville(ville)
                .build();
        agenceRepository.save(agence);

        // Creation optionnelle du commercial en meme temps que l'agence
        if (estRempli(request.getCommercialNom())) {
            if (!estRempli(request.getCommercialEmail())) {
                throw new RuntimeException("L'email du commercial est obligatoire si son nom est renseigne");
            }
            creerCommercialPourAgence(agence, request.getCommercialNom(), request.getCommercialPrenom(),
                    request.getCommercialTelephone(), request.getCommercialEmail());
        }

        // Creation optionnelle du facteur en meme temps que l'agence
        if (estRempli(request.getFacteurNom())) {
            if (!estRempli(request.getFacteurEmail())) {
                throw new RuntimeException("L'email du facteur est obligatoire si son nom est renseigne");
            }
            creerFacteurPourAgence(agence, request.getFacteurNom(), request.getFacteurPrenom(),
                    request.getFacteurTelephone(), request.getFacteurEmail());
        }

        return toAgenceResponse(agence);
    }

    @Override
    public AgenceResponse updateAgence(Long idAgence, AgenceRequest request) {
        Agence agence = agenceRepository.findById(idAgence)
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));
        Ville ville = villeRepository.findById(request.getIdVille())
                .orElseThrow(() -> new RuntimeException("Ville introuvable"));

        agence.setNomAgence(request.getNomAgence());
        agence.setAdresse(request.getAdresse());
        agence.setTelephone(request.getTelephone());
        agence.setEmail(request.getEmail());
        agence.setVille(ville);

        agenceRepository.save(agence);
        return toAgenceResponse(agence);
    }

    @Override
    public void deleteAgence(Long idAgence) {
        Agence agence = agenceRepository.findById(idAgence)
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        if (clientRepository.existsByAgence_IdAgence(idAgence)) {
            throw new RuntimeException(
                    "Impossible de supprimer cette agence : des clients y sont encore rattaches.");
        }
        if (commercialRepository.existsByAgence_IdAgence(idAgence)) {
            throw new RuntimeException(
                    "Impossible de supprimer cette agence : un commercial y est encore affecte. Supprimez-le d'abord.");
        }
        if (facteurRepository.existsByAgence_IdAgence(idAgence)) {
            throw new RuntimeException(
                    "Impossible de supprimer cette agence : un facteur y est encore affecte. Supprimez-le d'abord.");
        }

        agenceRepository.delete(agence);
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
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        Commercial commercial = creerCommercialPourAgence(agence, request.getNom(), request.getPrenom(),
                request.getTelephone(), request.getEmail());

        return toCommercialResponse(commercial);
    }

    @Override
    public CommercialResponse updateCommercial(Long id, CommercialRequest request) {
        Commercial commercial = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));

        Agence nouvelleAgence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        boolean changeAgence = !commercial.getAgence().getIdAgence().equals(nouvelleAgence.getIdAgence());
        if (changeAgence && commercialRepository.existsByAgence_IdAgence(nouvelleAgence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un commercial affecte");
        }

        commercial.setNom(request.getNom());
        commercial.setPrenom(request.getPrenom());
        commercial.setTelephone(request.getTelephone());
        commercial.setAgence(nouvelleAgence);

        Utilisateur utilisateur = commercial.getUtilisateur();
        if (!utilisateur.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est deja utilise");
            }
            utilisateur.setEmail(request.getEmail());
            utilisateurRepository.save(utilisateur);
        }

        commercialRepository.save(commercial);
        return toCommercialResponse(commercial);
    }

    @Override
    public void deleteCommercial(Long id) {
        Commercial commercial = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commercial introuvable"));
        commercialRepository.delete(commercial); // cascade -> supprime aussi le compte de connexion
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
        Agence agence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        Facteur facteur = creerFacteurPourAgence(agence, request.getNom(), request.getPrenom(),
                request.getTelephone(), request.getEmail());

        return toFacteurResponse(facteur);
    }

    @Override
    public FacteurResponse updateFacteur(Long id, FacteurRequest request) {
        Facteur facteur = facteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facteur introuvable"));

        Agence nouvelleAgence = agenceRepository.findById(request.getIdAgence())
                .orElseThrow(() -> new RuntimeException("Agence introuvable"));

        boolean changeAgence = !facteur.getAgence().getIdAgence().equals(nouvelleAgence.getIdAgence());
        if (changeAgence && facteurRepository.existsByAgence_IdAgence(nouvelleAgence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un facteur affecte");
        }

        facteur.setNom(request.getNom());
        facteur.setPrenom(request.getPrenom());
        facteur.setTelephone(request.getTelephone());
        facteur.setAgence(nouvelleAgence);

        Utilisateur utilisateur = facteur.getUtilisateur();
        if (!utilisateur.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est deja utilise");
            }
            utilisateur.setEmail(request.getEmail());
            utilisateurRepository.save(utilisateur);
        }

        facteurRepository.save(facteur);
        return toFacteurResponse(facteur);
    }

    @Override
    public void deleteFacteur(Long id) {
        Facteur facteur = facteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facteur introuvable"));
        facteurRepository.delete(facteur); // cascade -> supprime aussi le compte de connexion
    }

    // =========================================================
    // HELPERS PRIVES REUTILISABLES
    // =========================================================
    private boolean estRempli(String valeur) {
        return valeur != null && !valeur.isBlank();
    }

    private Commercial creerCommercialPourAgence(Agence agence, String nom, String prenom,
                                                 String telephone, String email) {
        if (utilisateurRepository.existsByEmail(email)) {
            throw new RuntimeException("Cet email est deja utilise");
        }
        if (commercialRepository.existsByAgence_IdAgence(agence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un commercial affecte");
        }

        Role role = roleRepository.findByNomRole(RoleName.COMMERCIAL.name())
                .orElseThrow(() -> new RuntimeException("Role COMMERCIAL introuvable"));

        String identifiant = genererIdentifiant("com", nom);
        String motDePasseClair = genererMotDePasseAleatoire();

        Utilisateur utilisateur = Utilisateur.builder()
                .identifiant(identifiant)
                .motDePasse(passwordEncoder.encode(motDePasseClair))
                .email(email)
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .role(role)
                .build();
        utilisateurRepository.save(utilisateur);

        Commercial commercial = Commercial.builder()
                .nom(nom)
                .prenom(prenom)
                .telephone(telephone)
                .utilisateur(utilisateur)
                .agence(agence)
                .build();
        commercialRepository.save(commercial);

        emailService.envoyerIdentifiants(email, identifiant, motDePasseClair);
        return commercial;
    }

    private Facteur creerFacteurPourAgence(Agence agence, String nom, String prenom,
                                           String telephone, String email) {
        if (utilisateurRepository.existsByEmail(email)) {
            throw new RuntimeException("Cet email est deja utilise");
        }
        if (facteurRepository.existsByAgence_IdAgence(agence.getIdAgence())) {
            throw new RuntimeException("Cette agence a deja un facteur affecte");
        }

        Role role = roleRepository.findByNomRole(RoleName.FACTEUR.name())
                .orElseThrow(() -> new RuntimeException("Role FACTEUR introuvable"));

        String identifiant = genererIdentifiant("fac", nom);
        String motDePasseClair = genererMotDePasseAleatoire();

        Utilisateur utilisateur = Utilisateur.builder()
                .identifiant(identifiant)
                .motDePasse(passwordEncoder.encode(motDePasseClair))
                .email(email)
                .actif(true)
                .dateCreation(LocalDateTime.now())
                .role(role)
                .build();
        utilisateurRepository.save(utilisateur);

        Facteur facteur = Facteur.builder()
                .nom(nom)
                .prenom(prenom)
                .telephone(telephone)
                .utilisateur(utilisateur)
                .agence(agence)
                .build();
        facteurRepository.save(facteur);

        emailService.envoyerIdentifiants(email, identifiant, motDePasseClair);
        return facteur;
    }

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

    private String genererMotDePasseAleatoire() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private AgenceResponse toAgenceResponse(Agence a) {
        Optional<Commercial> commercial = commercialRepository.findByAgence_IdAgence(a.getIdAgence());
        Optional<Facteur> facteur = facteurRepository.findByAgence_IdAgence(a.getIdAgence());

        return AgenceResponse.builder()
                .idAgence(a.getIdAgence())
                .nomAgence(a.getNomAgence())
                .adresse(a.getAdresse())
                .telephone(a.getTelephone())
                .email(a.getEmail())
                .idVille(a.getVille().getIdVille())
                .nomVille(a.getVille().getNomVille())
                .hasCommercial(commercial.isPresent())
                .nomCommercial(commercial.map(c -> c.getPrenom() + " " + c.getNom()).orElse(null))
                .telephoneCommercial(commercial.map(Commercial::getTelephone).orElse(null))
                .emailCommercial(commercial.map(c -> c.getUtilisateur().getEmail()).orElse(null))
                .hasFacteur(facteur.isPresent())
                .nomFacteur(facteur.map(f -> f.getPrenom() + " " + f.getNom()).orElse(null))
                .telephoneFacteur(facteur.map(Facteur::getTelephone).orElse(null))
                .emailFacteur(facteur.map(f -> f.getUtilisateur().getEmail()).orElse(null))
                .build();
    }

    private CommercialResponse toCommercialResponse(Commercial c) {
        return CommercialResponse.builder()
                .idCommercial(c.getIdCommercial())
                .nom(c.getNom())
                .prenom(c.getPrenom())
                .identifiant(c.getUtilisateur().getIdentifiant())
                .email(c.getUtilisateur().getEmail())
                .telephone(c.getTelephone())
                .idAgence(c.getAgence().getIdAgence())
                .nomAgence(c.getAgence().getNomAgence())
                .actif(c.getUtilisateur().getActif())
                .build();
    }

    private FacteurResponse toFacteurResponse(Facteur f) {
        return FacteurResponse.builder()
                .idFacteur(f.getIdFacteur())
                .nom(f.getNom())
                .prenom(f.getPrenom())
                .identifiant(f.getUtilisateur().getIdentifiant())
                .email(f.getUtilisateur().getEmail())
                .telephone(f.getTelephone())
                .idAgence(f.getAgence().getIdAgence())
                .nomAgence(f.getAgence().getNomAgence())
                .actif(f.getUtilisateur().getActif())
                .build();
    }
}