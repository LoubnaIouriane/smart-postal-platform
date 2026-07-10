package ma.barid.backend.auth;

import ma.barid.backend.auth.dto.LoginRequest;
import ma.barid.backend.auth.dto.LoginResponse;
import ma.barid.backend.auth.entity.Role;
import ma.barid.backend.auth.entity.Utilisateur;
import ma.barid.backend.auth.repository.RoleRepository;
import ma.barid.backend.auth.repository.UtilisateurRepository;
import ma.barid.backend.auth.security.JwtService;
import ma.barid.backend.auth.serviceImpl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UtilisateurRepository utilisateurRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    private Utilisateur utilisateur;

    @BeforeEach
    void setUp() {
        Role role = Role.builder().idRole(1L).nomRole("CLIENT").build();
        utilisateur = Utilisateur.builder()
                .idUtilisateur(1L)
                .identifiant("test01")
                .motDePasse("hash_du_mdp")
                .email("test@mail.com")
                .actif(true)
                .role(role)
                .build();
    }

    @Test
    void login_avecIdentifiantsValides_retourneUnToken() {
        LoginRequest request = new LoginRequest("test01", "1234");

        when(utilisateurRepository.findByIdentifiant("test01")).thenReturn(Optional.of(utilisateur));
        when(passwordEncoder.matches("1234", "hash_du_mdp")).thenReturn(true);
        when(jwtService.generateToken("test01", "CLIENT")).thenReturn("fake-jwt-token");

        LoginResponse response = authService.login(request);

        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("CLIENT", response.getRole());
        verify(utilisateurRepository).save(utilisateur);
    }

    @Test
    void login_avecMauvaisMotDePasse_lanceUneException() {
        LoginRequest request = new LoginRequest("test01", "mauvais");

        when(utilisateurRepository.findByIdentifiant("test01")).thenReturn(Optional.of(utilisateur));
        when(passwordEncoder.matches("mauvais", "hash_du_mdp")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void login_avecCompteInactif_lanceUneException() {
        utilisateur.setActif(false);
        LoginRequest request = new LoginRequest("test01", "1234");

        when(utilisateurRepository.findByIdentifiant("test01")).thenReturn(Optional.of(utilisateur));

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
}