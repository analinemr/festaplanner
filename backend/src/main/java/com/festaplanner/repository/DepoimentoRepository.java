package com.festaplanner.repository;

import com.festaplanner.model.Depoimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepoimentoRepository extends JpaRepository<Depoimento, Long> {
    List<Depoimento> findByClienteIdOrderByCriadoEmDesc(Long clienteId);
    List<Depoimento> findByAprovadoTrueOrderByCriadoEmDesc();
    List<Depoimento> findAllByOrderByCriadoEmDesc();
}