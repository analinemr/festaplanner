package com.festaplanner.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Item do catálogo (tela "Novo Produto" / "Catálogo" do ADM).
 * Suporta hierarquia simples de subitens (ex.: Bolo -> Recheio -> Chocolate).
 */
@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 1000)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaProduto categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoItem tipoItem = TipoItem.OPCIONAL;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    /** Ex.: "un", "un/pacote de 20" — usado nos docinhos/salgadinhos com quantidade mínima. */
    private String unidadeMedida;

    private Integer quantidadeMinima;

    /** Passo de incremento da quantidade (ex.: docinhos sobem de 5 em 5). */
    private Integer incremento;

    private String imagemUrl;

    @Builder.Default
    private boolean ativo = true;

    /**
     * Subcategoria fina dentro de uma categoria principal.
     * Ex.: em DECORACAO -> "balao", "cenografia", "iluminacao", "personalizacao", "mobiliario".
     * Em MUSICA/ANIMACAO -> "musica", "som", "animacao", "show", "experiencia".
     * Em DOCES -> "tradicional", "gourmet", "fino". Em SALGADOS -> "tradicional", "sofisticado".
     */
    private String subcategoria;

    /** CLASSICA (linha tradicional) ou PREMIUM (linha fina/sofisticada). */
    @Enumerated(EnumType.STRING)
    private Linha linha;

    /** Quem executa/fornece o item (usado em Decoração). */
    @Enumerated(EnumType.STRING)
    private Fornecimento fornecimento;

    /** Itens que já vêm inclusos no preço (usado em Decoração e Música/Animação). */
    @Column(length = 1000)
    private String itensInclusos;

    /** Itens que NÃO estão inclusos, para deixar claro pro cliente. */
    @Column(length = 1000)
    private String itensNaoInclusos;

    /** Duração padrão em horas do serviço (usado em Música/Animação). */
    private Integer duracaoHoras;

    /** true quando o preço não é fixo e depende de orçamento sob consulta (ex.: cenografia temática). */
    @Builder.Default
    private boolean sobOrcamento = false;

    /** Texto livre tipo "a partir de R$ 800,00", exibido quando sobOrcamento = true. */
    private String precoReferencia;

    /** Subitens, ex.: variações de recheio/cobertura de um bolo. */
    @ManyToOne
    @JoinColumn(name = "produto_pai_id")
    private Produto produtoPai;
}
