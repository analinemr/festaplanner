package com.festaplanner.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DepoimentoResponse {
    private Long id;
    private String nomeCliente;
    private String mensagem;
    private String referenteEvento;
    private boolean aprovado;
    private LocalDateTime criadoEm;
}