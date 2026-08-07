import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme/app_theme.dart';
import '../../models/enums.dart';
import '../../models/orcamento.dart';
import '../../providers/orcamento_provider.dart';
import '../../utils/formatters.dart';
import '../../widgets/error_state.dart';
import '../../widgets/status_badge.dart';

class OrcamentoDetailScreen extends StatefulWidget {
  final int orcamentoId;
  const OrcamentoDetailScreen({super.key, required this.orcamentoId});

  @override
  State<OrcamentoDetailScreen> createState() => _OrcamentoDetailScreenState();
}

class _OrcamentoDetailScreenState extends State<OrcamentoDetailScreen> {
  Orcamento? _orcamento;
  bool _loading = true;
  String? _erro;
  bool _atualizandoStatus = false;

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    setState(() {
      _loading = true;
      _erro = null;
    });

    final provider = context.read<OrcamentoProvider>();
    final orcamento = await provider.buscarDetalhe(widget.orcamentoId);

    if (!mounted) return;
    setState(() {
      _orcamento = orcamento;
      _erro = orcamento == null ? (provider.erro ?? 'Erro ao carregar pedido.') : null;
      _loading = false;
    });
  }

  Future<void> _mudarStatus(StatusOrcamento novoStatus) async {
    if (_orcamento == null) return;
    setState(() => _atualizandoStatus = true);

    try {
      final atualizado = await context
          .read<OrcamentoProvider>()
          .atualizarStatus(_orcamento!.id, novoStatus);
      if (!mounted) return;
      setState(() => _orcamento = atualizado);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Status atualizado para "${novoStatus.label}".')),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Não foi possível atualizar o status.')),
      );
    } finally {
      if (mounted) setState(() => _atualizandoStatus = false);
    }
  }

  Future<void> _abrirEmail() async {
    final o = _orcamento;
    if (o == null) return;

    final assunto = Uri.encodeComponent(
        'FestaPlanner — Pedido #${o.id} (${o.tema?.nome ?? o.tipoEvento.label})');
    final corpo = Uri.encodeComponent('Olá, ${o.nomeContato}!\n\n');

    final uri = Uri.parse(
        'mailto:${o.emailContato}?subject=$assunto&body=$corpo');

    final ok = await canLaunchUrl(uri);
    if (ok) {
      await launchUrl(uri);
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Nenhum app de e-mail encontrado no dispositivo.')),
      );
    }
  }

  // Placeholder para integração futura com WhatsApp (wa.me):
  // Future<void> _abrirWhatsApp() async {
  //   final numero = _orcamento?.whatsappContato?.replaceAll(RegExp(r'\D'), '');
  //   if (numero == null || numero.isEmpty) return;
  //   final uri = Uri.parse('https://wa.me/55$numero');
  //   if (await canLaunchUrl(uri)) await launchUrl(uri, mode: LaunchMode.externalApplication);
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_orcamento != null ? 'Pedido #${_orcamento!.id}' : 'Pedido'),
      ),
      body: _buildBody(),
      bottomNavigationBar: _orcamento == null
          ? null
          : SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: _abrirEmail,
                        icon: const Icon(Icons.mail_outline, size: 18),
                        label: const Text('E-mail'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        onPressed: _atualizandoStatus
                            ? null
                            : () => _abrirSeletorStatus(context),
                        icon: _atualizandoStatus
                            ? const SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Icon(Icons.sync_alt, size: 18),
                        label: const Text('Mudar status'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_erro != null) {
      return ErrorState(message: _erro!, onRetry: _carregar);
    }

    final o = _orcamento!;

    return RefreshIndicator(
      onRefresh: _carregar,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  o.tema?.nome ?? o.tipoEvento.label,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              StatusBadge(status: o.status),
            ],
          ),
          const SizedBox(height: 4),
          Text(o.tipoEvento.label,
              style: const TextStyle(color: Colors.black54)),
          const SizedBox(height: 20),

          _SectionCard(
            title: 'Contato',
            children: [
              _InfoRow(icon: Icons.person_outline, label: o.nomeContato),
              _InfoRow(icon: Icons.mail_outline, label: o.emailContato),
              if (o.whatsappContato != null && o.whatsappContato!.isNotEmpty)
                _InfoRow(icon: Icons.chat_outlined, label: o.whatsappContato!),
              if (o.melhorHorarioContato != null &&
                  o.melhorHorarioContato!.isNotEmpty)
                _InfoRow(
                  icon: Icons.schedule_outlined,
                  label: 'Melhor horário: ${o.melhorHorarioContato}',
                ),
            ],
          ),
          const SizedBox(height: 14),

          _SectionCard(
            title: 'Evento',
            children: [
              _InfoRow(
                icon: Icons.event_outlined,
                label: 'Data: ${Formatters.date(o.dataEvento)}',
              ),
              _InfoRow(
                icon: Icons.groups_outlined,
                label: '${o.numeroConvidados} convidados',
              ),
              if (o.observacoes != null && o.observacoes!.trim().isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    o.observacoes!,
                    style: const TextStyle(color: Colors.black87, height: 1.4),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 14),

          _SectionCard(
            title: 'Itens',
            children: [
              ...o.itens.map(
                (item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.produto.nome,
                                style: const TextStyle(fontWeight: FontWeight.w600)),
                            Text(
                              '${item.quantidade}x  •  ${item.produto.categoria}',
                              style: const TextStyle(
                                  fontSize: 12.5, color: Colors.black54),
                            ),
                          ],
                        ),
                      ),
                      Text(Formatters.currency(item.subtotal)),
                    ],
                  ),
                ),
              ),
              const Divider(height: 22),
              _ValorRow(label: 'Subtotal', value: o.subtotal),
              _ValorRow(
                label: 'Taxa de serviço (${o.taxaServicoPercentual.toStringAsFixed(0)}%)',
                value: o.totalEstimado - o.subtotal,
              ),
              const SizedBox(height: 6),
              _ValorRow(
                label: 'Total estimado',
                value: o.totalEstimado,
                destaque: true,
              ),
            ],
          ),
          const SizedBox(height: 14),

          Text(
            'Criado em ${Formatters.dateTime(o.criadoEm)}'
            '${o.atualizadoEm != null ? ' • Atualizado em ${Formatters.dateTime(o.atualizadoEm)}' : ''}',
            style: const TextStyle(fontSize: 11.5, color: Colors.black38),
          ),
          const SizedBox(height: 90),
        ],
      ),
    );
  }

  void _abrirSeletorStatus(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  child: Text('Mudar status do pedido',
                      style: Theme.of(context).textTheme.titleLarge),
                ),
                const Divider(height: 1),
                ...StatusOrcamento.values.map(
                  (s) => ListTile(
                    leading: Container(
                      width: 12,
                      height: 12,
                      decoration:
                          BoxDecoration(color: s.color, shape: BoxShape.circle),
                    ),
                    title: Text(s.label),
                    trailing: _orcamento?.status == s
                        ? const Icon(Icons.check, color: AppColors.gold)
                        : null,
                    onTap: () {
                      Navigator.pop(ctx);
                      if (_orcamento?.status != s) _mudarStatus(s);
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _SectionCard({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontSize: 16, color: AppColors.gold)),
            const SizedBox(height: 10),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  const _InfoRow({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 17, color: Colors.black45),
          const SizedBox(width: 8),
          Expanded(child: Text(label)),
        ],
      ),
    );
  }
}

class _ValorRow extends StatelessWidget {
  final String label;
  final double value;
  final bool destaque;
  const _ValorRow(
      {required this.label, required this.value, this.destaque = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontWeight: destaque ? FontWeight.w700 : FontWeight.w400,
                fontSize: destaque ? 15 : 13.5,
                color: destaque ? AppColors.charcoal : Colors.black54,
              ),
            ),
          ),
          Text(
            Formatters.currency(value),
            style: TextStyle(
              fontWeight: destaque ? FontWeight.w700 : FontWeight.w500,
              fontSize: destaque ? 16 : 13.5,
              color: destaque ? AppColors.charcoal : Colors.black87,
            ),
          ),
        ],
      ),
    );
  }
}
