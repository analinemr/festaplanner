package com.festaplanner.controller;

import com.festaplanner.model.Agenda;
import com.festaplanner.model.Orcamento;
import com.festaplanner.model.StatusOrcamento;
import com.festaplanner.service.AgendaService;
import com.festaplanner.service.OrcamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Endpoints restritos a ADMINISTRADOR (ver SecurityConfig: /api/admin/** exige
 * authority ADMINISTRADOR). Cobre as telas: Painel e Agenda do ADM.
 *
 * A parte de "Pedidos" (listar/atualizar status) foi movida para
 * AdminOrcamentoController (/api/admin/orcamentos) para evitar dois endpoints
 * fazendo a mesma coisa de jeitos diferentes — é esse que o frontend usa hoje.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrcamentoService orcamentoService;
    private final AgendaService agendaService;

    // ---- Tela "Agenda" ----
    @GetMapping("/agenda")
    public ResponseEntity<List<Agenda>> listarAgendaDoMes(@RequestParam int ano, @RequestParam int mes) {
        return ResponseEntity.ok(agendaService.listarPorMes(ano, mes));
    }

    @PostMapping("/agenda/bloquear")
    public ResponseEntity<Agenda> bloquearData(@RequestParam LocalDate data,
                                                @RequestParam(required = false) String observacao) {
        return ResponseEntity.ok(agendaService.bloquearData(data, observacao));
    }

    @PostMapping("/agenda/liberar")
    public ResponseEntity<Agenda> liberarData(@RequestParam LocalDate data) {
        return ResponseEntity.ok(agendaService.liberarData(data));
    }

    // ---- Tela "Painel": cards de indicadores (Novos Pedidos, Em Negociação, Receita, Confirmados) ----
    // Hoje o frontend calcula esses números no cliente a partir da lista de pedidos já carregada
    // (ver admin-component.ts). Esse endpoint fica pronto caso queiram migrar esse cálculo pro backend.
    @GetMapping("/painel/resumo")
    public ResponseEntity<Map<String, Object>> resumoPainel() {
        List<Orcamento> novos = orcamentoService.listarTodos(StatusOrcamento.NOVO);
        List<Orcamento> pendentes = orcamentoService.listarTodos(StatusOrcamento.PENDENTE);
        List<Orcamento> confirmados = orcamentoService.listarTodos(StatusOrcamento.CONFIRMADO);

        java.math.BigDecimal receitaConfirmada = confirmados.stream()
                .map(Orcamento::getTotalEstimado)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return ResponseEntity.ok(Map.of(
                "novosPedidos", novos.size(),
                "emNegociacao", pendentes.size(),
                "receitaConfirmada", receitaConfirmada,
                "eventosConfirmados", confirmados.size()
        ));
    }
}