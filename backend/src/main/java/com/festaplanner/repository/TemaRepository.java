package com.festaplanner.repository;

import com.festaplanner.model.Tema;
import com.festaplanner.model.TipoEvento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TemaRepository extends JpaRepository<Tema, Long> {
    List<Tema> findByTipoEventoAndAtivoTrue(TipoEvento tipoEvento);
    List<Tema> findByTemaPaiId(Long temaPaiId);
}
