package ma.barid.backend.auth.service;
// auth/service/AuthService.java

import ma.barid.backend.auth.dto.LoginRequest;
import ma.barid.backend.auth.dto.LoginResponse;
import ma.barid.backend.auth.dto.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void register(RegisterRequest request);
}