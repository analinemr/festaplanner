package com.festaplanner.model;

/**
 * Regra de negócio central do catálogo: itens obrigatórios são fornecidos
 * pela casa de festas e não podem ser removidos do orçamento; itens
 * opcionais o cliente pode customizar/remover.
 */
public enum TipoItem {
    OBRIGATORIO,
    OPCIONAL
}
