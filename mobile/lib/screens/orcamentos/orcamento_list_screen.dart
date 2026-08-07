import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../models/enums.dart';
import '../../models/orcamento.dart';
import '../../providers/orcamento_provider.dart';
import '../../utils/formatters.dart';
import '../../widgets/error_state.dart';
import '../../widgets/status_badge.dart';
import 'orcamento_detail_screen.dart';

class OrcamentoListScreen extends StatefulWidget {
  const OrcamentoListScreen({super.key});

  @override
  State<OrcamentoListScreen> createState() => _OrcamentoListScreenState();
}

class _OrcamentoListScreenState extends State<OrcamentoListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrcamentoProvider>().carregar();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<OrcamentoProvider>();

    return Column(
      children: [
        _FiltroStatusBar(
          selecionado: provider.filtroStatus,
          onChanged: (status) => provider.aplicarFiltro(status),
        ),
        const Divider(height: 1),
        Expanded(child: _buildBody(context, provider)),
      ],
    );
  }

  Widget _buildBody(BuildContext context, OrcamentoProvider provider) {
    if (provider.loading && provider.orcamentos.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (provider.erro != null && provider.orcamentos.isEmpty) {
      return ErrorState(
        message: provider.erro!,
        onRetry: () => provider.carregar(status: provider.filtroStatus),
      );
    }

    if (provider.orcamentos.isEmpty) {
      return const EmptyState(
        message: 'Nenhum pedido encontrado para este filtro.',
        icon: Icons.receipt_long_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: () => provider.carregar(status: provider.filtroStatus),
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: provider.orcamentos.length,
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemBuilder: (context, index) {
          final orcamento = provider.orcamentos[index];
          return _OrcamentoCard(orcamento: orcamento);
        },
      ),
    );
  }
}

class _FiltroStatusBar extends StatelessWidget {
  final StatusOrcamento? selecionado;
  final ValueChanged<StatusOrcamento?> onChanged;

  const _FiltroStatusBar({required this.selecionado, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 52,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          _chip(context, label: 'Todos', selected: selecionado == null,
              onTap: () => onChanged(null)),
          const SizedBox(width: 8),
          ...statusFiltraveis.map(
            (s) => Padding(
              padding: const EdgeInsets.only(right: 8),
              child: _chip(
                context,
                label: s.label,
                selected: selecionado == s,
                onTap: () => onChanged(s),
                color: s.color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _chip(
    BuildContext context, {
    required String label,
    required bool selected,
    required VoidCallback onTap,
    Color? color,
  }) {
    final c = color ?? AppColors.charcoal;
    return ChoiceChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onTap(),
      backgroundColor: Colors.white,
      selectedColor: c.withOpacity(0.14),
      labelStyle: TextStyle(
        color: selected ? c : Colors.black54,
        fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
        fontSize: 13,
      ),
      side: BorderSide(color: selected ? c.withOpacity(0.5) : Colors.black12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    );
  }
}

class _OrcamentoCard extends StatelessWidget {
  final Orcamento orcamento;
  const _OrcamentoCard({required this.orcamento});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => OrcamentoDetailScreen(orcamentoId: orcamento.id),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      orcamento.tema?.nome ?? orcamento.tipoEvento.label,
                      style: Theme.of(context)
                          .textTheme
                          .titleLarge
                          ?.copyWith(fontSize: 18),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  StatusBadge(status: orcamento.status),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                orcamento.cliente.nome,
                style: Theme.of(context)
                    .textTheme
                    .bodyMedium
                    ?.copyWith(color: Colors.black54),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.event_outlined,
                      size: 15, color: Colors.black45),
                  const SizedBox(width: 4),
                  Text(
                    Formatters.date(orcamento.dataEvento),
                    style: const TextStyle(fontSize: 12.5, color: Colors.black54),
                  ),
                  const SizedBox(width: 14),
                  const Icon(Icons.groups_outlined,
                      size: 15, color: Colors.black45),
                  const SizedBox(width: 4),
                  Text(
                    '${orcamento.numeroConvidados} convidados',
                    style: const TextStyle(fontSize: 12.5, color: Colors.black54),
                  ),
                  const Spacer(),
                  Text(
                    Formatters.currency(orcamento.totalEstimado),
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      color: AppColors.charcoal,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
