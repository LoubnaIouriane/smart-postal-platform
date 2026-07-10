package ma.barid.backend.auth.service;
// auth/service/AuthService.java

import ma.barid.backend.auth.dto.LoginRequest;
import ma.barid.backend.auth.dto.LoginResponse;
import ma.barid.backend.auth.dto.RegisterRequest;
import ma.barid.backend.auth.entity.Utilisateur;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void register(RegisterRequest request);
    String genererIdentifiantEtMotDePasse(Utilisateur utilisateur, String raisonSociale);
}