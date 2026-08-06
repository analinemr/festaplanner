package com.festaplanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DepoimentoRequest {
    @NotBlank
    @Size(max = 1000)
    private String mensagem;

    private String referenteEvento;
}