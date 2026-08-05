package com.festaplanner.service;

import com.festaplanner.dto.ProdutoRequest;
import com.festaplanner.model.CategoriaProduto;
import com.festaplanner.model.Produto;
import com.festaplanner.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public List<Produto> listar(CategoriaProduto categoria) {
        return categoria != null
                ? produtoRepository.findByCategoriaAndAtivoTrue(categoria)
                : produtoRepository.findByAtivoTrue();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public Produto criar(ProdutoRequest request) {
        Produto produtoPai = request.getProdutoPaiId() != null ? buscarPorId(request.getProdutoPaiId()) : null;

        Produto produto = Produto.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .categoria(request.getCategoria())
                .tipoItem(request.getTipoItem())
                .valor(request.getValor())
                .unidadeMedida(request.getUnidadeMedida())
                .quantidadeMinima(request.getQuantidadeMinima())
                .imagemUrl(request.getImagemUrl())
                .produtoPai(produtoPai)
                .ativo(true)
                .build();

        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, ProdutoRequest request) {
        Produto produto = buscarPorId(id);

        produto.setNome(request.getNome());
        produto.setDescricao(request.getDescricao());
        produto.setCategoria(request.getCategoria());
        produto.setTipoItem(request.getTipoItem());
        produto.setValor(request.getValor());
        produto.setUnidadeMedida(request.getUnidadeMedida());
        produto.setQuantidadeMinima(request.getQuantidadeMinima());
        produto.setImagemUrl(request.getImagemUrl());

        if (request.getProdutoPaiId() != null) {
            produto.setProdutoPai(buscarPorId(request.getProdutoPaiId()));
        }

        return produtoRepository.save(produto);
    }

    /**
     * Exclusão lógica: itens obrigatórios que já compõem orçamentos não devem
     * sumir do histórico, então apenas desativamos o produto do catálogo ativo.
     */
    public void desativar(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }
}
