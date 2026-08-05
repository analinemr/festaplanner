package com.festaplanner.controller;
import com.festaplanner.dto.*;
import com.festaplanner.model.Orcamento;
import com.festaplanner.model.StatusOrcamento;
import com.festaplanner.model.Usuario;
import com.festaplanner.service.OrcamentoService;
import com.festaplanner.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
/**
 * Endpoints do wizard de orçamento (telas "orçamento1..4" do cliente) e da
 * tela "Pedidos" do ADM. Rotas do wizard permitem visitante sem login
 * (ver SecurityConfig); "Meus Orçamentos" continua exigindo autenticação.
 */
@RestController
@RequestMapping("/api/orcamentos")
@RequiredArgsConstructor
public class OrcamentoController {
    private final OrcamentoService orcamentoService;
    private final UsuarioService usuarioService;

    private Usuario usuarioLogado(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null; // visitante sem login
        }
        return usuarioService.buscarPorEmail(auth.getName());
    }

    // ---- Etapa 01: Evento ----
    @PostMapping
    public ResponseEntity<Orcamento> iniciar(@Valid @RequestBody OrcamentoEventoRequest request,
                                              Authentication auth) {
        return ResponseEntity.ok(orcamentoService.iniciar(usuarioLogado(auth), request));
    }
    // ---- Etapa 02: Tema ----
    @PutMapping("/{id}/tema/{temaId}")
    public ResponseEntity<Orcamento> definirTema(@PathVariable Long id, @PathVariable Long temaId,
                                                  Authentication auth) {
        return ResponseEntity.ok(orcamentoService.definirTema(id, temaId, usuarioLogado(auth)));
    }
    // ---- Etapa 03: Serviços ----
    @PostMapping("/{id}/itens")
    public ResponseEntity<Orcamento> adicionarItem(@PathVariable Long id,
                                                     @Valid @RequestBody OrcamentoItemRequest request,
                                                     Authentication auth) {
        return ResponseEntity.ok(orcamentoService.adicionarItem(id, request, usuarioLogado(auth)));
    }
    @DeleteMapping("/{id}/itens/{itemId}")
    public ResponseEntity<Orcamento> removerItem(@PathVariable Long id, @PathVariable Long itemId,
                                                  Authentication auth) {
        return ResponseEntity.ok(orcamentoService.removerItem(id, itemId, usuarioLogado(auth)));
    }
    // ---- Etapa 04: Confirmar / enviar ----
    @PostMapping("/{id}/enviar")
    public ResponseEntity<Orcamento> enviar(@PathVariable Long id,
                                             @Valid @RequestBody OrcamentoConfirmarRequest request,
                                             Authentication auth) {
        return ResponseEntity.ok(orcamentoService.enviar(id, request, usuarioLogado(auth)));
    }
    // ---- Botão "Salvar rascunho" (disponível em todas as etapas) ----
    @PostMapping("/{id}/salvar-rascunho")
    public ResponseEntity<Orcamento> salvarRascunho(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(orcamentoService.salvarRascunho(id, usuarioLogado(auth)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Orcamento> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(orcamentoService.buscarPorId(id));
    }
    // ---- "Meus Orçamentos" (histórico do cliente) ----
    @GetMapping("/meus")
    public ResponseEntity<List<Orcamento>> meusOrcamentos(Authentication auth) {
        Usuario cliente = usuarioLogado(auth);
        return ResponseEntity.ok(orcamentoService.listarDoCliente(cliente.getId()));
    }
}