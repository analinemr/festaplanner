package com.festaplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;

    /** Fixo em "Bearer" — é o tipo de token esperado pelo header Authorization. */
    @Builder.Default
    private String tipo = "Bearer";

    private Long usuarioId;
    private String nome;
    private String email;
    private String perfil;
}