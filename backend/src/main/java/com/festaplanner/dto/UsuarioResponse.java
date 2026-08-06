package com.festaplanner.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String perfil;
}