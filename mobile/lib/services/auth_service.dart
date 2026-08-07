import 'package:dio/dio.dart';

import '../core/network/api_client.dart';
import '../models/usuario.dart';

class AuthService {
  final Dio _dio = ApiClient.instance.dio;

  /// Faz login e retorna o Usuario com o token.
  /// Lança ApiException em caso de erro (401, timeout, etc).
  /// Lança ApiException com mensagem específica se o perfil não for
  /// ADMINISTRADOR (o app é só para administradores).
  Future<Usuario> login({
    required String email,
    required String senha,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'email': email, 'senha': senha},
      );

      final usuario = Usuario.fromJson(response.data as Map<String, dynamic>);

      if (!usuario.isAdministrador) {
        throw ApiException(
          'Este app é exclusivo para administradores. '
          'Sua conta não tem permissão de acesso.',
        );
      }

      return usuario;
    } on DioException catch (e) {
      throw ApiClient.instance.mapError(e);
    }
  }
}
