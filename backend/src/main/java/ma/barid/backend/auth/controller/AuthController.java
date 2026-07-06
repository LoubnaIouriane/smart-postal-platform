// auth/controller/AuthController.java
package ma.barid.backend.auth.controller;

import ma.barid.backend.auth.dto.LoginRequest;
import ma.barid.backend.auth.dto.LoginResponse;
import ma.barid.backend.auth.dto.RegisterRequest;
import ma.barid.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Utilisateur cree avec succes");
    }
}