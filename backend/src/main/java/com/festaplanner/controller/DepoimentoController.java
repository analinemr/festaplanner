package com.festaplanner.controller;

import com.festaplanner.dto.DepoimentoRequest;
import com.festaplanner.dto.DepoimentoResponse;
import com.festaplanner.model.Usuario;
import com.festaplanner.service.DepoimentoService;
import com.festaplanner.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Envio de mensagens/depoimentos pelo cliente na tela "Sua conta" (exige login,
 * cai na regra genérica ".anyRequest().authenticated()") e listagem pública dos
 * aprovados, usada na Home (ver SecurityConfig: GET /api/depoimentos/aprovados
 * é permitAll).
 */
@RestController
@RequestMapping("/api/depoimentos")
@RequiredArgsConstructor
public class DepoimentoController {

    private final DepoimentoService depoimentoService;
    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<DepoimentoResponse> enviar(@Valid @RequestBody DepoimentoRequest request, Authentication auth) {
        Usuario cliente = usuarioService.buscarPorEmail(auth.getName());
        return ResponseEntity.ok(depoimentoService.paraResponse(depoimentoService.enviar(cliente, request)));
    }

    /** Público — usado na Home. Só devolve os aprovados pelo ADM. */
    @GetMapping("/aprovados")
    public ResponseEntity<List<DepoimentoResponse>> listarAprovados() {
        List<DepoimentoResponse> resposta = depoimentoService.listarAprovados().stream()
                .map(depoimentoService::paraResponse)
                .toList();
        return ResponseEntity.ok(resposta);
    }
}