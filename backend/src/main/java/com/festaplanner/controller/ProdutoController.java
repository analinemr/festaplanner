package com.festaplanner.controller;

import com.festaplanner.dto.ProdutoRequest;
import com.festaplanner.model.CategoriaProduto;
import com.festaplanner.model.Produto;
import com.festaplanner.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints para a tela "Catálogo" e "Novo Produto" do ADM,
 * e para a etapa "03 Serviços" do wizard do cliente.
 * Listagem é pública (sem cadastro); criação/edição/exclusão exige ADMINISTRADOR
 * (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<Produto>> listar(@RequestParam(required = false) CategoriaProduto categoria) {
        return ResponseEntity.ok(produtoService.listar(categoria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequest request) {
        return ResponseEntity.ok(produtoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest request) {
        return ResponseEntity.ok(produtoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        produtoService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
