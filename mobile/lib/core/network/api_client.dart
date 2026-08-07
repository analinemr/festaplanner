import 'package:dio/dio.dart';

import 'app_config.dart';
import '../storage/secure_storage.dart';

/// Exceção de aplicação para erros de API, já com mensagem amigável extraída
/// do corpo de resposta do backend (ex: { "message": "..." }).
class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

/// Cliente HTTP único do app. Injeta automaticamente o header
/// `Authorization: Bearer <token>` em toda requisição (quando houver token
/// salvo) e converte erros do Dio em ApiException com mensagem legível.
class ApiClient {
  ApiClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await SecureStorage.instance.token;
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
      ),
    );
  }

  static final ApiClient instance = ApiClient._internal();
  late final Dio _dio;

  Dio get dio => _dio;

  /// Converte um DioException em ApiException com mensagem amigável,
  /// tentando extrair `message` do corpo de erro do backend.
  ApiException mapError(DioException e) {
    final status = e.response?.statusCode;
    final data = e.response?.data;

    String message;
    if (data is Map && data['message'] != null) {
      message = data['message'].toString();
    } else if (status == 401) {
      message = 'E-mail ou senha incorretos.';
    } else if (status == 403) {
      message = 'Você não tem permissão para acessar este recurso.';
    } else if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.connectionError) {
      message = 'Não foi possível conectar ao servidor. Verifique sua rede.';
    } else {
      message = 'Ocorreu um erro inesperado. Tente novamente.';
    }

    return ApiException(message, statusCode: status);
  }
}
