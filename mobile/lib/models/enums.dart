import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';

enum StatusOrcamento {
  rascunho,
  novo,
  pendente,
  preReserva,
  confirmado,
  recusado;

  static StatusOrcamento fromApi(String value) {
    switch (value) {
      case 'RASCUNHO':
        return StatusOrcamento.rascunho;
      case 'NOVO':
        return StatusOrcamento.novo;
      case 'PENDENTE':
        return StatusOrcamento.pendente;
      case 'PRE_RESERVA':
        return StatusOrcamento.preReserva;
      case 'CONFIRMADO':
        return StatusOrcamento.confirmado;
      case 'RECUSADO':
        return StatusOrcamento.recusado;
      default:
        throw ArgumentError('Status desconhecido: $value');
    }
  }

  String get apiValue {
    switch (this) {
      case StatusOrcamento.rascunho:
        return 'RASCUNHO';
      case StatusOrcamento.novo:
        return 'NOVO';
      case StatusOrcamento.pendente:
        return 'PENDENTE';
      case StatusOrcamento.preReserva:
        return 'PRE_RESERVA';
      case StatusOrcamento.confirmado:
        return 'CONFIRMADO';
      case StatusOrcamento.recusado:
        return 'RECUSADO';
    }
  }

  String get label {
    switch (this) {
      case StatusOrcamento.rascunho:
        return 'Rascunho';
      case StatusOrcamento.novo:
        return 'Novo';
      case StatusOrcamento.pendente:
        return 'Pendente';
      case StatusOrcamento.preReserva:
        return 'Pré-reserva';
      case StatusOrcamento.confirmado:
        return 'Confirmado';
      case StatusOrcamento.recusado:
        return 'Recusado';
    }
  }

  Color get color {
    switch (this) {
      case StatusOrcamento.rascunho:
        return AppColors.statusRascunho;
      case StatusOrcamento.novo:
        return AppColors.statusNovo;
      case StatusOrcamento.pendente:
        return AppColors.statusPendente;
      case StatusOrcamento.preReserva:
        return AppColors.statusPreReserva;
      case StatusOrcamento.confirmado:
        return AppColors.statusConfirmado;
      case StatusOrcamento.recusado:
        return AppColors.statusRecusado;
    }
  }
}

/// Lista de status usados no filtro da listagem (RASCUNHO fica de fora,
/// pois a listagem sem filtro já o exclui por padrão no backend).
const List<StatusOrcamento> statusFiltraveis = [
  StatusOrcamento.novo,
  StatusOrcamento.pendente,
  StatusOrcamento.preReserva,
  StatusOrcamento.confirmado,
  StatusOrcamento.recusado,
];

enum TipoEvento {
  casamento,
  quinzeAnos,
  infantil,
  floral,
  tematico,
  corporativo;

  static TipoEvento fromApi(String value) {
    switch (value) {
      case 'CASAMENTO':
        return TipoEvento.casamento;
      case 'QUINZE_ANOS':
        return TipoEvento.quinzeAnos;
      case 'INFANTIL':
        return TipoEvento.infantil;
      case 'FLORAL':
        return TipoEvento.floral;
      case 'TEMATICO':
        return TipoEvento.tematico;
      case 'CORPORATIVO':
        return TipoEvento.corporativo;
      default:
        throw ArgumentError('Tipo de evento desconhecido: $value');
    }
  }

  String get label {
    switch (this) {
      case TipoEvento.casamento:
        return 'Casamento';
      case TipoEvento.quinzeAnos:
        return '15 Anos';
      case TipoEvento.infantil:
        return 'Infantil';
      case TipoEvento.floral:
        return 'Floral';
      case TipoEvento.tematico:
        return 'Temático';
      case TipoEvento.corporativo:
        return 'Corporativo';
    }
  }
}
