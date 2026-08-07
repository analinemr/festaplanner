import 'package:dio/dio.dart';

import '../core/network/api_client.dart';
import '../models/depoimento.dart';

class DepoimentoService {
  final Dio _dio = ApiClient.instance.dio;

  Future<List<Depoimento>> listar() async {
    try {
      final response = await _dio.get('/admin/depoimentos');
      final data = response.data as List<dynamic>;
      return data
          .map((e) => Depoimento.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw ApiClient.instance.mapError(e);
    }
  }

  Future<void> aprovar(int id) async {
    try {
      await _dio.patch('/admin/depoimentos/$id/aprovar');
    } on DioException catch (e) {
      throw ApiClient.instance.mapError(e);
    }
  }

  Future<void> excluir(int id) async {
    try {
      await _dio.delete('/admin/depoimentos/$id');
    } on DioException catch (e) {
      throw ApiClient.instance.mapError(e);
    }
  }
}
