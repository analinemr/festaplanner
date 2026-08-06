package com.festaplanner.dto;

import com.festaplanner.model.StatusOrcamento;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtualizarStatusRequest {
    @NotNull
    private StatusOrcamento status;
}