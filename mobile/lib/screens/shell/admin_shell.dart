import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../screens/login/login_screen.dart';
import '../depoimentos/depoimentos_screen.dart';
import '../orcamentos/orcamento_list_screen.dart';

/// Shell com navegação inferior entre "Pedidos" e "Depoimentos",
/// as duas áreas do painel administrativo.
class AdminShell extends StatefulWidget {
  static const routeName = '/admin';
  const AdminShell({super.key});

  @override
  State<AdminShell> createState() => _AdminShellState();
}

class _AdminShellState extends State<AdminShell> {
  int _index = 0;

  static const _titulos = ['Pedidos', 'Depoimentos'];

  final _screens = const [
    OrcamentoListScreen(),
    DepoimentosScreen(),
  ];

  Future<void> _logout() async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sair'),
        content: const Text('Deseja encerrar a sessão?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Sair'),
          ),
        ],
      ),
    );

    if (confirmar == true && mounted) {
      await context.read<AuthProvider>().logout();
      if (mounted) {
        Navigator.of(context)
            .pushNamedAndRemoveUntil(LoginScreen.routeName, (r) => false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(_titulos[_index]),
        actions: [
          IconButton(
            tooltip: auth.usuario?.nome,
            onPressed: _logout,
            icon: const Icon(Icons.logout, size: 20),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            activeIcon: Icon(Icons.receipt_long, color: AppColors.gold),
            label: 'Pedidos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.reviews_outlined),
            activeIcon: Icon(Icons.reviews, color: AppColors.gold),
            label: 'Depoimentos',
          ),
        ],
      ),
    );
  }
}
