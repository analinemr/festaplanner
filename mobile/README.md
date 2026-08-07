# FestaPlanner Admin — App Flutter

App Flutter (Android) exclusivo para o **administrador** do FestaPlanner,
consumindo a mesma API REST do sistema web (Spring Boot).

## 1. Como integrar no seu projeto

Você já rodou `flutter create mobile` dentro do repositório (pasta `mobile/`,
irmã de `angular/` e `backend/`). Para integrar este código:

1. Copie a pasta `lib/` deste pacote **substituindo** a `lib/` gerada pelo
   `flutter create` dentro de `mobile/`.
2. Abra o `pubspec.yaml` que já existe em `mobile/` e cole o conteúdo de
   `pubspec_dependencies_SNIPPET.yaml` na seção `dependencies:` (mantenha o
   `name:`, `description:` e `environment:` que já estavam lá).
3. Rode:
   ```bash
   cd mobile
   flutter pub get
   ```

## 2. Configurando a URL do backend

Arquivo: `lib/core/network/app_config.dart`

- **Emulador Android** (padrão já configurado): usa `10.0.2.2:8080`, que
  aponta para o `localhost:8080` do seu PC — não precisa mudar nada.
- **Dispositivo físico**: mude a constante `_usandoDispositivoFisico` para
  `true` e ajuste `_devHostPhysicalDevice` para o IP da sua máquina na rede
  local (ex: `192.168.0.10`), garantindo que o celular esteja na mesma rede
  Wi-Fi e que o backend esteja escutando em `0.0.0.0` (não só `localhost`).
- Alternativa sem editar código: rode com
  ```bash
  flutter run --dart-define=API_HOST=192.168.0.10
  ```

## 3. Rodando

Com o backend Spring Boot rodando (`localhost:8080`) e um emulador
Android aberto:

```bash
cd mobile
flutter run
```

## 4. Estrutura do projeto

```
lib/
  core/
    network/        -> app_config.dart (base URL), api_client.dart (Dio + interceptor JWT)
    storage/         -> secure_storage.dart (token JWT persistido com segurança)
    theme/            -> app_theme.dart (cores/tipografia replicando o site)
  models/            -> Usuario, Orcamento (+ ClienteResumo/TemaResumo/ProdutoResumo/ItemOrcamento), Depoimento, enums
  services/          -> AuthService, OrcamentoService, DepoimentoService (chamadas HTTP)
  providers/         -> AuthProvider, OrcamentoProvider, DepoimentoProvider (estado com ChangeNotifier/Provider)
  screens/
    login/            -> LoginScreen
    shell/            -> AdminShell (bottom navigation: Pedidos / Depoimentos)
    orcamentos/        -> OrcamentoListScreen (com filtro por status), OrcamentoDetailScreen
    depoimentos/       -> DepoimentosScreen (aprovar/excluir)
  widgets/            -> StatusBadge, ErrorState/EmptyState reutilizáveis
  utils/formatters.dart -> formatação de moeda (R$) e datas pt-BR
```

## 5. O que já está pronto

- **Login**: só permite entrar se `perfil == "ADMINISTRADOR"`; token salvo
  com `flutter_secure_storage`; auto-login ao reabrir o app.
- **Lista de pedidos**: filtro por status (chips horizontais), pull-to-refresh,
  cards com tema/tipo de evento, cliente, data, convidados e valor total.
- **Detalhe do pedido**: todos os dados (contato, evento, itens, valores),
  botão **Mudar status** (bottom sheet com todos os `StatusOrcamento`) e
  botão **E-mail** que abre o app de e-mail padrão do Android com
  destinatário e assunto pré-preenchidos (`mailto:`).
- **Depoimentos**: lista com pendentes primeiro, aprovar (atualização
  otimista) e excluir (com confirmação).

## 6. Próximos passos sugeridos

- **WhatsApp**: já deixei um método comentado em
  `orcamento_detail_screen.dart` (`_abrirWhatsApp`) usando `wa.me` — é só
  descomentar e adicionar o botão quando quiser habilitar.
- **Paginação** na lista de pedidos, se o volume crescer muito.
- **Refresh token** / expiração de sessão (hoje, se o token expirar, a
  próxima chamada retorna 401 e a mensagem de erro aparece, mas o app não
  desloga automaticamente — pode-se adicionar isso no interceptor do Dio).
- Ícone do app e splash screen com a identidade visual (posso ajudar com
  isso depois, usando os pacotes `flutter_launcher_icons` e
  `flutter_native_splash`).
