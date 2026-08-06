package com.festaplanner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** Etapa "04 Confirmar" do wizard: dados de contato + envio do pedido. */
@Data
public class OrcamentoConfirmarRequest {
    @NotBlank
    private String nomeContato;

    @NotBlank @Email
    private String emailContato;

    @NotBlank
    private String whatsappContato;

    private String melhorHorarioContato;
    private String observacoes;
}
