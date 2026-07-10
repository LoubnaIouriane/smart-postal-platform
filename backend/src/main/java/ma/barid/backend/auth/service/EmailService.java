// auth/service/EmailService.java
package ma.barid.backend.auth.service;

public interface EmailService {
    void envoyerIdentifiants(String email, String identifiant, String motDePasse);
    void envoyerLienReinitialisation(String email, String token);
}