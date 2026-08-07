import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Wrapper simples sobre flutter_secure_storage para guardar o token JWT
/// e os dados básicos do usuário administrador logado.
class SecureStorage {
  SecureStorage._internal();
  static final SecureStorage instance = SecureStorage._internal();

  final _storage = const FlutterSecureStorage();

  static const _keyToken = 'auth_token';
  static const _keyUsuarioId = 'usuario_id';
  static const _keyNome = 'usuario_nome';
  static const _keyEmail = 'usuario_email';
  static const _keyPerfil = 'usuario_perfil';

  Future<void> saveSession({
    required String token,
    required int usuarioId,
    required String nome,
    required String email,
    required String perfil,
  }) async {
    await Future.wait([
      _storage.write(key: _keyToken, value: token),
      _storage.write(key: _keyUsuarioId, value: usuarioId.toString()),
      _storage.write(key: _keyNome, value: nome),
      _storage.write(key: _keyEmail, value: email),
      _storage.write(key: _keyPerfil, value: perfil),
    ]);
  }

  Future<String?> get token => _storage.read(key: _keyToken);
  Future<String?> get nome => _storage.read(key: _keyNome);
  Future<String?> get email => _storage.read(key: _keyEmail);
  Future<String?> get perfil => _storage.read(key: _keyPerfil);

  Future<void> clear() => _storage.deleteAll();
}
