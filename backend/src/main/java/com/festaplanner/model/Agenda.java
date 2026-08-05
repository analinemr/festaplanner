package com.festaplanner.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/** Uma data do calendário da casa de festas (tela "Agenda" do ADM). */
@Entity
@Table(name = "agenda", uniqueConstraints = @UniqueConstraint(columnNames = "data"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusAgenda status = StatusAgenda.DISPONIVEL;

    @OneToOne
    @JoinColumn(name = "orcamento_id")
    private Orcamento orcamento;

    private String observacao;
}
