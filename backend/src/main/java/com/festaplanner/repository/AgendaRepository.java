package com.festaplanner.repository;

import com.festaplanner.model.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AgendaRepository extends JpaRepository<Agenda, Long> {
    Optional<Agenda> findByData(LocalDate data);
    List<Agenda> findByDataBetween(LocalDate inicio, LocalDate fim);
}
