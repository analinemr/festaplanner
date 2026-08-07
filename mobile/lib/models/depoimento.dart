class Depoimento {
  final int id;
  final String nomeCliente;
  final String mensagem;
  final String? referenteEvento;
  final bool aprovado;
  final DateTime? criadoEm;

  Depoimento({
    required this.id,
    required this.nomeCliente,
    required this.mensagem,
    required this.referenteEvento,
    required this.aprovado,
    required this.criadoEm,
  });

  factory Depoimento.fromJson(Map<String, dynamic> json) => Depoimento(
        id: json['id'] as int,
        nomeCliente: json['nomeCliente'] as String? ?? '',
        mensagem: json['mensagem'] as String? ?? '',
        referenteEvento: json['referenteEvento'] as String?,
        aprovado: json['aprovado'] as bool? ?? false,
        criadoEm: json['criadoEm'] != null
            ? DateTime.tryParse(json['criadoEm'] as String)
            : null,
      );

  Depoimento copyWith({bool? aprovado}) => Depoimento(
        id: id,
        nomeCliente: nomeCliente,
        mensagem: mensagem,
        referenteEvento: referenteEvento,
        aprovado: aprovado ?? this.aprovado,
        criadoEm: criadoEm,
      );
}
