package com.festaplanner.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Orçamento montado pelo cliente no wizard de 4 etapas
 * (01 Evento -> 02 Tema -> 03 Serviços -> 04 Confirmar).
 */
@Entity
@Table(name = "orcamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = true)
    private Usuario cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvento tipoEvento;

    @ManyToOne
    @JoinColumn(name = "tema_id")
    private Tema tema;

    @Column(nullable = false)
    private Integer numeroConvidados;

    private LocalDate dataEvento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusOrcamento status = StatusOrcamento.RASCUNHO;

    @OneToMany(mappedBy = "orcamento", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrcamentoItem> itens = new ArrayList<>();

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal taxaServicoPercentual = new BigDecimal("5.00");

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalEstimado = BigDecimal.ZERO;

    // Dados de contato preenchidos na etapa "04 Confirmar"
    private String nomeContato;
    private String emailContato;
    private String whatsappContato;
    private String melhorHorarioContato;

    @Column(length = 1000)
    private String observacoes;

    @Builder.Default
    private LocalDateTime criadoEm = LocalDateTime.now();

    private LocalDateTime atualizadoEm;

    /** Recalcula subtotal e total com base nos itens + tema selecionados. */
    public void recalcularTotais() {
        BigDecimal itensTotal = itens.stream()
                .map(OrcamentoItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal temaValor = tema != null && tema.getValor() != null ? tema.getValor() : BigDecimal.ZERO;

        this.subtotal = itensTotal.add(temaValor);
        BigDecimal taxa = this.subtotal.multiply(taxaServicoPercentual).divide(new BigDecimal("100"));
        this.totalEstimado = this.subtotal.add(taxa);
    }
}
