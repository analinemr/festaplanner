package com.festaplanner.controller;

import com.festaplanner.dto.AuthResponse;
import com.festaplanner.dto.LoginRequest;
import com.festaplanner.dto.RegistroRequest;
import com.festaplanner.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // TODO: /api/auth/login/google, /login/microsoft, /login/apple
    // Recomendação: validar o id_token do provedor (ex.: com a lib google-api-client),
    // e então localizar/criar o Usuario com provedorLogin correspondente antes de gerar o JWT.
}
