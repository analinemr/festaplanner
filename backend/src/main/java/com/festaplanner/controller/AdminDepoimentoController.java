package com.festaplanner.controller;

import com.festaplanner.dto.DepoimentoResponse;
import com.festaplanner.service.DepoimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Moderação de depoimentos na tela do ADM.
 * Protegido pela regra ".requestMatchers("/api/admin/**").hasAuthority("ADMINISTRADOR")"
 * já existente no SecurityConfig — nenhuma mudança de segurança necessária.
 */
@RestController
@RequestMapping("/api/admin/depoimentos")
@RequiredArgsConstructor
public class AdminDepoimentoController {

    private final DepoimentoService depoimentoService;

    @GetMapping
    public ResponseEntity<List<DepoimentoResponse>> listar() {
        List<DepoimentoResponse> resposta = depoimentoService.listarParaAdmin().stream()
                .map(depoimentoService::paraResponse)
                .toList();
        return ResponseEntity.ok(resposta);
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<DepoimentoResponse> aprovar(@PathVariable Long id) {
        return ResponseEntity.ok(depoimentoService.paraResponse(depoimentoService.aprovar(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        depoimentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}