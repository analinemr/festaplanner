package com.festaplanner.service;

import com.festaplanner.dto.DepoimentoRequest;
import com.festaplanner.dto.DepoimentoResponse;
import com.festaplanner.model.Depoimento;
import com.festaplanner.model.Usuario;
import com.festaplanner.repository.DepoimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepoimentoService {

    private final DepoimentoRepository depoimentoRepository;

    @Transactional
    public Depoimento enviar(Usuario cliente, DepoimentoRequest request) {
        Depoimento depoimento = Depoimento.builder()
                .cliente(cliente)
                .mensagem(request.getMensagem())
                .referenteEvento(request.getReferenteEvento())
                .build();
        return depoimentoRepository.save(depoimento);
    }

    /** Público — usado na Home. Só os aprovados pelo ADM. */
    public List<Depoimento> listarAprovados() {
        return depoimentoRepository.findByAprovadoTrueOrderByCriadoEmDesc();
    }

    /** Tela de moderação do ADM — todos, aprovados ou não. */
    public List<Depoimento> listarParaAdmin() {
        return depoimentoRepository.findAllByOrderByCriadoEmDesc();
    }

    @Transactional
    public Depoimento aprovar(Long id) {
        Depoimento depoimento = buscarPorId(id);
        depoimento.setAprovado(true);
        return depoimentoRepository.save(depoimento);
    }

    /** "Recusar": como não existe um estado intermediário, remove o depoimento. */
    @Transactional
    public void excluir(Long id) {
        if (!depoimentoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Depoimento não encontrado");
        }
        depoimentoRepository.deleteById(id);
    }

    private Depoimento buscarPorId(Long id) {
        return depoimentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Depoimento não encontrado"));
    }

    /** Converte a entidade para o DTO público, sem expor os dados do Usuario (ex.: senhaHash). */
    public DepoimentoResponse paraResponse(Depoimento depoimento) {
        return DepoimentoResponse.builder()
                .id(depoimento.getId())
                .nomeCliente(depoimento.getCliente() != null ? depoimento.getCliente().getNome() : "Cliente FestaPlanner")
                .mensagem(depoimento.getMensagem())
                .referenteEvento(depoimento.getReferenteEvento())
                .aprovado(depoimento.isAprovado())
                .criadoEm(depoimento.getCriadoEm())
                .build();
    }
}