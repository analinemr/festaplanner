package com.festaplanner.controller;

import com.festaplanner.model.Tema;
import com.festaplanner.model.TipoEvento;
import com.festaplanner.service.TemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints para a etapa "02 Tema" do wizard e para a "Página de Temas" pública. */
@RestController
@RequestMapping("/api/temas")
@RequiredArgsConstructor
public class TemaController {

    private final TemaService temaService;

    @GetMapping
    public ResponseEntity<List<Tema>> listarPorTipoEvento(@RequestParam TipoEvento tipoEvento) {
        return ResponseEntity.ok(temaService.listarPorTipoEvento(tipoEvento));
    }

    @GetMapping("/{id}/subtemas")
    public ResponseEntity<List<Tema>> listarSubtemas(@PathVariable Long id) {
        return ResponseEntity.ok(temaService.listarSubtemas(id));
    }
}
