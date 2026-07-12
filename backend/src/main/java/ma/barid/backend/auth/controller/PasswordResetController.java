package ma.barid.backend.auth.controller;

import ma.barid.backend.auth.entity.PasswordResetToken;
import ma.barid.backend.auth.entity.Utilisateur;
import ma.barid.backend.auth.repository.PasswordResetTokenRepository;
import ma.barid.backend.auth.repository.UtilisateurRepository;
import ma.barid.backend.auth.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import ma.barid.backend.auth.dto.ResetPasswordRequest;
import ma.barid.backend.auth.dto.ForgotPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Aucun compte associe a cet email"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .utilisateur(utilisateur)
                .dateExpiration(LocalDateTime.now().plusHours(1))
                .build();
        tokenRepository.save(resetToken);

        emailService.envoyerLienReinitialisation(utilisateur.getEmail(), token);

        return ResponseEntity.ok("Un lien de reinitialisation a ete envoye par email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (resetToken.getDateExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Ce lien a expire, refaites une demande");
        }

        Utilisateur utilisateur = resetToken.getUtilisateur();
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getNouveauMotDePasse()));
        utilisateurRepository.save(utilisateur);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Mot de passe reinitialise avec succes");
    }
}