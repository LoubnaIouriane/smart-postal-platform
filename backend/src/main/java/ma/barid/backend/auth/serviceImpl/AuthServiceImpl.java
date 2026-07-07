// auth/serviceImpl/AuthServiceImpl.java
package ma.barid.backend.auth.serviceImpl;

import ma.barid.backend.auth.dto.*;
import ma.barid.backend.auth.entity.Role;
import ma.barid.backend.auth.entity.Utilisateur;
import ma.barid.backend.auth.repository.RoleRepository;
import ma.barid.backend.auth.repository.UtilisateurRepository;
import ma.barid.backend.auth.security.JwtService;
import ma.barid.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByIdentifiant(request.getIdentifiant())
                .orElseThrow(() -> new RuntimeException("Identifiant ou mot de passe incorrect"));

        if (!Boolean.TRUE.equals(utilisateur.getActif())) {
            throw new RuntimeException("Compte non actif (pre-inscription non validee)");
        }
        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Identifiant ou mot de passe incorrect");
        }

        utilisateur.setDerniereConnexion(LocalDateTime.now());
        utilisateurRepository.save(utilisateur);

        String role = utilisateur.getRole().getNomRole();
        String token = jwtService.generateToken(utilisateur.getIdentifiant(), role);

        return LoginResponse.builder()
                .token(token).role(role).userId(utilisateur.getIdUtilisateur()).build();
    }

    @Override
    public void register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email deja utilise");
        }
        Role role = roleRepository.findByNomRole(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role invalide"));

        Utilisateur utilisateur = Utilisateur.builder()
                .identifiant(request.getIdentifiant())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .actif(true) // compte cree directement actif (test / commercial / facteur)
                .dateCreation(LocalDateTime.now())
                .role(role)
                .build();

        utilisateurRepository.save(utilisateur);
    }
    @Override
    public String genererIdentifiantEtMotDePasse(Utilisateur utilisateur, String raisonSociale) {
        String base = raisonSociale.toLowerCase().replaceAll("[^a-z0-9]", "");
        String identifiant = base.substring(0, Math.min(8, base.length())) + utilisateur.getIdUtilisateur();

        String motDePasseClair = java.util.UUID.randomUUID().toString().substring(0, 8);

        utilisateur.setIdentifiant(identifiant);
        utilisateur.setMotDePasse(passwordEncoder.encode(motDePasseClair));
        utilisateur.setActif(true);
        utilisateurRepository.save(utilisateur);

        return motDePasseClair;
    }
}