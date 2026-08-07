import 'package:dio/dio.dart';

import '../core/network/api_client.dart';
import '../models/enums.dart';
import '../models/orcamento.dart';

class OrcamentoService {
  final Dio _dio = ApiClient.instance.dio;

  Future<List<Orcamento>> listar({StatusOrcamento? status}) async {
    try {
      final response = await _dio.get(
        '/admin/orcamentos',
        queryParameters: status != null ? {'status': status.apiValue} : null,
      );
      final data = response.data as List<dynamic>;
      return data
          .map((e) => Orcamento.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiClient.instance.mapError(e);
    }
  }

  Future<Orcamento> buscarPorId(int id) async {
    try {
      final response = await _dio.get('/admin/orcamentos/$id');
      return Orcamento.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiClient.instance.mapError(e);
    }
  }

  Future<Orcamento> atualizarStatus(int id, StatusOrcamento novoStatus) async {
    try {
      final response = await _dio.patch(
        '/admin/orcamentos/$id/status',
        data: {'status': novoStatus.apiValue},
      );
      return Orcamento.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiClient.instance.mapError(e);
    }
  }
}
