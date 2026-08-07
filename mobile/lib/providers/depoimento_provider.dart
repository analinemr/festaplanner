import 'package:flutter/foundation.dart';

import '../core/network/api_client.dart';
import '../models/depoimento.dart';
import '../services/depoimento_service.dart';

class DepoimentoProvider extends ChangeNotifier {
  final DepoimentoService _service = DepoimentoService();

  List<Depoimento> depoimentos = [];
  bool loading = false;
  String? erro;

  Future<void> carregar() async {
    loading = true;
    erro = null;
    notifyListeners();

    try {
      depoimentos = await _service.listar();
      // Não aprovados primeiro (fila de moderação em destaque)
      depoimentos.sort((a, b) {
        if (a.aprovado == b.aprovado) return 0;
        return a.aprovado ? 1 : -1;
      });
    } on ApiException catch (e) {
      erro = e.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> aprovar(int id) async {
    final index = depoimentos.indexWhere((d) => d.id == id);
    if (index == -1) return;

    final anterior = depoimentos[index];
    depoimentos[index] = anterior.copyWith(aprovado: true);
    notifyListeners();

    try {
      await _service.aprovar(id);
    } on ApiException catch (e) {
      depoimentos[index] = anterior;
      erro = e.message;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> excluir(int id) async {
    final removido = depoimentos.firstWhere((d) => d.id == id);
    final index = depoimentos.indexOf(removido);
    depoimentos.removeAt(index);
    notifyListeners();

    try {
      await _service.excluir(id);
    } on ApiException catch (e) {
      depoimentos.insert(index, removido);
      erro = e.message;
      notifyListeners();
      rethrow;
    }
  }
}
