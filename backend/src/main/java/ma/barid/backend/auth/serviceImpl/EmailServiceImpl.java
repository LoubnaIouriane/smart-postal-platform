package ma.barid.backend.auth.serviceImpl;

import ma.barid.backend.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = Logger.getLogger(EmailServiceImpl.class.getName());

    @Override
    public void envoyerIdentifiants(String email, String identifiant, String motDePasse) {
        log.info("=== EMAIL (simule, SMTP desactive pour les tests) ===");
        log.info("A            : " + email);
        log.info("Sujet        : Vos identifiants - Smart Postal Platform");
        log.info("Identifiant  : " + identifiant);
        log.info("Mot de passe : " + motDePasse);
    }

    @Override
    public void envoyerLienReinitialisation(String email, String token) {
        log.info("=== EMAIL (simule, SMTP desactive pour les tests) ===");
        log.info("A            : " + email);
        log.info("Lien         : http://localhost:5173/reset-password?token=" + token);
    }
}