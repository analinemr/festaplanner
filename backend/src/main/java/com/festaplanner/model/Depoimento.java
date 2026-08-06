package com.festaplanner.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Mensagem/depoimento que o cliente envia sobre a festa realizada, na tela
 * "Sua conta". Pode futuramente ser destacado na página inicial — por ora
 * fica salvo sem exibição automática (aprovado = false até o ADM decidir
 * como vai funcionar a moderação).
 */
@Entity
@Table(name = "depoimentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Depoimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @Column(nullable = false, length = 1000)
    private String mensagem;

    /** Nome/descrição do evento a que se refere, se o cliente quiser informar. */
    private String referenteEvento;

    /** Só passa a aparecer na home quando um admin aprovar (tela de moderação ainda não existe). */
    @Builder.Default
    private boolean aprovado = false;

    @Builder.Default
    private LocalDateTime criadoEm = LocalDateTime.now();
}