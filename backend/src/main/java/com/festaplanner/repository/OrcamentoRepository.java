package com.festaplanner.repository;

import com.festaplanner.model.Orcamento;
import com.festaplanner.model.StatusOrcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    List<Orcamento> findByClienteIdOrderByCriadoEmDesc(Long clienteId);
    List<Orcamento> findByStatusOrderByCriadoEmDesc(StatusOrcamento status);
    List<Orcamento> findAllByOrderByCriadoEmDesc();
}
