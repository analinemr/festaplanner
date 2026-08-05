# Festa Planner — Backend (Spring Boot)

Backend em **Java + Spring Boot** para a plataforma Festa Planner, cobrindo as telas que você mostrou:
Home/Wizard de orçamento (cliente) e Painel/Pedidos/Agenda/Catálogo (administrador).

## Stack
- Java 17
- Spring Boot 3.3 (Web, Data JPA, Security, Validation)
- JWT (jjwt) para autenticação stateless
- H2 em memória por padrão (troque para MySQL em `application.properties` quando for para produção)
- Lombok

## Como rodar
```bash
mvn spring-boot:run
```
A API sobe em `http://localhost:8080`. O console do H2 fica em `/h2-console` (JDBC URL: `jdbc:h2:mem:festaplanner`).

Ao iniciar, um `DataSeeder` cria usuários e dados de teste:
- **Admin**: admin@festaplanner.com / admin123
- **Cliente**: cliente@teste.com / cliente123

(Remova ou proteja o `DataSeeder` com `@Profile("dev")` antes de ir para produção.)

## Autenticação
Todas as rotas privadas usam JWT no header:
```
Authorization: Bearer <token>
```
Obtenha o token em `POST /api/auth/login` ou `POST /api/auth/registro`.

Login social (Google/Microsoft/Apple), citado no pré-projeto, tem os endpoints marcados como `TODO` em
`AuthController` — a implementação típica valida o `id_token` do provedor no backend e depois localiza/cria
o `Usuario` com o campo `provedorLogin` correspondente.

## Endpoints principais

### Público (sem login) — navegação como no `home.png`
- `GET /api/temas?tipoEvento=CASAMENTO` — temas por tipo de evento
- `GET /api/temas/{id}/subtemas` — subtemas (ex.: Casamento → Vintage)
- `GET /api/produtos?categoria=BUFFET` — catálogo de produtos/serviços

### Cliente autenticado — wizard de orçamento (`orçamento1.png` a `orçamento4.png`)
- `POST /api/orcamentos` — Etapa 01 (tipo de evento, convidados, data)
- `PUT /api/orcamentos/{id}/tema/{temaId}` — Etapa 02
- `POST /api/orcamentos/{id}/itens` — Etapa 03 (adicionar/atualizar item)
- `DELETE /api/orcamentos/{id}/itens/{itemId}` — remover item (bloqueado se obrigatório)
- `POST /api/orcamentos/{id}/salvar-rascunho` — botão "Salvar rascunho"
- `POST /api/orcamentos/{id}/enviar` — Etapa 04, envia o pedido
- `GET /api/orcamentos/meus` — "Meus Orçamentos"

### Administrador (`adm1..5.png`) — exige perfil ADMINISTRADOR
- `GET /api/admin/painel/resumo` — cards do Painel (novos pedidos, receita, confirmados...)
- `GET /api/admin/pedidos?status=NOVO` — tela Pedidos
- `PUT /api/admin/pedidos/{id}/status` — ações ✓ / ✗ (aprovar, mover para pré-reserva, confirmar, recusar)
- `GET /api/admin/agenda?ano=2026&mes=10` — tela Agenda
- `POST /api/admin/agenda/bloquear` / `POST /api/admin/agenda/liberar`
- `POST /api/produtos`, `PUT /api/produtos/{id}`, `DELETE /api/produtos/{id}` — Catálogo/Novo Produto

## Regras de negócio já implementadas
- Itens marcados como **obrigatórios** entram automaticamente no orçamento e **não podem ser removidos**
  (`OrcamentoService.removerItem`), como descrito no pré-projeto.
- O total do orçamento é recalculado em tempo real (`Orcamento.recalcularTotais`) somando tema + itens + taxa
  de serviço — igual ao "Total Estimado" que aparece na barra lateral das telas de orçamento.
- Ao mover um pedido para **PRE_RESERVA** ou **CONFIRMADO**, a data correspondente é automaticamente
  sincronizada na Agenda.

## Próximos passos sugeridos
1. Trocar H2 por MySQL em produção (bloco já deixado comentado em `application.properties`).
2. Implementar upload de imagens (produtos/temas) — hoje `imagemUrl` é só um campo texto.
3. Implementar notificações (o pré-projeto menciona notificação mobile ao ADM quando chega um pedido) —
   um bom ponto de partida é publicar um evento Spring (`ApplicationEventPublisher`) em
   `OrcamentoService.enviar()` e ter um listener que dispare push/e-mail.
4. Endpoint de mensagens (tela "Mensagens" do menu) — ainda não modelado.
5. Testes automatizados (não incluídos neste scaffold inicial).
