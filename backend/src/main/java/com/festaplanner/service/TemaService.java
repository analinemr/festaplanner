package com.festaplanner.service;

import com.festaplanner.model.Tema;
import com.festaplanner.model.TipoEvento;
import com.festaplanner.repository.TemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TemaService {

    private final TemaRepository temaRepository;

    public List<Tema> listarPorTipoEvento(TipoEvento tipoEvento) {
        return temaRepository.findByTipoEventoAndAtivoTrue(tipoEvento);
    }

    public List<Tema> listarSubtemas(Long temaPaiId) {
        return temaRepository.findByTemaPaiId(temaPaiId);
    }

    public Tema buscarPorId(Long id) {
        return temaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tema não encontrado"));
    }

    public Tema salvar(Tema tema) {
        return temaRepository.save(tema);
    }
}
