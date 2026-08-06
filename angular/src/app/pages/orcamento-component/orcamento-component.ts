import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CatalogoApiService, ApiTema, ApiProduto } from '../../core/services/catalogo-api.service';
import { OrcamentoApiService, OrcamentoEventoRequest, OrcamentoConfirmarRequest } from '../../core/services/orcamento-api.service';

type EventType = {
  nome: string;
  icone: string;
};

type TemaInfantilFiltro = 'todos' | 'MENINO' | 'MENINA' | 'UNISSEX';

type TemaInfantilFilterOption = {
  valor: TemaInfantilFiltro;
  rotulo: string;
};

type DocinhoFilter = 'todos' | 'tradicional' | 'gourmet';

type DocinhoFilterOption = {
  valor: DocinhoFilter;
  rotulo: string;
};

type CategoriaDecoracao = 'balao' | 'cenografia' | 'iluminacao' | 'personalizacao' | 'mobiliario';
type CategoriaMusicaAnimacao = 'musica' | 'som' | 'animacao' | 'show' | 'experiencia';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orcamento-component.html',
  styleUrl: './orcamento-component.css'
})
export class OrcamentoComponent implements OnInit {
  etapaAtual = 1;
  tipoEvento = 'Casamento';
  convidados = 100;
  dataEvento = '';

  // ---- Convertidos para signal() porque o app roda em modo zoneless (Angular 21) ----
  // Propriedades comuns não disparam re-renderização automática quando alteradas
  // dentro de async/await (ex: após chamadas HTTP encadeadas). Signals resolvem isso.
  modalAberto = signal(false);
  enviando = signal(false);
  numeroPedido = signal('');
  erroEnvio = signal('');

  rascunhoSalvo = false;

  // ---- Catálogo real vindo do backend ----
  produtos: ApiProduto[] = [];
  temas: ApiTema[] = [];
  temaSelecionadoId: number | null = null;
  carregandoCatalogo = false;
  erroCatalogo = '';

  // ---- Estado de seleção (chaves = ID real do produto no banco) ----
  selecionados: Record<number, boolean> = {};
  quantidades: Record<number, number> = {};
  decoracaoExpandida: Record<number, boolean> = {};
  decoracaoSolicitado: Record<number, boolean> = {};
  decoracaoObservacoes: Record<number, string> = {};

  // ---- Filtros de UI ----
  temaInfantilFiltroAtual: TemaInfantilFiltro = 'todos';
  docinhoFiltroAtual: DocinhoFilter = 'todos';

  // ---- Dados de contato — Etapa 4 ----
  nomeContato = '';
  emailContato = '';
  whatsappContato = '';
  melhorHorarioContato = 'Manhã das 8h às 12h';
  observacoes = '';

  readonly filtrosDocinho: DocinhoFilterOption[] = [
    { valor: 'todos', rotulo: 'Todos' },
    { valor: 'tradicional', rotulo: 'Tradicionais' },
    { valor: 'gourmet', rotulo: 'Gourmet' }
  ];

  readonly filtrosTemaInfantil: TemaInfantilFilterOption[] = [
    { valor: 'todos', rotulo: 'Todos' },
    { valor: 'MENINO', rotulo: 'Meninos' },
    { valor: 'MENINA', rotulo: 'Meninas' },
    { valor: 'UNISSEX', rotulo: 'Unissex' }
  ];

  readonly categoriasDecoracao: CategoriaDecoracao[] = ['balao', 'cenografia', 'iluminacao', 'personalizacao', 'mobiliario'];

  readonly titulosDecoracao: Record<CategoriaDecoracao, string> = {
    balao: 'Arte Visual de Balão',
    cenografia: 'Cenografia e Estrutura',
    iluminacao: 'Iluminação Cênica',
    personalizacao: 'Personalização',
    mobiliario: 'Mobiliário'
  };

  readonly labelFornecimento: Record<string, string> = {
    CASA: 'Executado pela casa',
    PARCEIRO: 'Fornecedor parceiro indicado',
    CLIENTE_TRAZ: 'Você contrata por fora'
  };

  readonly labelUnidade: Record<string, string> = {
    metro: '/ metro',
    unidade: '/ unidade',
    pacote: '/ pacote',
    diaria: '/ diária'
  };

