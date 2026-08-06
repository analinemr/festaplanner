package com.festaplanner.dto;

import com.festaplanner.model.Perfil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroRequest {
    @NotBlank
    private String nome;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "A senha deve ter ao menos 6 caracteres")
    private String senha;

    private String telefone;

    /** CLIENTE ou ADMINISTRADOR. Default CLIENTE se não informado. */
    private Perfil perfil = Perfil.CLIENTE;
}
