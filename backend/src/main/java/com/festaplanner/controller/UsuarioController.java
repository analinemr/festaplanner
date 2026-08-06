package com.festaplanner.controller;

import com.festaplanner.dto.AtualizarPerfilRequest;
import com.festaplanner.dto.UsuarioResponse;
import com.festaplanner.model.Usuario;
import com.festaplanner.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints do próprio usuário logado — usados pela tela "Sua conta" (cliente)
 * e pela edição de perfil do ADM. Nenhuma regra nova no SecurityConfig é
 * necessária: cai na regra genérica ".anyRequest().authenticated()".
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> meuPerfil(Authentication auth) {
        Usuario usuario = usuarioService.buscarPorEmail(auth.getName());
        return ResponseEntity.ok(paraResponse(usuario));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> atualizarMeuPerfil(@Valid @RequestBody AtualizarPerfilRequest request,
                                                                Authentication auth) {
        Usuario usuario = usuarioService.atualizarPerfil(auth.getName(), request);
        return ResponseEntity.ok(paraResponse(usuario));
    }

    private UsuarioResponse paraResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .telefone(usuario.getTelefone())
                .perfil(usuario.getPerfil().name())
                .build();
    }
}