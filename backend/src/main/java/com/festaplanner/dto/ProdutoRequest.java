package com.festaplanner.dto;

import com.festaplanner.model.CategoriaProduto;
import com.festaplanner.model.TipoItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdutoRequest {
    @NotBlank
    private String nome;

    private String descricao;

    @NotNull
    private CategoriaProduto categoria;

    @NotNull
    private TipoItem tipoItem;

    @NotNull @PositiveOrZero
    private BigDecimal valor;

    private String unidadeMedida;
    private Integer quantidadeMinima;
    private String imagemUrl;
    private Long produtoPaiId;
}
