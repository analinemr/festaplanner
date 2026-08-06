package com.festaplanner.controller;

import com.festaplanner.dto.AtualizarStatusRequest;
import com.festaplanner.model.Orcamento;
import com.festaplanner.model.StatusOrcamento;
import com.festaplanner.service.OrcamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints da tela "Pedidos" do ADM.
 * Protegidos pela regra ".requestMatchers("/api/admin/**").hasAuthority("ADMINISTRADOR")"
 * já existente no SecurityConfig — nenhuma mudança de segurança necessária.
 */
@RestController
@RequestMapping("/api/admin/orcamentos")
@RequiredArgsConstructor
public class AdminOrcamentoController {

    private final OrcamentoService orcamentoService;

    /**
     * Lista os pedidos para a tela do ADM.
     * Sem filtro: retorna todos exceto rascunhos (orçamentos que o cliente
     * ainda não confirmou/enviou pelo wizard).
     */
    @GetMapping
    public ResponseEntity<List<Orcamento>> listar(@RequestParam(required = false) StatusOrcamento status) {
        return ResponseEntity.ok(orcamentoService.listarParaAdmin(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orcamento> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(orcamentoService.buscarPorId(id));
    }

    /** Ações ✓ / ✕ da tela de Pedidos: aprova, recusa, ou move para outro status. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Orcamento> atualizarStatus(@PathVariable Long id,
                                                       @Valid @RequestBody AtualizarStatusRequest request) {
        return ResponseEntity.ok(orcamentoService.atualizarStatus(id, request.getStatus()));
    }
}