package com.festaplanner.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OrcamentoItemRequest {
    @NotNull
    private Long produtoId;

    @NotNull @Positive
    private Integer quantidade;
}
