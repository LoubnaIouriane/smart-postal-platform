// auth/serviceImpl/EmailServiceImpl.java
package ma.barid.backend.auth.serviceImpl;

import ma.barid.backend.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = Logger.getLogger(EmailServiceImpl.class.getName());

    private final JavaMailSender mailSender;

    @Override
    public void envoyerIdentifiants(String email, String identifiant, String motDePasse) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Vos identifiants - Smart Postal Platform");
            message.setText(
                    "Bonjour,\n\n" +
                            "Un compte vient d'etre cree pour vous sur la plateforme Smart Postal Platform (Barid Al-Maghrib).\n\n" +
                            "Identifiant      : " + identifiant + "\n" +
                            "Mot de passe temporaire : " + motDePasse + "\n\n" +
                            "Merci de vous connecter puis de modifier votre mot de passe depuis votre profil.\n\n" +
                            "Cordialement,\nSmart Postal Platform"
            );
            mailSender.send(message);
            log.info("Email d'identifiants envoye a " + email);
        } catch (Exception e) {
            // On ne bloque jamais la creation du compte si l'email echoue (SMTP mal configure, etc.)
            log.warning("Echec de l'envoi de l'email a " + email + " : " + e.getMessage());
        }
    }

    @Override
    public void envoyerLienReinitialisation(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Reinitialisation de mot de passe - Smart Postal Platform");
            message.setText(
                    "Bonjour,\n\nCliquez sur le lien ci-dessous pour reinitialiser votre mot de passe :\n" +
                            "http://localhost:5173/reset-password?token=" + token +
                            "\n\nSi vous n'etes pas a l'origine de cette demande, ignorez cet email."
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.warning("Echec de l'envoi de l'email a " + email + " : " + e.getMessage());
        }
    }
}
