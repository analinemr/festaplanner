import {
  Component, OnInit, AfterViewInit,
  ViewChild, ElementRef, ViewEncapsulation, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { CatalogoApiService, ApiProduto, ProdutoRequest } from '../../core/services/catalogo-api.service';
import { OrcamentoApiService, ApiOrcamento } from '../../core/services/orcamento-api.service';
import { UsuarioApiService, UsuarioResponse } from '../../core/services/usuario-api.service';
import { DepoimentoApiService, DepoimentoResponse } from '../../core/services/depoimento-api.service';

/**
 * Formulário de cadastro/edição — espelha ProdutoRequest, com `id` extra para saber se é edição.
 * A imagem NÃO fica aqui: fica em `imagemUrlAtual` (signal), porque é alterada dentro de
 * upload assíncrono e precisa notificar a view corretamente no modo zoneless.
 */
interface ProdutoFormState {
  id: number | null;
  nome: string;
  categoria: string;
  tipoItem: 'OBRIGATORIO' | 'OPCIONAL';
  valor: number;
  unidadeMedida: string;
  quantidadeMinima: number | null;
  descricao: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit, AfterViewInit {

  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;

  // ---- ESTADO GERAL ----
  painelAtivo  = 'dashboard';
  tituloPainel = 'Painel';
  dataAtual    = '';
  anoAtual     = new Date().getFullYear();
  termoBusca   = '';
  nomeUsuario  = 'Administrador';
  inicialUsuario = 'A';

  bgUrl(url: string): string { return `url('${url}')`; }

  // ==================== PEDIDOS (real, conectado ao backend) ====================

  /**
   * Convertidos para signal() pelo mesmo motivo do Catálogo: são alterados
   * dentro de chamadas assíncronas (HTTP) e precisam notificar a view no modo zoneless.
   */
  pedidos = signal<ApiOrcamento[]>([]);
  carregandoPedidos = signal(false);
  erroPedidos = signal('');

  /** Filtro de status ativo na tela de Pedidos. '' = todos (exceto rascunho). */
  filtroStatusAtivo = '';

  /** Rótulo em pt-BR de cada status do backend (StatusOrcamento). */
  readonly statusLabel: Record<string, string> = {
    RASCUNHO: 'Rascunho',
    NOVO: 'Novo',
    PENDENTE: 'Pendente',
    PRE_RESERVA: 'Pré-Reserva',
    CONFIRMADO: 'Confirmado',
    RECUSADO: 'Rejeitado'
  };

  /** Classe CSS (já existente no template) para cada status. */
  readonly statusCssClass: Record<string, string> = {
    RASCUNHO: 'pending',
    NOVO: 'new',
    PENDENTE: 'pending',
    PRE_RESERVA: 'prereserva',
    CONFIRMADO: 'confirmed',
    RECUSADO: 'rejected'
  };

  /** Rótulo em pt-BR de cada tipo de evento (TipoEvento). */
  readonly tipoEventoLabel: Record<string, string> = {
    CASAMENTO: 'Casamento',
    QUINZE_ANOS: '15 Anos',
    INFANTIL: 'Infantil',
    FLORAL: 'Floral',
    TEMATICO: 'Temático',
    CORPORATIVO: 'Corporativo'
  };

  /** Cor de cada tipo de evento no gráfico donut do Painel. */
  readonly tipoEventoCor: Record<string, string> = {
    CASAMENTO: '#2D2D2D',
    QUINZE_ANOS: '#C9A96E',
    INFANTIL: '#9CA3AF',
    TEMATICO: '#E5E7EB',
    FLORAL: '#F59E0B',
    CORPORATIVO: '#6B7280'
  };

  labelStatus(status: string): string {
    return this.statusLabel[status] ?? status;
  }

  labelTipoEvento(tipo: string): string {
    return this.tipoEventoLabel[tipo] ?? tipo;
  }

  /** Converte 'YYYY-MM-DD' (formato do backend) para 'DD/MM/YYYY'. */
  formatarData(iso?: string): string {
    if (!iso) return '—';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private formatarMoedaResumida(valor: number): string {
    return 'R$ ' + Math.round(valor).toLocaleString('pt-BR');
  }

  // ==================== PAINEL — KPIs e gráficos (calculados a partir de pedidos()) ====================

  /** Os 4 cards do topo do Painel, calculados em cima dos pedidos já carregados. */
  get kpis(): { cor: string; valor: string; label: string }[] {
    const todos = this.pedidos();
    const novos = todos.filter(p => p.status === 'NOVO').length;
    const emNegociacao = todos.filter(p => p.status === 'PENDENTE' || p.status === 'PRE_RESERVA').length;
    const confirmados = todos.filter(p => p.status === 'CONFIRMADO');

    const hoje = new Date();
    const receitaMes = confirmados
      .filter(p => {
        if (!p.dataEvento) return false;
        const [ano, mes] = p.dataEvento.split('-').map(Number);
        return ano === hoje.getFullYear() && mes === hoje.getMonth() + 1;
      })
      .reduce((soma, p) => soma + p.totalEstimado, 0);

    return [
      { cor: 'green',  valor: String(novos),                        label: 'Novos Pedidos' },
      { cor: 'yellow', valor: String(emNegociacao),                  label: 'Em Negociação' },
      { cor: 'blue',   valor: this.formatarMoedaResumida(receitaMes), label: 'Receita do Mês' },
      { cor: 'silver', valor: String(confirmados.length),            label: 'Eventos Confirmados' }
    ];
  }

  /** Receita mensal (eventos CONFIRMADOS no ano corrente), para o gráfico de barras. */
  get chartData(): { m: string; v: number; pct: number }[] {
    const mesesAbrev = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const valoresPorMes = new Array(12).fill(0);

    for (const p of this.pedidos()) {
      if (p.status !== 'CONFIRMADO' || !p.dataEvento) continue;
      const [ano, mes] = p.dataEvento.split('-').map(Number);
      if (ano !== this.anoAtual) continue;
      valoresPorMes[mes - 1] += p.totalEstimado;
    }

    const max = Math.max(...valoresPorMes, 1);
    return mesesAbrev.map((m, i) => ({
      m,
      v: valoresPorMes[i],
      pct: valoresPorMes[i] ? (valoresPorMes[i] / max) * 100 : 2
    }));
  }

  /** Distribuição percentual por tipo de evento (exclui rascunho/recusado), para o donut. */
  get donutData(): { label: string; val: number; color: string }[] {
    const relevantes = this.pedidos().filter(p => p.status !== 'RECUSADO');
    const total = relevantes.length;
    if (total === 0) return [];

    const contagem: Record<string, number> = {};
    for (const p of relevantes) {
      contagem[p.tipoEvento] = (contagem[p.tipoEvento] ?? 0) + 1;
    }

    return Object.entries(contagem).map(([tipo, qtd]) => ({
      label: this.labelTipoEvento(tipo),
      val: Math.round((qtd / total) * 100),
      color: this.tipoEventoCor[tipo] ?? '#9CA3AF'
    }));
  }

  /** Lista já filtrada — getter reativo sobre o signal pedidos(). */
  get pedidosFiltrados(): ApiOrcamento[] {
    let resultado = this.pedidos();

    if (this.filtroStatusAtivo) {
      resultado = resultado.filter(p => p.status === this.filtroStatusAtivo);
    }

    const termo = this.termoBusca.trim().toLowerCase();
    if (termo) {
      resultado = resultado.filter(p =>
        (p.nomeContato ?? '').toLowerCase().includes(termo) ||
        this.labelTipoEvento(p.tipoEvento).toLowerCase().includes(termo)
      );
    }

    return resultado;
  }

  get pedidosRecentes(): ApiOrcamento[] { return this.pedidos().slice(0, 3); }
  get totalNovos(): number { return this.pedidos().filter(p => p.status === 'NOVO' || p.status === 'PENDENTE').length; }

  // ---- MODAL ----
  modalAberto = false;
  pedidoModal: ApiOrcamento | null = null;

  // ---- CALENDÁRIO ----
  diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  calYear = 2026; calMonth = 9;

  get mesLabel(): string { return `${this.meses[this.calMonth]} ${this.calYear}`; }

  /** Mapeia dia -> classe CSS ('confirmed'/'prereserva') a partir dos pedidos reais daquele mês/ano. */
  private eventosPorDia(ano: number, mesIndex: number): Record<number, string> {
    const mapa: Record<number, string> = {};
    for (const p of this.pedidos()) {
      if (!p.dataEvento) continue;
      if (p.status !== 'CONFIRMADO' && p.status !== 'PRE_RESERVA') continue;
      const [anoP, mesP, diaP] = p.dataEvento.split('-').map(Number);
      if (anoP === ano && mesP === mesIndex + 1) {
        mapa[diaP] = p.status === 'CONFIRMADO' ? 'confirmed' : 'prereserva';
      }
    }
    return mapa;
  }

  cellsMini: { num: string; cls: string }[] = [];

  // ==================== CATÁLOGO (real, conectado ao backend) ====================

  /**
   * Convertidos para signal() porque o app roda em modo zoneless (Angular 21):
   * são alterados dentro de chamadas assíncronas (HTTP, setTimeout), que não
   * disparam re-renderização automática se forem propriedades comuns.
   */
  produtosCatalogo = signal<ApiProduto[]>([]);
  carregandoCatalogo = signal(false);
  erroCatalogo = signal('');

  salvandoProduto = signal(false);
  erroSalvarProduto = signal('');
  prodSalvo = signal(false);

  /** Imagem atual do formulário (upload em andamento, já enviada, ou URL colada manualmente). */
  imagemUrlAtual = signal('');
  enviandoImagem = signal(false);
  erroUpload = signal('');

  /** Categorias reais do backend (enum CategoriaProduto), com rótulo em pt-BR para exibição. */
  readonly categoriasProduto: { valor: string; label: string }[] = [
    { valor: 'BUFFET',     label: 'Buffet' },
    { valor: 'BOLO',       label: 'Bolo / Confeitaria' },
    { valor: 'DOCES',      label: 'Doces' },
    { valor: 'SALGADOS',   label: 'Salgados' },
    { valor: 'BEBIDAS',    label: 'Bebidas' },
    { valor: 'DECORACAO',  label: 'Decoração' },
    { valor: 'MUSICA',     label: 'Música' },
    { valor: 'ANIMACAO',   label: 'Animação' },
    { valor: 'FOTOGRAFIA', label: 'Fotografia' },
    { valor: 'MOBILIARIO', label: 'Mobiliário' }
  ];

  /** Filtro ativo na grade do catálogo. '' = Todos. */
  filtroCatAtivo = '';

  /** Lista já filtrada pela categoria ativa — getter reativo sobre o signal produtosCatalogo. */
  get produtosFiltrados(): ApiProduto[] {
    return this.filtroCatAtivo
      ? this.produtosCatalogo().filter(p => p.categoria === this.filtroCatAtivo)
      : this.produtosCatalogo();
  }

  /** Rótulo em pt-BR de uma categoria, para exibir nos cards. */
  labelCategoria(categoria: string): string {
    return this.categoriasProduto.find(c => c.valor === categoria)?.label ?? categoria;
  }

  // ---- CADASTRO / EDIÇÃO ----
  novoProd: ProdutoFormState = this.formVazio();

  private formVazio(): ProdutoFormState {
    return {
      id: null,
      nome: '',
      categoria: 'BUFFET',
      tipoItem: 'OPCIONAL',
      valor: 0,
      unidadeMedida: '',
      quantidadeMinima: null,
      descricao: ''
    };
  }

  get editando(): boolean {
    return this.novoProd.id !== null;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private catalogoApi: CatalogoApiService,
    private orcamentoApi: OrcamentoApiService,
    private usuarioApi: UsuarioApiService,
    private depoimentoApi: DepoimentoApiService
  ) {}

  ngOnInit(): void {
    // Data
    const d = new Date();
    this.dataAtual = d.toLocaleDateString('pt-BR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    // Usuário
    const u = this.authService.getUsuario();
    if (u?.nome) { this.nomeUsuario = u.nome; this.inicialUsuario = u.nome[0].toUpperCase(); }

    // Init dados mock (Agenda/Gráficos — próximas etapas do backend)
    this.gerarCalendario();

    // Dados reais
    this.carregarCatalogo();
    this.carregarPedidos();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.desenharDonut(), 200);
  }

  // ---- NAVEGAÇÃO ----
  showPanel(id: string): void {
    this.painelAtivo = id;
    const titulos: Record<string, string> = {
      dashboard:'Painel', pedidos:'Pedidos',
      catalogo:'Catálogo', cadastro:'Novo Produto',
      depoimentos:'Depoimentos', perfil:'Meu Perfil'
    };
    this.tituloPainel = titulos[id] || id;
    if (id === 'dashboard') setTimeout(() => this.desenharDonut(), 100);
    if (id === 'perfil' && !this.perfilAdmin()) this.carregarPerfilAdmin();
    if (id === 'depoimentos') this.carregarDepoimentos();
  }

  // ==================== DEPOIMENTOS (moderação) ====================

  depoimentos = signal<DepoimentoResponse[]>([]);
  carregandoDepoimentos = signal(false);
  erroDepoimentos = signal('');

  /** Pendentes primeiro (mais recentes no topo), aprovados depois — pra moderar sem precisar filtrar. */
  get depoimentosPendentes(): DepoimentoResponse[] {
    return this.depoimentos().filter(d => !d.aprovado);
  }

  get depoimentosAprovados(): DepoimentoResponse[] {
    return this.depoimentos().filter(d => d.aprovado);
  }

  async carregarDepoimentos(): Promise<void> {
    this.carregandoDepoimentos.set(true);
    this.erroDepoimentos.set('');
    try {
      const dados = await firstValueFrom(this.depoimentoApi.listarParaAdmin());
      this.depoimentos.set(dados);
    } catch {
      this.erroDepoimentos.set('Não foi possível carregar os depoimentos agora.');
    } finally {
      this.carregandoDepoimentos.set(false);
    }
  }

  async aprovarDepoimento(id: number): Promise<void> {
    try {
      const atualizado = await firstValueFrom(this.depoimentoApi.aprovar(id));
      this.depoimentos.set(this.depoimentos().map(d => d.id === atualizado.id ? atualizado : d));
    } catch {
      window.alert('Não foi possível aprovar esse depoimento agora. Tente novamente.');
    }
  }

  async excluirDepoimento(id: number): Promise<void> {
    const confirmar = window.confirm('Remover este depoimento? Essa ação não pode ser desfeita.');
    if (!confirmar) return;

    try {
      await firstValueFrom(this.depoimentoApi.excluir(id));
      this.depoimentos.set(this.depoimentos().filter(d => d.id !== id));
    } catch {
      window.alert('Não foi possível remover esse depoimento agora. Tente novamente.');
    }
  }

  // ==================== MEU PERFIL (ADM) ====================

  perfilAdmin = signal<UsuarioResponse | null>(null);
  carregandoPerfilAdmin = signal(false);
  erroPerfilAdmin = signal('');

  editandoPerfilAdmin = signal(false);
  nomeEdicaoAdmin = '';
  telefoneEdicaoAdmin = '';
  salvandoPerfilAdmin = signal(false);
  erroSalvarPerfilAdmin = signal('');
  perfilAdminSalvo = signal(false);

  async carregarPerfilAdmin(): Promise<void> {
    this.carregandoPerfilAdmin.set(true);
    this.erroPerfilAdmin.set('');
    try {
      const dados = await firstValueFrom(this.usuarioApi.meuPerfil());
      this.perfilAdmin.set(dados);
      this.nomeEdicaoAdmin = dados.nome;
      this.telefoneEdicaoAdmin = dados.telefone ?? '';
    } catch {
      this.erroPerfilAdmin.set('Não foi possível carregar seus dados agora.');
    } finally {
      this.carregandoPerfilAdmin.set(false);
    }
  }

  iniciarEdicaoPerfilAdmin(): void {
    this.editandoPerfilAdmin.set(true);
  }

  cancelarEdicaoPerfilAdmin(): void {
    const p = this.perfilAdmin();
    this.nomeEdicaoAdmin = p?.nome ?? '';
    this.telefoneEdicaoAdmin = p?.telefone ?? '';
    this.editandoPerfilAdmin.set(false);
    this.erroSalvarPerfilAdmin.set('');
  }

  async salvarPerfilAdmin(): Promise<void> {
    if (!this.nomeEdicaoAdmin.trim()) {
      this.erroSalvarPerfilAdmin.set('O nome não pode ficar em branco.');
      return;
    }
    this.salvandoPerfilAdmin.set(true);
    this.erroSalvarPerfilAdmin.set('');
    try {
      const atualizado = await firstValueFrom(
        this.usuarioApi.atualizarMeuPerfil({ nome: this.nomeEdicaoAdmin, telefone: this.telefoneEdicaoAdmin })
      );
      this.perfilAdmin.set(atualizado);
      this.editandoPerfilAdmin.set(false);

      // Mantém o nome/inicial exibidos na sidebar em sincronia, e persiste no localStorage
      // (mesmo padrão usado pelo AuthService após login).
      this.nomeUsuario = atualizado.nome;
      this.inicialUsuario = atualizado.nome[0]?.toUpperCase() ?? 'A';
      this.authService.salvarSessao(this.authService.getToken() ?? '', {
        ...this.authService.getUsuario(),
        nome: atualizado.nome
      });

      this.perfilAdminSalvo.set(true);
      setTimeout(() => this.perfilAdminSalvo.set(false), 3000);
    } catch {
      this.erroSalvarPerfilAdmin.set('Não foi possível salvar agora. Tente novamente.');
    } finally {
      this.salvandoPerfilAdmin.set(false);
    }
  }

  // ==================== PEDIDOS — CRUD REAL ====================

  async carregarPedidos(): Promise<void> {
    this.carregandoPedidos.set(true);
    this.erroPedidos.set('');
    try {
      const pedidos = await firstValueFrom(this.orcamentoApi.listarParaAdmin());
      this.pedidos.set(pedidos);
    } catch {
      this.erroPedidos.set('Não foi possível carregar os pedidos agora. Tente recarregar a página.');
    } finally {
      this.carregandoPedidos.set(false);
    }
  }

  statusClass(status: string): string {
    return this.statusCssClass[status] ?? 'pending';
  }

  /** Ações ✓ (aprovar/confirmar) e ✕ (recusar) nos botões da tabela e do modal. */
  async changeStatus(p: ApiOrcamento, novoStatus: string): Promise<void> {
    try {
      const atualizado = await firstValueFrom(this.orcamentoApi.atualizarStatusAdmin(p.id, novoStatus));
      this.pedidos.set(this.pedidos().map(x => x.id === atualizado.id ? atualizado : x));
    } catch {
      window.alert('Não foi possível atualizar o status do pedido agora. Tente novamente.');
    }
  }

  filtrarPorStatus(e: Event): void {
    this.filtroStatusAtivo = (e.target as HTMLSelectElement).value;
  }

  /** A filtragem é reativa via o getter `pedidosFiltrados` — este método existe só para
   *  o binding (input) do template, o próprio termoBusca já dispara a reavaliação. */
  filtrarPedidos(): void {}

  openModal(p: ApiOrcamento): void { this.pedidoModal = p; this.modalAberto = true; }
  fecharModal(): void { this.modalAberto = false; this.pedidoModal = null; }

  // ---- CALENDÁRIO ----
  gerarCalendario(): void {
    const today = new Date();
    const first = new Date(this.calYear, this.calMonth, 1).getDay();
    const total = new Date(this.calYear, this.calMonth + 1, 0).getDate();
    const eventos = this.eventosPorDia(this.calYear, this.calMonth);
    this.cellsMini = [];
    for (let i = 0; i < first; i++) this.cellsMini.push({ num:'', cls:'empty' });
    for (let d = 1; d <= total; d++) {
      const isToday = d === today.getDate() && this.calMonth === today.getMonth() && this.calYear === today.getFullYear();
      const evCls = eventos[d] || '';
      this.cellsMini.push({ num: String(d), cls: [evCls, isToday ? 'today' : ''].join(' ').trim() });
    }
  }

  changeMonth(dir: number): void {
    this.calMonth += dir;
    if (this.calMonth > 11) { this.calMonth = 0; this.calYear++; }
    if (this.calMonth < 0)  { this.calMonth = 11; this.calYear--; }
    this.gerarCalendario();
  }

  // ---- DONUT ----
  desenharDonut(): void {
    const canvas = this.donutCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cx = 80, cy = 80, r = 60, ir = 38;
    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, 160, 160);
    this.donutData.forEach(d => {
      const slice = (d.val / 100) * 2 * Math.PI;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath(); ctx.fillStyle = d.color; ctx.fill();
      startAngle += slice;
    });
    ctx.beginPath(); ctx.arc(cx, cy, ir, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();

    const totalEventos = this.pedidos().filter(p => p.status !== 'RECUSADO').length;
    ctx.fillStyle = '#2D2D2D'; ctx.font = 'bold 18px DM Sans';
    ctx.textAlign = 'center'; ctx.fillText(String(totalEventos), cx, cy + 4);
    ctx.font = '10px DM Sans'; ctx.fillStyle = '#6B7280';
    ctx.fillText('eventos', cx, cy + 18);
  }

  // ==================== CATÁLOGO — CRUD REAL ====================

  async carregarCatalogo(): Promise<void> {
    this.carregandoCatalogo.set(true);
    this.erroCatalogo.set('');
    try {
      const produtos = await firstValueFrom(this.catalogoApi.buscarTodosProdutos());
      this.produtosCatalogo.set(produtos);
    } catch {
      this.erroCatalogo.set('Não foi possível carregar o catálogo. Tente recarregar a página.');
    } finally {
      this.carregandoCatalogo.set(false);
    }
  }

  filtrarCatalog(val: string): void {
    this.filtroCatAtivo = val;
  }

  /** Abre o formulário de cadastro já preenchido para editar um produto existente. */
  editarProduto(p: ApiProduto): void {
    this.novoProd = {
      id: p.id,
      nome: p.nome,
      categoria: p.categoria,
      tipoItem: p.tipoItem,
      valor: p.valor,
      unidadeMedida: p.unidadeMedida ?? '',
      quantidadeMinima: p.quantidadeMinima ?? null,
      descricao: p.descricao ?? ''
    };
    this.imagemUrlAtual.set(this.catalogoApi.resolverUrlImagem(p.imagemUrl) || p.imagemUrl || '');
    this.erroSalvarProduto.set('');
    this.erroUpload.set('');
    this.showPanel('cadastro');
  }

  async deleteProd(p: ApiProduto): Promise<void> {
    const confirmar = window.confirm(`Remover "${p.nome}" do catálogo ativo?`);
    if (!confirmar) return;

    try {
      await firstValueFrom(this.catalogoApi.desativarProduto(p.id));
      await this.carregarCatalogo();
    } catch {
      window.alert('Não foi possível remover o produto agora. Tente novamente.');
    }
  }

  // ---- CADASTRO / EDIÇÃO ----

  private montarRequest(): ProdutoRequest {
    return {
      nome: this.novoProd.nome,
      descricao: this.novoProd.descricao || undefined,
      categoria: this.novoProd.categoria,
      tipoItem: this.novoProd.tipoItem,
      valor: Number(this.novoProd.valor) || 0,
      unidadeMedida: this.novoProd.unidadeMedida || undefined,
      quantidadeMinima: this.novoProd.quantidadeMinima ?? undefined,
      imagemUrl: this.imagemUrlAtual() || undefined
    };
  }

  /**
   * Chamado ao selecionar um arquivo no <input type="file">.
   * Mostra preview local imediato (createObjectURL) e, em paralelo, envia o
   * arquivo real para o servidor. Ao concluir, troca o preview pela URL definitiva.
   */
  async onArquivoSelecionado(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    this.erroUpload.set('');
    this.imagemUrlAtual.set(URL.createObjectURL(arquivo)); // preview instantâneo, antes do upload terminar
    this.enviandoImagem.set(true);

    try {
      const resultado = await firstValueFrom(this.catalogoApi.uploadImagem(arquivo));
      this.imagemUrlAtual.set(this.catalogoApi.resolverUrlImagem(resultado.url));
    } catch {
      this.erroUpload.set('Não foi possível enviar a imagem. Tente novamente.');
    } finally {
      this.enviandoImagem.set(false);
      input.value = ''; // permite selecionar o mesmo arquivo de novo, se precisar
    }
  }

  /** Permite colar/editar a URL da imagem manualmente, como alternativa ao upload. */
  onImagemUrlManual(valor: string): void {
    this.imagemUrlAtual.set(valor);
  }

  removerImagem(): void {
    this.imagemUrlAtual.set('');
    this.erroUpload.set('');
  }

  async saveProduct(): Promise<void> {
    this.erroSalvarProduto.set('');

    if (!this.novoProd.nome || !this.novoProd.categoria || !this.novoProd.tipoItem) {
      this.erroSalvarProduto.set('Preencha ao menos nome, categoria, tipo de item e valor.');
      return;
    }

    this.salvandoProduto.set(true);

    try {
      const request = this.montarRequest();

      if (this.editando && this.novoProd.id !== null) {
        await firstValueFrom(this.catalogoApi.atualizarProduto(this.novoProd.id, request));
      } else {
        await firstValueFrom(this.catalogoApi.criarProduto(request));
      }

      await this.carregarCatalogo();

      this.prodSalvo.set(true);
      setTimeout(() => {
        this.prodSalvo.set(false);
      }, 3000);

      this.clearForm();
      this.showPanel('catalogo');
    } catch {
      this.erroSalvarProduto.set('Não foi possível salvar o produto agora. Tente novamente em instantes.');
    } finally {
      this.salvandoProduto.set(false);
    }
  }

  clearForm(): void {
    this.novoProd = this.formVazio();
    this.imagemUrlAtual.set('');
    this.erroSalvarProduto.set('');
    this.erroUpload.set('');
  }

  // ---- AUTH ----
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }

  // ---- NAVEGAÇÃO HOME (LOGO) ----
  voltarHome(): void {
    this.painelAtivo = 'dashboard'; // volta para tela inicial
    this.tituloPainel = 'Painel';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // opcional: garante URL limpa
    this.router.navigate(['/home']);
  }

}