import 'package:flutter/foundation.dart';

import '../core/network/api_client.dart';
import '../models/enums.dart';
import '../models/orcamento.dart';
import '../services/orcamento_service.dart';

class OrcamentoProvider extends ChangeNotifier {
  final OrcamentoService _service = OrcamentoService();

  List<Orcamento> orcamentos = [];
  StatusOrcamento? filtroStatus;
  bool loading = false;
  String? erro;

  Future<void> carregar({StatusOrcamento? status}) async {
    filtroStatus = status;
    loading = true;
    erro = null;
    notifyListeners();

    try {
      orcamentos = await _service.listar(status: filtroStatus);
    } on ApiException catch (e) {
      erro = e.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> aplicarFiltro(StatusOrcamento? status) => carregar(status: status);

  Future<Orcamento?> buscarDetalhe(int id) async {
    try {
      return await _service.buscarPorId(id);
    } on ApiException catch (e) {
      erro = e.message;
      notifyListeners();
      return null;
    }
  }

  /// Atualiza o status de um orçamento e reflete a mudança na lista local,
  /// evitando ter que recarregar tudo da API.
  Future<Orcamento?> atualizarStatus(int id, StatusOrcamento novo) async {
    try {
      final atualizado = await _service.atualizarStatus(id, novo);
      final index = orcamentos.indexWhere((o) => o.id == id);
      if (index != -1) {
        orcamentos[index] = atualizado;
        notifyListeners();
      }
      return atualizado;
    } on ApiException catch (e) {
      erro = e.message;
      notifyListeners();
      rethrow;
    }
  }
}
