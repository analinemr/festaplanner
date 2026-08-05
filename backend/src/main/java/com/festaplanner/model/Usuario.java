package com.festaplanner.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    /** Nulo quando o login é via provedor externo (Google/Microsoft/Apple). */
    private String senhaHash;

    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProvedorLogin provedorLogin = ProvedorLogin.EMAIL;

    @Builder.Default
    private boolean emailVerificado = false;

    @Builder.Default
    private LocalDateTime criadoEm = LocalDateTime.now();
}
