import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

/// Configuração central da URL base da API.
///
/// IMPORTANTE (dev):
/// - Emulador Android  -> 10.0.2.2 (aponta para o localhost do PC host)
/// - Dispositivo físico -> IP da sua máquina na rede local, ex: 192.168.0.10
/// - Chrome/web/desktop -> localhost funciona normalmente
///
/// Troque `_devHostAndroidEmulator` / `_devHostPhysicalDevice` conforme
/// necessário, ou defina via `--dart-define=API_HOST=192.168.0.10` ao rodar:
///   flutter run --dart-define=API_HOST=192.168.0.10
class AppConfig {
  AppConfig._();

  static const _devHostAndroidEmulator = '10.0.2.2';
  // Ajuste para o IP da sua máquina quando testar em celular físico:
  static const _devHostPhysicalDevice = '192.168.0.10';

  /// Defina true se estiver testando em dispositivo físico (não emulador).
  static const bool _usandoDispositivoFisico = false;

  static const String _apiHostFromEnv =
      String.fromEnvironment('API_HOST', defaultValue: '');

  static const String _apiPort = '8080';

  static String get baseUrl {
    if (_apiHostFromEnv.isNotEmpty) {
      return 'http://$_apiHostFromEnv:$_apiPort/api';
    }

    if (kIsWeb) {
      return 'http://localhost:$_apiPort/api';
    }

    if (!kIsWeb && Platform.isAndroid) {
      final host = _usandoDispositivoFisico
          ? _devHostPhysicalDevice
          : _devHostAndroidEmulator;
      return 'http://$host:$_apiPort/api';
    }

    // iOS simulator / desktop
    return 'http://localhost:$_apiPort/api';
  }
}
