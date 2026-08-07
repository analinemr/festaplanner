import 'enums.dart';

class ClienteResumo {
  final int id;
  final String nome;
  final String email;

  ClienteResumo({required this.id, required this.nome, required this.email});

  factory ClienteResumo.fromJson(Map<String, dynamic> json) => ClienteResumo(
        id: json['id'] as int,
        nome: json['nome'] as String? ?? '',
        email: json['email'] as String? ?? '',
      );
}

class TemaResumo {
  final int id;
  final String nome;
  final double valor;

  TemaResumo({required this.id, required this.nome, required this.valor});

  factory TemaResumo.fromJson(Map<String, dynamic> json) => TemaResumo(
        id: json['id'] as int,
        nome: json['nome'] as String? ?? '',
        valor: (json['valor'] as num?)?.toDouble() ?? 0,
      );
}

class ProdutoResumo {
  final int id;
  final String nome;
  final String categoria;
  final double valor;

  ProdutoResumo({
    required this.id,
    required this.nome,
    required this.categoria,
    required this.valor,
  });

  factory ProdutoResumo.fromJson(Map<String, dynamic> json) => ProdutoResumo(
        id: json['id'] as int,
        nome: json['nome'] as String? ?? '',
        categoria: json['categoria'] as String? ?? '',
        valor: (json['valor'] as num?)?.toDouble() ?? 0,
      );
}

class ItemOrcamento {
  final int id;
  final ProdutoResumo produto;
  final int quantidade;
  final double valorUnitario;
  final double subtotal;

  ItemOrcamento({
    required this.id,
    required this.produto,
    required this.quantidade,
    required this.valorUnitario,
    required this.subtotal,
  });

  factory ItemOrcamento.fromJson(Map<String, dynamic> json) => ItemOrcamento(
        id: json['id'] as int,
        produto: ProdutoResumo.fromJson(
            json['produto'] as Map<String, dynamic>),
        quantidade: json['quantidade'] as int? ?? 1,
        valorUnitario: (json['valorUnitario'] as num?)?.toDouble() ?? 0,
        subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0,
      );
}

class Orcamento {
  final int id;
  final ClienteResumo cliente;
  final TipoEvento tipoEvento;
  final TemaResumo? tema;
  final int numeroConvidados;
  final DateTime? dataEvento;
  final StatusOrcamento status;
  final List<ItemOrcamento> itens;
  final double subtotal;
  final double taxaServicoPercentual;
  final double totalEstimado;
  final String nomeContato;
  final String emailContato;
  final String? whatsappContato;
  final String? melhorHorarioContato;
  final String? observacoes;
  final DateTime? criadoEm;
  final DateTime? atualizadoEm;

  Orcamento({
    required this.id,
    required this.cliente,
    required this.tipoEvento,
    required this.tema,
    required this.numeroConvidados,
    required this.dataEvento,
    required this.status,
    required this.itens,
    required this.subtotal,
    required this.taxaServicoPercentual,
    required this.totalEstimado,
    required this.nomeContato,
    required this.emailContato,
    required this.whatsappContato,
    required this.melhorHorarioContato,
    required this.observacoes,
    required this.criadoEm,
    required this.atualizadoEm,
  });

  factory Orcamento.fromJson(Map<String, dynamic> json) {
    return Orcamento(
      id: json['id'] as int,
      cliente:
          ClienteResumo.fromJson(json['cliente'] as Map<String, dynamic>),
      tipoEvento: TipoEvento.fromApi(json['tipoEvento'] as String),
      tema: json['tema'] != null
          ? TemaResumo.fromJson(json['tema'] as Map<String, dynamic>)
          : null,
      numeroConvidados: json['numeroConvidados'] as int? ?? 0,
      dataEvento: json['dataEvento'] != null
          ? DateTime.tryParse(json['dataEvento'] as String)
          : null,
      status: StatusOrcamento.fromApi(json['status'] as String),
      itens: (json['itens'] as List<dynamic>? ?? [])
          .map((e) => ItemOrcamento.fromJson(e as Map<String, dynamic>))
          .toList(),
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0,
      taxaServicoPercentual:
          (json['taxaServicoPercentual'] as num?)?.toDouble() ?? 0,
      totalEstimado: (json['totalEstimado'] as num?)?.toDouble() ?? 0,
      nomeContato: json['nomeContato'] as String? ?? '',
      emailContato: json['emailContato'] as String? ?? '',
      whatsappContato: json['whatsappContato'] as String?,
      melhorHorarioContato: json['melhorHorarioContato'] as String?,
      observacoes: json['observacoes'] as String?,
      criadoEm: json['criadoEm'] != null
          ? DateTime.tryParse(json['criadoEm'] as String)
          : null,
      atualizadoEm: json['atualizadoEm'] != null
          ? DateTime.tryParse(json['atualizadoEm'] as String)
          : null,
    );
  }
}