  readonly labelUnidadeResumo: Record<string, string> = {
    metro: 'metro',
    unidade: 'unidade',
    pacote: 'pacote',
    diaria: 'diária'
  };

  readonly categoriasMusicaAnimacao: CategoriaMusicaAnimacao[] = ['musica', 'som', 'animacao', 'show', 'experiencia'];

  readonly titulosMusicaAnimacao: Record<CategoriaMusicaAnimacao, string> = {
    musica: 'Música',
    som: 'Som',
    animacao: 'Animação',
    show: 'Shows',
    experiencia: 'Experiências'
  };

  tiposEvento: EventType[] = [
    { nome: 'Casamento', icone: '💍' },
    { nome: '15 Anos', icone: '👑' },
    { nome: 'Infantil', icone: '🎈' },
    { nome: 'Floral', icone: '🌸' },
    { nome: 'Temático', icone: '🎭' },
    { nome: 'Corporativo', icone: '🥂' }
  ];

  constructor(
    private catalogoApi: CatalogoApiService,
    private orcamentoApi: OrcamentoApiService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarTemas();
  }

  // ==================== CARREGAMENTO DO CATÁLOGO ====================

  private async carregarProdutos(): Promise<void> {
    this.carregandoCatalogo = true;
    this.erroCatalogo = '';
    try {
      this.produtos = await firstValueFrom(this.catalogoApi.buscarTodosProdutos());
      this.inicializarSelecaoObrigatorios();
    } catch {
      this.erroCatalogo = 'Não foi possível carregar o catálogo de produtos. Recarregue a página.';
    } finally {
      this.carregandoCatalogo = false;
    }
  }

  private async carregarTemas(): Promise<void> {
    const tipoEnum = this.mapTipoEventoToEnum(this.tipoEvento);
    try {
      this.temas = await firstValueFrom(this.catalogoApi.buscarTemas(tipoEnum));
    } catch {
      this.temas = [];
    }
    this.temaSelecionadoId = null;
  }

  private inicializarSelecaoObrigatorios(): void {
    for (const produto of this.produtos) {
      if (produto.tipoItem === 'OBRIGATORIO') {
        this.selecionados[produto.id] = true;
      }
    }
  }

  private mapTipoEventoToEnum(tipo: string): string {
    const mapa: Record<string, string> = {
      'Casamento': 'CASAMENTO',
      '15 Anos': 'QUINZE_ANOS',
      'Infantil': 'INFANTIL',
      'Floral': 'FLORAL',
      'Temático': 'TEMATICO',
      'Corporativo': 'CORPORATIVO'
    };
    return mapa[tipo] ?? 'TEMATICO';
  }

  // ==================== NAVEGAÇÃO DO WIZARD ====================

  get larguraProgresso(): string {
    return `${(this.etapaAtual / 4) * 100}%`;
  }

