// Teste de smoke básico do FestaPlanner Admin.
//
// Como o app decide entre Login e Painel dependendo de haver uma sessão
// salva (via flutter_secure_storage), e não há storage real disponível em
// ambiente de teste, o app deve cair no estado "não autenticado" e mostrar
// a tela de Login.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/main.dart';

void main() {
  testWidgets('App mostra a tela de Login ao iniciar', (WidgetTester tester) async {
    await tester.pumpWidget(const FestaPlannerAdminApp());

    // Enquanto restaurarSessao() ainda não resolveu, mostra o loading.
    await tester.pump();

    // Aguarda a resolução do restaurarSessao() (leitura do secure storage)
    // e a troca para a tela de Login.
    await tester.pumpAndSettle();

    expect(find.text('FestaPlanner'), findsOneWidget);
    expect(find.text('Painel do Administrador'), findsOneWidget);
    expect(find.byType(TextFormField), findsNWidgets(2)); // e-mail + senha
    expect(find.widgetWithText(ElevatedButton, 'ENTRAR'), findsOneWidget);
  });
}