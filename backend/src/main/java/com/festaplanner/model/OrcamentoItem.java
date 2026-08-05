package com.festaplanner.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/** Um item (produto/serviço) dentro de um orçamento, com sua quantidade. */
@Entity
@Table(name = "orcamento_itens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrcamentoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "orcamento_id", nullable = false)
    private Orcamento orcamento;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantidade = 1;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    public void calcularSubtotal() {
        this.subtotal = valorUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}
