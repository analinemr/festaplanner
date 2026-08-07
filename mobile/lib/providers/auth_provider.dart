import 'package:flutter/foundation.dart';

import '../core/network/api_client.dart';
import '../core/storage/secure_storage.dart';
import '../models/usuario.dart';
import '../services/auth_service.dart';

enum AuthStatus { desconhecido, autenticado, naoAutenticado }

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  AuthStatus status = AuthStatus.desconhecido;
  Usuario? usuario;
  bool loading = false;
  String? erro;

  /// Verifica se já existe um token salvo (auto-login ao abrir o app).
  Future<void> restaurarSessao() async {
    final token = await SecureStorage.instance.token;
    final nome = await SecureStorage.instance.nome;
    final email = await SecureStorage.instance.email;
    final perfil = await SecureStorage.instance.perfil;

    if (token != null && nome != null && email != null && perfil != null) {
      usuario = Usuario(
        usuarioId: 0,
        nome: nome,
        email: email,
        perfil: perfil,
        token: token,
      );
      status = AuthStatus.autenticado;
    } else {
      status = AuthStatus.naoAutenticado;
    }
    notifyListeners();
  }

  Future<bool> login({required String email, required String senha}) async {
    loading = true;
    erro = null;
    notifyListeners();

    try {
      final u = await _authService.login(email: email, senha: senha);
      await SecureStorage.instance.saveSession(
        token: u.token,
        usuarioId: u.usuarioId,
        nome: u.nome,
        email: u.email,
        perfil: u.perfil,
      );
      usuario = u;
      status = AuthStatus.autenticado;
      return true;
    } on ApiException catch (e) {
      erro = e.message;
      status = AuthStatus.naoAutenticado;
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await SecureStorage.instance.clear();
    usuario = null;
    status = AuthStatus.naoAutenticado;
    notifyListeners();
  }
}
