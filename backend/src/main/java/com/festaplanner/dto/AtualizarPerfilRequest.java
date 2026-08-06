package com.festaplanner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AtualizarPerfilRequest {
    @NotBlank
    private String nome;

    private String telefone;
}