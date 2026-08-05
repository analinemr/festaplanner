package com.festaplanner.repository;

import com.festaplanner.model.CategoriaProduto;
import com.festaplanner.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByAtivoTrue();
    List<Produto> findByCategoriaAndAtivoTrue(CategoriaProduto categoria);
    List<Produto> findByProdutoPaiId(Long produtoPaiId);
}
