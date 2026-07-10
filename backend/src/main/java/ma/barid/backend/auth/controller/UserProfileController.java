package ma.barid.backend.auth.controller;

import ma.barid.backend.auth.dto.ChangePasswordRequest;
import ma.barid.backend.auth.dto.UserProfileResponse;
import ma.barid.backend.auth.entity.Utilisateur;
import ma.barid.backend.auth.repository.UtilisateurRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
        // "authentication.getName()" = l'identifiant, injecte par le JwtFilter (Semaine 1)
        Utilisateur u = utilisateurRepository.findByIdentifiant(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        UserProfileResponse response = UserProfileResponse.builder()
                .userId(u.getIdUtilisateur())
                .identifiant(u.getIdentifiant())
                .email(u.getEmail())
                .role(u.getRole().getNomRole())
                .actif(u.getActif())
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                                 Authentication authentication) {
        Utilisateur u = utilisateurRepository.findByIdentifiant(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getAncienMotDePasse(), u.getMotDePasse())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        u.setMotDePasse(passwordEncoder.encode(request.getNouveauMotDePasse()));
        utilisateurRepository.save(u);

        return ResponseEntity.ok("Mot de passe modifie avec succes");
    }
}