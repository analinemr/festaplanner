package com.festaplanner.controller;

import com.festaplanner.dto.AuthResponse;
import com.festaplanner.dto.LoginRequest;
import com.festaplanner.dto.RegistroRequest;
import com.festaplanner.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    /**
     * E-mail/senha errados ou usuário inexistente lançam AuthenticationException
     * (ou UsernameNotFoundException) dentro de authenticationManager.authenticate().
     * Sem esse handler, isso "estourava" como 500 genérico em vez de um 401 limpo
     * que o frontend já sabe tratar (ver login-component.ts).
     */
    @ExceptionHandler({AuthenticationException.class, UsernameNotFoundException.class})
    public ResponseEntity<Map<String, String>> tratarErroAutenticacao() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "E-mail ou senha incorretos."));
    }

    // TODO: /api/auth/login/google, /login/microsoft, /login/apple
    // Recomendação: validar o id_token do provedor (ex.: com a lib google-api-client),
    // e então localizar/criar o Usuario com provedorLogin correspondente antes de gerar o JWT.
}