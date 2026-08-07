class Usuario {
  final int usuarioId;
  final String nome;
  final String email;
  final String perfil;
  final String token;

  Usuario({
    required this.usuarioId,
    required this.nome,
    required this.email,
    required this.perfil,
    required this.token,
  });

  bool get isAdministrador => perfil == 'ADMINISTRADOR';

  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      usuarioId: json['usuarioId'] as int,
      nome: json['nome'] as String,
      email: json['email'] as String,
      perfil: json['perfil'] as String,
      token: json['token'] as String,
    );
  }
}
