import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/depoimento_provider.dart';
import 'providers/orcamento_provider.dart';
import 'screens/login/login_screen.dart';
import 'screens/shell/admin_shell.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('pt_BR', null);
  runApp(const FestaPlannerAdminApp());
}

class FestaPlannerAdminApp extends StatelessWidget {
  const FestaPlannerAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..restaurarSessao()),
        ChangeNotifierProvider(create: (_) => OrcamentoProvider()),
        ChangeNotifierProvider(create: (_) => DepoimentoProvider()),
      ],
      child: MaterialApp(
        title: 'FestaPlanner Admin',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        initialRoute: '/',
        routes: {
          '/': (_) => const _AuthGate(),
          LoginScreen.routeName: (_) => const LoginScreen(),
          AdminShell.routeName: (_) => const AdminShell(),
        },
      ),
    );
  }
}

/// Decide, ao abrir o app, se mostra o Login ou vai direto pro painel,
/// dependendo de já existir uma sessão salva (token no secure storage).
class _AuthGate extends StatelessWidget {
  const _AuthGate();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    switch (auth.status) {
      case AuthStatus.desconhecido:
        return const Scaffold(
          backgroundColor: AppColors.offWhite,
          body: Center(child: CircularProgressIndicator()),
        );
      case AuthStatus.autenticado:
        return const AdminShell();
      case AuthStatus.naoAutenticado:
        return const LoginScreen();
    }
  }
}
