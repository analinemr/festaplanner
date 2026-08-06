package com.festaplanner.service;

import com.festaplanner.model.Agenda;
import com.festaplanner.model.StatusAgenda;
import com.festaplanner.repository.AgendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final AgendaRepository agendaRepository;

    public List<Agenda> listarPorMes(int ano, int mes) {
        YearMonth yearMonth = YearMonth.of(ano, mes);
        return agendaRepository.findByDataBetween(yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    /** Usado pelo ADM para bloquear datas manualmente (ex.: manutenção do espaço). */
    public Agenda bloquearData(LocalDate data, String observacao) {
        Agenda agenda = agendaRepository.findByData(data)
                .orElse(Agenda.builder().data(data).build());
        agenda.setStatus(StatusAgenda.BLOQUEADO);
        agenda.setObservacao(observacao);
        return agendaRepository.save(agenda);
    }

    public Agenda liberarData(LocalDate data) {
        Agenda agenda = agendaRepository.findByData(data)
                .orElse(Agenda.builder().data(data).build());
        agenda.setStatus(StatusAgenda.DISPONIVEL);
        agenda.setOrcamento(null);
        return agendaRepository.save(agenda);
    }
}
