// auth/serviceImpl/EmailServiceImpl.java
package ma.barid.backend.auth.serviceImpl;

import ma.barid.backend.auth.service.EmailService;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = Logger.getLogger(EmailServiceImpl.class.getName());

    @Override
    public void envoyerIdentifiants(String email, String identifiant, String motDePasse) {
        // TODO semaine 3 ou +: brancher JavaMailSender (SMTP reel)
        log.info("=== EMAIL (simule) ===");
        log.info("A: " + email);
        log.info("Sujet: Vos identifiants Barid Al-Maghrib");
        log.info("Identifiant: " + identifiant);
        log.info("Mot de passe temporaire: " + motDePasse);
    }

    @Override
    public void envoyerLienReinitialisation(String email, String token) {
        log.info("=== EMAIL (simule) ===");
        log.info("A: " + email);
        log.info("Lien de reinitialisation: http://localhost:5173/reset-password?token=" + token);
    }
}