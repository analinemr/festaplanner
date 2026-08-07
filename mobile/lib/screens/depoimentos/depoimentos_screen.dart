import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../models/depoimento.dart';
import '../../providers/depoimento_provider.dart';
import '../../utils/formatters.dart';
import '../../widgets/error_state.dart';

class DepoimentosScreen extends StatefulWidget {
  const DepoimentosScreen({super.key});

  @override
  State<DepoimentosScreen> createState() => _DepoimentosScreenState();
}

class _DepoimentosScreenState extends State<DepoimentosScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DepoimentoProvider>().carregar();
    });
  }

  Future<void> _aprovar(Depoimento d) async {
    try {
      await context.read<DepoimentoProvider>().aprovar(d.id);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Não foi possível aprovar o depoimento.')),
        );
      }
    }
  }

  Future<void> _excluir(Depoimento d) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Excluir depoimento'),
        content: Text(
            'Tem certeza que deseja excluir o depoimento de "${d.nomeCliente}"? Esta ação não pode ser desfeita.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancelar')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Excluir',
                style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );

    if (confirmar != true) return;
    if (!mounted) return;

    try {
      await context.read<DepoimentoProvider>().excluir(d.id);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Não foi possível excluir o depoimento.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<DepoimentoProvider>();

    if (provider.loading && provider.depoimentos.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (provider.erro != null && provider.depoimentos.isEmpty) {
      return ErrorState(
        message: provider.erro!,
        onRetry: () => provider.carregar(),
      );
    }

    if (provider.depoimentos.isEmpty) {
      return const EmptyState(
        message: 'Nenhum depoimento enviado ainda.',
        icon: Icons.reviews_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: () => provider.carregar(),
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: provider.depoimentos.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, index) {
          final d = provider.depoimentos[index];
          return _DepoimentoCard(
            depoimento: d,
            onAprovar: () => _aprovar(d),
            onExcluir: () => _excluir(d),
          );
        },
      ),
    );
  }
}

class _DepoimentoCard extends StatelessWidget {
  final Depoimento depoimento;
  final VoidCallback onAprovar;
  final VoidCallback onExcluir;

  const _DepoimentoCard({
    required this.depoimento,
    required this.onAprovar,
    required this.onExcluir,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    depoimento.nomeCliente,
                    style: Theme.of(context)
                        .textTheme
                        .titleLarge
                        ?.copyWith(fontSize: 17),
                  ),
                ),
                _AprovadoBadge(aprovado: depoimento.aprovado),
              ],
            ),
            if (depoimento.referenteEvento != null &&
                depoimento.referenteEvento!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Text(
                  depoimento.referenteEvento!,
                  style: const TextStyle(color: Colors.black54, fontSize: 12.5),
                ),
              ),
            const SizedBox(height: 10),
            Text(
              depoimento.mensagem,
              style: const TextStyle(height: 1.4),
            ),
            const SizedBox(height: 8),
            Text(
              Formatters.dateTime(depoimento.criadoEm),
              style: const TextStyle(fontSize: 11, color: Colors.black38),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                if (!depoimento.aprovado)
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onAprovar,
                      icon: const Icon(Icons.check, size: 17, color: AppColors.success),
                      label: const Text('Aprovar',
                          style: TextStyle(color: AppColors.success)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.success),
                      ),
                    ),
                  ),
                if (!depoimento.aprovado) const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onExcluir,
                    icon: const Icon(Icons.delete_outline,
                        size: 17, color: AppColors.error),
                    label: const Text('Excluir',
                        style: TextStyle(color: AppColors.error)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.error),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _AprovadoBadge extends StatelessWidget {
  final bool aprovado;
  const _AprovadoBadge({required this.aprovado});

  @override
  Widget build(BuildContext context) {
    final color = aprovado ? AppColors.success : AppColors.statusPendente;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        aprovado ? 'Aprovado' : 'Pendente',
        style: TextStyle(
            color: color, fontWeight: FontWeight.w600, fontSize: 12),
      ),
    );
  }
}
