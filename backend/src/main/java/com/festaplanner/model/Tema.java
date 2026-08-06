package com.festaplanner.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Tema/subtema de um tipo de evento.
 * Ex.: Casamento -> Rústico -> Vintage (subtema aninhado via temaPai).
 */
@Entity
@Table(name = "temas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    private String imagemUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvento tipoEvento;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal valor = BigDecimal.ZERO;

    /** Auto-relacionamento para representar subtemas (ex.: Disney -> Bela e a Fera). */
    @ManyToOne
    @JoinColumn(name = "tema_pai_id")
    private Tema temaPai;

    @Builder.Default
    private boolean ativo = true;

    /** Usado apenas em temas infantis, para o filtro Meninos/Meninas/Unissex. */
    @Enumerated(EnumType.STRING)
    private Genero genero;

    /** Usado apenas em temas de 15 anos (Clássico, Moderno, Romântico). */
    @Enumerated(EnumType.STRING)
    private CategoriaTema categoriaTema;
}
