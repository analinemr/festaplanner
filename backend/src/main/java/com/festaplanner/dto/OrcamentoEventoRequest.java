package com.festaplanner.dto;

import com.festaplanner.model.TipoEvento;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

/** Etapa "01 Evento" do wizard. */
@Data
public class OrcamentoEventoRequest {
    @NotNull
    private TipoEvento tipoEvento;

    @NotNull @Positive
    private Integer numeroConvidados;

    private LocalDate dataEvento;
}
