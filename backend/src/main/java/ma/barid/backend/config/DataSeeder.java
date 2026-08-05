package ma.barid.backend.config;

import ma.barid.backend.auth.entity.Role;
import ma.barid.backend.auth.entity.Utilisateur;
import ma.barid.backend.auth.enums.RoleName;
import ma.barid.backend.auth.repository.RoleRepository;
import ma.barid.backend.auth.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.identifiant}")
    private String adminIdentifiant;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {

        // 1. Creer tous les roles manquants (ADMIN, CLIENT, COMMERCIAL, FACTEUR)
        for (RoleName nom : RoleName.values()) {
            if (roleRepository.findByNomRole(nom.name()).isEmpty()) {
                roleRepository.save(Role.builder().nomRole(nom.name()).build());
                System.out.println("✅ Role cree : " + nom.name());
            }
        }

        Role adminRole = roleRepository.findByNomRole(RoleName.ADMIN.name())
                .orElseThrow(() -> new RuntimeException("Role ADMIN introuvable apres seed"));

        // 2. Creer le compte admin fixe s'il n'existe pas deja
        if (utilisateurRepository.findByIdentifiant(adminIdentifiant).isEmpty()) {
            Utilisateur admin = Utilisateur.builder()
                    .identifiant(adminIdentifiant)
                    .motDePasse(passwordEncoder.encode(adminPassword))
                    .email("admin@baridalmaghrib.ma")
                    .actif(true)
                    .dateCreation(LocalDateTime.now())
                    .role(adminRole)
                    .build();

            utilisateurRepository.save(admin);
            System.out.println("✅ Compte admin cree -> identifiant : " + adminIdentifiant);
        }
    }
}