  irParaEtapa(etapa: number): void {
    this.etapaAtual = etapa;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selecionarTipoEvento(tipo: string): void {
    this.tipoEvento = tipo;
    this.temaInfantilFiltroAtual = 'todos';
    this.carregarTemas();
    this.irParaEtapa(2);
  }

  ajustarConvidados(valor: number): void {
    const novoTotal = Number(this.convidados) + valor;
    this.convidados = Math.max(20, Math.min(1000, novoTotal));
  }

  atualizarConvidados(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = Number(input.value) || 20;
    this.convidados = Math.max(20, Math.min(1000, valor));
  }

  atualizarData(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dataEvento = input.value;
  }

  // ==================== TEMAS ====================

  get ehEventoInfantil(): boolean {
    return this.tipoEvento === 'Infantil';
  }

  get temasFiltrados(): ApiTema[] {
    if (this.ehEventoInfantil && this.temaInfantilFiltroAtual !== 'todos') {
      return this.temas.filter(t => t.genero === this.temaInfantilFiltroAtual);
    }
    return this.temas;
  }

  get temaSelecionado(): ApiTema | undefined {
    return this.temas.find(t => t.id === this.temaSelecionadoId);
  }

  selecionarTema(tema: ApiTema): void {
    this.temaSelecionadoId = tema.id;
  }

  selecionarFiltroTemaInfantil(filtro: TemaInfantilFiltro): void {
    this.temaInfantilFiltroAtual = filtro;
  }

  removerTema(): void {
    this.temaSelecionadoId = null;
  }

  // ==================== HELPERS GENÉRICOS DE PRODUTO ====================

  produtosPorCategoria(categoria: string): ApiProduto[] {
    return this.produtos.filter(p => p.categoria === categoria && p.ativo !== false);
  }

  produtoSelecionado(produtoId: number): boolean {
    return !!this.selecionados[produtoId];
  }

  toggleProdutoSelecionado(produto: ApiProduto): void {
    if (produto.tipoItem === 'OBRIGATORIO') {
      this.selecionados[produto.id] = true;
      return;
    }
    this.selecionados[produto.id] = !this.selecionados[produto.id];
  }

  quantidadeItem(produtoId: number): number {
    return this.quantidades[produtoId] ?? 0;
  }

  incrementarItem(produto: ApiProduto): void {
    const atual = this.quantidadeItem(produto.id);
    const minima = produto.quantidadeMinima ?? 1;
    const incremento = produto.incremento ?? 1;
    this.quantidades[produto.id] = atual === 0 ? minima : atual + incremento;
  }

  decrementarItem(produto: ApiProduto): void {
    const atual = this.quantidadeItem(produto.id);
    const minima = produto.quantidadeMinima ?? 1;
    const incremento = produto.incremento ?? 1;
    this.quantidades[produto.id] = atual <= minima ? 0 : Math.max(0, atual - incremento);
  }

  subtotalItem(produto: ApiProduto): number {
    return this.quantidadeItem(produto.id) * produto.valor;
  }

  limparItem(produtoId: number): void {
    delete this.quantidades[produtoId];
  }

  splitLista(texto?: string): string[] {
    return texto ? texto.split(',').map(s => s.trim()).filter(Boolean) : [];
  }

  // ==================== SERVIÇOS (Buffet + Bolo) ====================

  get servicos(): ApiProduto[] {
    return this.produtos.filter(p => (p.categoria === 'BUFFET' || p.categoria === 'BOLO') && p.ativo !== false);
  }

  get servicosSelecionados(): ApiProduto[] {
    return this.servicos.filter(p => this.produtoSelecionado(p.id));
  }

  // ==================== DOCINHOS ====================

  get docinhosClassicos(): ApiProduto[] {
    const base = this.produtosPorCategoria('DOCES').filter(p => p.linha === 'CLASSICA');
    if (this.docinhoFiltroAtual === 'todos') return base;
    return base.filter(p => p.subcategoria === this.docinhoFiltroAtual);
  }

  get docesFinos(): ApiProduto[] {
    return this.produtosPorCategoria('DOCES').filter(p => p.linha === 'PREMIUM');
  }

  get docinhosSelecionados(): ApiProduto[] {
    return this.produtosPorCategoria('DOCES').filter(p => this.quantidadeItem(p.id) > 0);
  }

  get totalUnidadesDocinhosClassicos(): number {
    return this.docinhosSelecionados.filter(p => p.linha === 'CLASSICA').reduce((t, p) => t + this.quantidadeItem(p.id), 0);
  }

  get totalValorDocinhosClassicos(): number {
    return this.docinhosSelecionados.filter(p => p.linha === 'CLASSICA').reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  get totalUnidadesDocesFinos(): number {
    return this.docinhosSelecionados.filter(p => p.linha === 'PREMIUM').reduce((t, p) => t + this.quantidadeItem(p.id), 0);
  }

  get totalValorDocesFinos(): number {
    return this.docinhosSelecionados.filter(p => p.linha === 'PREMIUM').reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  get totalValorDocinhos(): number {
    return this.docinhosSelecionados.reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  selecionarFiltroDocinho(filtro: DocinhoFilter): void {
    this.docinhoFiltroAtual = filtro;
  }

  // ==================== SALGADINHOS ====================

  get salgadinhosTradicionais(): ApiProduto[] {
    return this.produtosPorCategoria('SALGADOS').filter(p => p.linha === 'CLASSICA');
  }

  get salgadosSofisticados(): ApiProduto[] {
    return this.produtosPorCategoria('SALGADOS').filter(p => p.linha === 'PREMIUM');
  }

  get salgadinhosSelecionados(): ApiProduto[] {
    return this.produtosPorCategoria('SALGADOS').filter(p => this.quantidadeItem(p.id) > 0);
  }

  get totalUnidadesSalgadinhosTradicionais(): number {
    return this.salgadinhosSelecionados.filter(p => p.linha === 'CLASSICA').reduce((t, p) => t + this.quantidadeItem(p.id), 0);
  }

  get totalValorSalgadinhosTradicionais(): number {
    return this.salgadinhosSelecionados.filter(p => p.linha === 'CLASSICA').reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  get totalUnidadesSalgadosSofisticados(): number {
    return this.salgadinhosSelecionados.filter(p => p.linha === 'PREMIUM').reduce((t, p) => t + this.quantidadeItem(p.id), 0);
  }

  get totalValorSalgadosSofisticados(): number {
    return this.salgadinhosSelecionados.filter(p => p.linha === 'PREMIUM').reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  get totalValorSalgadinhos(): number {
    return this.salgadinhosSelecionados.reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  // ==================== BEBIDAS ====================

  get bebidasCatalogo(): ApiProduto[] {
    return this.produtosPorCategoria('BEBIDAS');
  }

  get bebidasSelecionadas(): ApiProduto[] {
    return this.bebidasCatalogo.filter(p => this.quantidadeItem(p.id) > 0);
  }

  get totalBebidas(): number {
    return this.bebidasSelecionadas.reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  // ==================== DECORAÇÃO ====================

  itensDecoracaoPorCategoria(categoria: CategoriaDecoracao): ApiProduto[] {
    return this.produtosPorCategoria('DECORACAO').filter(p => p.subcategoria === categoria);
  }

  get decoracaoSelecionada(): ApiProduto[] {
    return this.produtosPorCategoria('DECORACAO').filter(p => !p.sobOrcamento && this.quantidadeItem(p.id) > 0);
  }

  get decoracaoAguardandoOrcamento(): ApiProduto[] {
    return this.produtosPorCategoria('DECORACAO').filter(p => p.sobOrcamento && this.decoracaoSolicitado[p.id]);
  }

  get totalDecoracao(): number {
    return this.decoracaoSelecionada.reduce((t, p) => t + this.subtotalItem(p), 0);
  }

  toggleDetalhesDecoracao(produtoId: number): void {
    this.decoracaoExpandida[produtoId] = !this.decoracaoExpandida[produtoId];
  }

  toggleSolicitarDecoracao(produtoId: number): void {
    this.decoracaoSolicitado[produtoId] = !this.decoracaoSolicitado[produtoId];
  }

  atualizarObservacaoDecoracao(produtoId: number, texto: string): void {
    this.decoracaoObservacoes[produtoId] = texto;
  }

  cancelarSolicitacaoDecoracao(produtoId: number): void {
    this.decoracaoSolicitado[produtoId] = false;
  }

  // ==================== MÚSICA & ANIMAÇÃO ====================

  get itensMusicaAnimacao(): ApiProduto[] {
    return this.produtosPorCategoria('MUSICA');
  }

  get musicaAnimacaoSelecionados(): ApiProduto[] {
    return this.itensMusicaAnimacao.filter(p => this.produtoSelecionado(p.id));
  }

  get totalMusicaAnimacao(): number {
    return this.musicaAnimacaoSelecionados.reduce((t, p) => t + p.valor, 0);
  }

  toggleMusicaAnimacao(produto: ApiProduto): void {
    this.toggleProdutoSelecionado(produto);
  }

  // ==================== RESUMO / TOTAIS ====================

  get temItensNoResumo(): boolean {
    return (
      this.servicosSelecionados.length > 0 ||
      this.docinhosSelecionados.length > 0 ||
      this.salgadinhosSelecionados.length > 0 ||
      this.bebidasSelecionadas.length > 0 ||
      this.decoracaoSelecionada.length > 0 ||
      this.decoracaoAguardandoOrcamento.length > 0 ||
      this.musicaAnimacaoSelecionados.length > 0
    );
  }

  get subtotal(): number {
    const temaValor = this.temaSelecionado?.valor ?? 0;
    const servicosValor = this.servicosSelecionados.reduce((t, p) => t + p.valor, 0);
    return (
      temaValor +
      servicosValor +
      this.totalValorDocinhos +
      this.totalValorSalgadinhos +
      this.totalBebidas +
      this.totalDecoracao +
      this.totalMusicaAnimacao
    );
  }

  get taxaServico(): number {
    return this.subtotal * 0.05;
  }

  get total(): number {
    return this.subtotal + this.taxaServico;
  }

  removerServico(produto: ApiProduto): void {
    if (produto.tipoItem === 'OBRIGATORIO') return;
    this.selecionados[produto.id] = false;
  }

  salvarRascunho(): void {
    this.rascunhoSalvo = true;
    setTimeout(() => {
      this.rascunhoSalvo = false;
    }, 2000);
  }

  // ==================== ENVIO REAL PARA O BACKEND ====================

  private montarItensParaEnvio(): { produtoId: number; quantidade: number }[] {
    const itens: { produtoId: number; quantidade: number }[] = [];

    for (const servico of this.servicosSelecionados) {
      itens.push({ produtoId: servico.id, quantidade: 1 });
    }
    for (const docinho of this.docinhosSelecionados) {
      itens.push({ produtoId: docinho.id, quantidade: this.quantidadeItem(docinho.id) });
    }
    for (const salgadinho of this.salgadinhosSelecionados) {
      itens.push({ produtoId: salgadinho.id, quantidade: this.quantidadeItem(salgadinho.id) });
    }
    for (const bebida of this.bebidasSelecionadas) {
      itens.push({ produtoId: bebida.id, quantidade: this.quantidadeItem(bebida.id) });
    }
    for (const decoracao of this.decoracaoSelecionada) {
      itens.push({ produtoId: decoracao.id, quantidade: this.quantidadeItem(decoracao.id) });
    }
    for (const musica of this.musicaAnimacaoSelecionados) {
      itens.push({ produtoId: musica.id, quantidade: 1 });
    }

    return itens;
  }

  async enviarOrcamento(): Promise<void> {
    this.erroEnvio.set('');

    if (!this.nomeContato || !this.emailContato || !this.whatsappContato) {
      this.erroEnvio.set('Preencha nome, e-mail e WhatsApp para enviar o orçamento.');
      return;
    }

    this.enviando.set(true);

    try {
      const eventoRequest: OrcamentoEventoRequest = {
        tipoEvento: this.mapTipoEventoToEnum(this.tipoEvento),
        numeroConvidados: this.convidados,
        dataEvento: this.dataEvento || undefined
      };
      const orcamentoCriado = await firstValueFrom(this.orcamentoApi.iniciar(eventoRequest));
      const orcamentoId = orcamentoCriado.id;

      if (this.temaSelecionadoId) {
        await firstValueFrom(this.orcamentoApi.definirTema(orcamentoId, this.temaSelecionadoId));
      }

      for (const item of this.montarItensParaEnvio()) {
        await firstValueFrom(this.orcamentoApi.adicionarItem(orcamentoId, item));
      }

      const confirmarRequest: OrcamentoConfirmarRequest = {
        nomeContato: this.nomeContato,
        emailContato: this.emailContato,
        whatsappContato: this.whatsappContato,
        melhorHorarioContato: this.melhorHorarioContato,
        observacoes: this.observacoes
      };
      const resultado = await firstValueFrom(this.orcamentoApi.enviar(orcamentoId, confirmarRequest));

      this.numeroPedido.set('#FP-' + resultado.id);
      this.modalAberto.set(true);
    } catch (erro) {
      console.error('Erro ao enviar orçamento:', erro);
      this.erroEnvio.set('Não foi possível enviar seu orçamento agora. Tente novamente em instantes.');
    } finally {
      this.enviando.set(false);
    }
  }

  fecharModal(): void {
    this.modalAberto.set(false);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  scrollCarousel(id: string, direcao: number): void {
    const elemento = document.getElementById(id);
    if (!elemento) return;
    elemento.scrollBy({ left: direcao * 480, behavior: 'smooth' });
  }

  trackById(index: number, item: ApiProduto | ApiTema): number {
    return item.id;
  }
}