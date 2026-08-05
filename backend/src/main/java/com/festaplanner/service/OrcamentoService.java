package com.festaplanner.service;

import com.festaplanner.dto.*;
import com.festaplanner.model.*;
import com.festaplanner.repository.AgendaRepository;
import com.festaplanner.repository.OrcamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrcamentoService {

    private final OrcamentoRepository orcamentoRepository;
    private final AgendaRepository agendaRepository;
    private final ProdutoService produtoService;
    private final TemaService temaService;

    /** Etapa 01: cria um rascunho de orçamento com o tipo de evento e nº de convidados. */
    @Transactional
    public Orcamento iniciar(Usuario cliente, OrcamentoEventoRequest request) {
        Orcamento orcamento = Orcamento.builder()
                .cliente(cliente)
                .tipoEvento(request.getTipoEvento())
                .numeroConvidados(request.getNumeroConvidados())
                .dataEvento(request.getDataEvento())
                .status(StatusOrcamento.RASCUNHO)
                .build();

        // Adiciona automaticamente todos os itens OBRIGATÓRIOS ao orçamento —
        // regra de negócio: itens obrigatórios não podem ser removidos pelo cliente.
        orcamento = orcamentoRepository.save(orcamento);
        return orcamento;
    }

    /** Etapa 02: define o tema do evento. */
    @Transactional
    public Orcamento definirTema(Long orcamentoId, Long temaId, Usuario clienteLogado) {
        Orcamento orcamento = buscarDoCliente(orcamentoId, clienteLogado);
        Tema tema = temaService.buscarPorId(temaId);

        if (tema.getTipoEvento() != orcamento.getTipoEvento()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Este tema não pertence ao tipo de evento selecionado");
        }

        orcamento.setTema(tema);
        orcamento.recalcularTotais();
        return orcamentoRepository.save(orcamento);
    }

    /** Etapa 03: adiciona/atualiza um item de serviço no orçamento. */
    @Transactional
    public Orcamento adicionarItem(Long orcamentoId, OrcamentoItemRequest request, Usuario clienteLogado) {
        Orcamento orcamento = buscarDoCliente(orcamentoId, clienteLogado);
        Produto produto = produtoService.buscarPorId(request.getProdutoId());

        OrcamentoItem itemExistente = orcamento.getItens().stream()
                .filter(i -> i.getProduto().getId().equals(produto.getId()))
                .findFirst()
                .orElse(null);

        if (itemExistente != null) {
            itemExistente.setQuantidade(request.getQuantidade());
            itemExistente.calcularSubtotal();
        } else {
            OrcamentoItem novoItem = OrcamentoItem.builder()
                    .orcamento(orcamento)
                    .produto(produto)
                    .quantidade(request.getQuantidade())
                    .valorUnitario(produto.getValor())
                    .build();
            novoItem.calcularSubtotal();
            orcamento.getItens().add(novoItem);
        }

        orcamento.recalcularTotais();
        return orcamentoRepository.save(orcamento);
    }

    /** Remove um item — bloqueado para itens OBRIGATÓRIOS. */
    @Transactional
    public Orcamento removerItem(Long orcamentoId, Long itemId, Usuario clienteLogado) {
        Orcamento orcamento = buscarDoCliente(orcamentoId, clienteLogado);

        OrcamentoItem item = orcamento.getItens().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado no orçamento"));

        if (item.getProduto().getTipoItem() == TipoItem.OBRIGATORIO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Itens obrigatórios não podem ser removidos do orçamento");
        }

        orcamento.getItens().remove(item);
        orcamento.recalcularTotais();
        return orcamentoRepository.save(orcamento);
    }

    /** Etapa 04: confirma dados de contato e envia o orçamento para a casa de festas. */
    @Transactional
    public Orcamento enviar(Long orcamentoId, OrcamentoConfirmarRequest request, Usuario clienteLogado) {
        Orcamento orcamento = buscarDoCliente(orcamentoId, clienteLogado);

        orcamento.setNomeContato(request.getNomeContato());
        orcamento.setEmailContato(request.getEmailContato());
        orcamento.setWhatsappContato(request.getWhatsappContato());
        orcamento.setMelhorHorarioContato(request.getMelhorHorarioContato());
        orcamento.setObservacoes(request.getObservacoes());
        orcamento.setStatus(StatusOrcamento.NOVO);
        orcamento.setAtualizadoEm(LocalDateTime.now());

        return orcamentoRepository.save(orcamento);
    }

    /** Botão "Salvar rascunho", presente em todas as etapas do wizard. */
    @Transactional
    public Orcamento salvarRascunho(Long orcamentoId, Usuario clienteLogado) {
        Orcamento orcamento = buscarDoCliente(orcamentoId, clienteLogado);
        orcamento.setAtualizadoEm(LocalDateTime.now());
        return orcamentoRepository.save(orcamento);
    }

    public List<Orcamento> listarDoCliente(Long clienteId) {
        return orcamentoRepository.findByClienteIdOrderByCriadoEmDesc(clienteId);
    }

    public List<Orcamento> listarTodos(StatusOrcamento status) {
        return status != null
                ? orcamentoRepository.findByStatusOrderByCriadoEmDesc(status)
                : orcamentoRepository.findAllByOrderByCriadoEmDesc();
    }

    public Orcamento buscarPorId(Long id) {
        return orcamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orçamento não encontrado"));
    }

    private Orcamento buscarDoCliente(Long orcamentoId, Usuario cliente) {
        Orcamento orcamento = buscarPorId(orcamentoId);

        if (cliente != null && orcamento.getCliente() != null
                && !orcamento.getCliente().getId().equals(cliente.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este orçamento não pertence a você");
        }

        return orcamento;
    }

    /**
     * Ações do ADM na tela de Pedidos: ✓ aprova/avança status, ✗ recusa.
     * Ao mover para PRE_RESERVA ou CONFIRMADO, sincroniza a Agenda.
     */
    @Transactional
    public Orcamento atualizarStatus(Long orcamentoId, StatusOrcamento novoStatus) {
        Orcamento orcamento = buscarPorId(orcamentoId);
        orcamento.setStatus(novoStatus);
        orcamento.setAtualizadoEm(LocalDateTime.now());

        if (orcamento.getDataEvento() != null &&
                (novoStatus == StatusOrcamento.PRE_RESERVA || novoStatus == StatusOrcamento.CONFIRMADO)) {

            Agenda agenda = agendaRepository.findByData(orcamento.getDataEvento())
                    .orElse(Agenda.builder().data(orcamento.getDataEvento()).build());

            agenda.setStatus(novoStatus == StatusOrcamento.CONFIRMADO
                    ? StatusAgenda.CONFIRMADO
                    : StatusAgenda.PRE_RESERVA);
            agenda.setOrcamento(orcamento);
            agendaRepository.save(agenda);
        }

        return orcamentoRepository.save(orcamento);
    }
}
