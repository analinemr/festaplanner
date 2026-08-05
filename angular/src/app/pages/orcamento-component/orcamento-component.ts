import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type EventType = {
  nome: string;
  icone: string;
};

type BudgetItem = {
  id: number;
  categoria: string;
  nome: string;
  descricao: string;
  imagem: string;
  preco: number;
  obrigatorio?: boolean;
  selecionado?: boolean;
};

type TemaInfantilGenero = 'menino' | 'menina' | 'unissex';
type TemaInfantilFiltro = 'todos' | TemaInfantilGenero;

type TemaInfantilFilterOption = {
  valor: TemaInfantilFiltro;
  rotulo: string;
};

type TemaInfantil = {
  id: string;
  categoria: 'Tema';
  nome: string;
  genero: TemaInfantilGenero;
  imagem: string;
  descricao: string;
  preco: number;
  obrigatorio?: boolean;
  selecionado: boolean;
};

type TemaQuinzeAnosCategoria = 'classico' | 'moderno' | 'romantico';

type TemaQuinzeAnos = {
  id: string;
  categoria: 'Tema';
  evento: '15 Anos';
  categoriaTema: TemaQuinzeAnosCategoria;
  nome: string;
  imagem: string;
  descricao: string;
  preco: number;
  obrigatorio?: boolean;
  selecionado: boolean;
};

type EventoTemaPasta = 'Casamento' | 'Floral' | 'Corporativo';

type TemaPastaEvento = {
  id: string;
  categoria: 'Tema';
  evento: EventoTemaPasta;
  nome: string;
  imagem: string;
  descricao: string;
  preco: number;
  obrigatorio?: boolean;
  selecionado: boolean;
};

type OrcamentoResumoItem = BudgetItem | TemaInfantil | TemaQuinzeAnos | TemaPastaEvento;

type DocinhoCategory = 'tradicional' | 'gourmet' | 'fino';
type DocinhoLine = 'classica' | 'premium';
type DocinhoFilter = 'todos' | 'tradicional' | 'gourmet';

type DocinhoFilterOption = {
  valor: DocinhoFilter;
  rotulo: string;
};

type Docinho = {
  id: string;
  nome: string;
  imagem: string;
  precoUnitario: number;
  quantidadeMinima: number;
  incremento: number;
  categoria: DocinhoCategory;
  linha: DocinhoLine;
  quantidade: number;
};

type SalgadinhoCategory = 'tradicional' | 'sofisticado';
type SalgadinhoLine = 'classica' | 'premium';

type Salgadinho = {
  id: string;
  nome: string;
  imagem: string;
  precoUnitario: number;
  quantidadeMinima: number;
  incremento: number;
  categoria: SalgadinhoCategory;
  linha: SalgadinhoLine;
};

type ModoBebidas = 'inclusa' | 'consignacao' | 'trazPropia';

type CategoriaBebida =
  | 'agua'
  | 'refrigerante'
  | 'suco'
  | 'energetico'
  | 'cerveja'
  | 'vinho'
  | 'espumante'
  | 'drink'
  | 'destilado';

type Bebida = {
  id: string;
  nome: string;
  categoria: CategoriaBebida;
  precoUnitario: number;
  quantidadeMinima: number;
  incremento: number;
};

type ConfiguracaoBebidas = {
  modo: ModoBebidas;
  itensInclusos?: string[];
  bebidasExtras?: Bebida[];
  taxaRolha?: number;
  observacoesRolha?: string;
};

type BebidaSelecionada = {
  bebidaId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

type CategoriaDecoracao =
  | 'balao'
  | 'cenografia'
  | 'iluminacao'
  | 'personalizacao'
  | 'mobiliario';

type TipoFornecimento = 'casa' | 'parceiro' | 'clienteTraz';
type NivelPersonalizacao = 'digital' | 'prontoMontar' | 'allInclusive';
type UnidadeMedida = 'metro' | 'unidade' | 'pacote' | 'diaria';

type ItemDecoracao = {
  id: string;
  categoria: CategoriaDecoracao;
  nome: string;
  imagem: string;
  descricaoCurta: string;
  itensInclusos: string[];
  itensNaoInclusos: string[];
  fornecimento: TipoFornecimento;
  nivelPersonalizacao?: NivelPersonalizacao;
  precoUnitario: number;
  unidadeMedida: UnidadeMedida;
  quantidadeMinima: number;
  incremento: number;
  sobOrcamento?: boolean;
  precoReferencia?: string;
};

type ItemDecoracaoSelecionado = {
  itemId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  unidadeMedida: UnidadeMedida;
};

type SolicitacaoDecoracao = {
  itemId: string;
  nome: string;
  observacoes: string;
  solicitado: boolean;
};

type CategoriaMusicaAnimacao =
  | 'musica'
  | 'som'
  | 'animacao'
  | 'show'
  | 'experiencia';

type ItemMusicaAnimacao = {
  id: string;
  categoria: CategoriaMusicaAnimacao;
  nome: string;
  imagem: string;
  descricaoCurta: string;
  itensInclusos: string[];
  itensNaoInclusos: string[];
  preco: number;
  duracaoHoras: number;
  selecionado: boolean;
  observacao?: string;
};

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orcamento-component.html',
  styleUrl: './orcamento-component.css'
})
export class OrcamentoComponent implements OnInit {
  etapaAtual = 1;
  tipoEvento = 'Casamento';
  convidados = 100;
  dataEvento = '';
  faixaPreco = 'medio';
  modalAberto = false;
  rascunhoSalvo = false;
  // ← ADICIONADO
  numeroPedido = '';
  temaInfantilFiltroAtual: TemaInfantilFiltro = 'todos';
  docinhoFiltroAtual: DocinhoFilter = 'todos';
  quantidadesSalgadinhos: Record<string, number> = {};
  quantidadesBebidas: Record<string, number> = {};
  quantidadesDecoracao: Record<string, number> = {};
  decoracaoExpandida: Record<string, boolean> = {};
  solicitacoesDecoracao: Record<string, SolicitacaoDecoracao> = {};
  musicaAnimacaoExpandida: Record<string, boolean> = {};
  trazPropiaConfirmado = false;

  readonly filtrosDocinho: DocinhoFilterOption[] = [
    { valor: 'todos', rotulo: 'Todos' },
    { valor: 'tradicional', rotulo: 'Tradicionais' },
    { valor: 'gourmet', rotulo: 'Gourmet' }
  ];

  readonly filtrosTemaInfantil: TemaInfantilFilterOption[] = [
    { valor: 'todos', rotulo: 'Todos' },
    { valor: 'menino', rotulo: 'Meninos' },
    { valor: 'menina', rotulo: 'Meninas' },
    { valor: 'unissex', rotulo: 'Unissex' }
  ];

  readonly iconeBebida: Record<CategoriaBebida, string> = {
    agua: '💧',
    refrigerante: '🥤',
    suco: '🧃',
    energetico: '⚡',
    cerveja: '🍺',
    vinho: '🍷',
    espumante: '🍾',
    drink: '🍹',
    destilado: '🥃'
  };

  readonly categoriasDecoracao: CategoriaDecoracao[] = [
    'balao',
    'cenografia',
    'iluminacao',
    'personalizacao',
    'mobiliario'
  ];

  readonly titulosDecoracao: Record<CategoriaDecoracao, string> = {
    balao: 'Arte Visual de Balão',
    cenografia: 'Cenografia e Estrutura',
    iluminacao: 'Iluminação Cênica',
    personalizacao: 'Personalização',
    mobiliario: 'Mobiliário'
  };

  readonly labelFornecimento: Record<TipoFornecimento, string> = {
    casa: 'Executado pela casa',
    parceiro: 'Fornecedor parceiro indicado',
    clienteTraz: 'Você contrata por fora'
  };

  readonly labelUnidade: Record<UnidadeMedida, string> = {
    metro: '/ metro',
    unidade: '/ unidade',
    pacote: '/ pacote',
    diaria: '/ diária'
  };

  readonly labelUnidadeResumo: Record<UnidadeMedida, string> = {
    metro: 'metro',
    unidade: 'unidade',
    pacote: 'pacote',
    diaria: 'diária'
  };

  readonly categoriasMusicaAnimacao: CategoriaMusicaAnimacao[] = [
    'musica',
    'som',
    'animacao',
    'show',
    'experiencia'
  ];

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

  temasInfantis: TemaInfantil[] = [
    {
      id: 'super-herois',
      categoria: 'Tema',
      nome: 'Super Heróis',
      genero: 'menino',
      imagem: 'assets/orcamento/temas/infantil/super-herois.jpg',
      descricao: 'Painel, mesa decorada e visual vibrante inspirado em heróis.',
      preco: 1200,
      selecionado: false
    },
    {
      id: 'dinossauro',
      categoria: 'Tema',
      nome: 'Dinossauro',
      genero: 'menino',
      imagem: 'assets/orcamento/temas/infantil/dinossauro.jpg',
      descricao: 'Tema aventureiro com folhagens, painel e mesa decorada.',
      preco: 1250,
      selecionado: false
    },
    {
      id: 'futebol',
      categoria: 'Tema',
      nome: 'Futebol e Times do Coração',
      genero: 'menino',
      imagem: 'assets/orcamento/temas/infantil/futebol.jpg',
      descricao: 'Decoração esportiva com painel e composição inspirada em futebol.',
      preco: 1100,
      selecionado: false
    },
    {
      id: 'veiculos-hot-wheels',
      categoria: 'Tema',
      nome: 'Veículos Hot Wheels',
      genero: 'menino',
      imagem: 'assets/orcamento/temas/infantil/hot-wheels.jpg',
      descricao: 'Tema infantil com carros, pistas, velocidade e decoração inspirada no universo Hot Wheels.',
      preco: 1300,
      selecionado: false
    },
    {
      id: 'video-game-universo-game',
      categoria: 'Tema',
      nome: 'Video Game / Universo Game',
      genero: 'menino',
      imagem: 'assets/orcamento/temas/infantil/video-game.jpg',
      descricao: 'Tema infantil gamer com controles, personagens, luzes e decoração inspirada no universo dos games.',
      preco: 1350,
      selecionado: false
    },
    {
      id: 'princesas',
      categoria: 'Tema',
      nome: 'Princesas da Disney',
      genero: 'menina',
      imagem: 'assets/orcamento/temas/infantil/princesas.jpg',
      descricao: 'Tema delicado com painel, mesa decorada e detalhes de princesas.',
      preco: 1300,
      selecionado: false
    },
    {
      id: 'barbie',
      categoria: 'Tema',
      nome: 'Barbie',
      genero: 'menina',
      imagem: 'assets/orcamento/temas/infantil/barbie.jpeg',
      descricao: 'Tema rosa com painel, mesa decorada e clima fashion infantil.',
      preco: 1250,
      selecionado: false
    },
    {
      id: 'unicornio',
      categoria: 'Tema',
      nome: 'Unicórnio',
      genero: 'menina',
      imagem: 'assets/orcamento/temas/infantil/unicornio.jpg',
      descricao: 'Tema lúdico com tons suaves, arco-íris e composição encantada.',
      preco: 1200,
      selecionado: false
    },
    {
      id: 'bosque-das-fadas',
      categoria: 'Tema',
      nome: 'Bosque das Fadas',
      genero: 'menina',
      imagem: 'assets/orcamento/temas/infantil/bosque-das-fadas.jpg',
      descricao: 'Tema delicado com fadas, flores, luzes e elementos encantados para festa infantil.',
      preco: 1400,
      selecionado: false
    },
    {
      id: 'glow-party',
      categoria: 'Tema',
      nome: 'Glow Party',
      genero: 'menina',
      imagem: 'assets/orcamento/temas/infantil/glow-party.jpg',
      descricao: 'Tema moderno com luzes, neon, brilho e decoração colorida para uma festa animada.',
      preco: 1450,
      selecionado: false
    },
    {
      id: 'minnie-mouse',
      categoria: 'Tema',
      nome: 'Minnie Mouse',
      genero: 'menina',
      imagem: 'assets/orcamento/temas/infantil/minnie-mouse.jpg',
      descricao: 'Tema clássico e delicado inspirado na Minnie, com decoração vermelha, rosa, laços e mesa temática.',
      preco: 1350,
      selecionado: false
    },
    {
      id: 'patrulha-canina',
      categoria: 'Tema',
      nome: 'Patrulha Canina',
      genero: 'unissex',
      imagem: 'assets/orcamento/temas/infantil/patrulha-canina.jpg',
      descricao: 'Tema divertido com painel, personagens e mesa decorada.',
      preco: 1250,
      selecionado: false
    },
    {
      id: 'peppa-pig',
      categoria: 'Tema',
      nome: 'Peppa Pig',
      genero: 'unissex',
      imagem: 'assets/orcamento/temas/infantil/peppa-pig.jpg',
      descricao: 'Tema infantil leve e colorido com composição para fotos.',
      preco: 1200,
      selecionado: false
    }
  ];

  temasQuinzeAnos: TemaQuinzeAnos[] = [
    {
      id: 'baile-de-mascaras',
      categoria: 'Tema',
      evento: '15 Anos',
      categoriaTema: 'classico',
      nome: 'Baile de Máscaras',
      imagem: 'assets/orcamento/temas/15-anos/baile-de-mascaras.jpg',
      descricao: 'Tema elegante com máscaras, brilho, sofisticação e clima de baile para festa de 15 anos.',
      preco: 1800,
      selecionado: false
    },
    {
      id: 'glamour-neon',
      categoria: 'Tema',
      evento: '15 Anos',
      categoriaTema: 'moderno',
      nome: 'Glamour Neon',
      imagem: 'assets/orcamento/temas/15-anos/glamour-neon.jpg',
      descricao: 'Tema moderno com luzes neon, cores vibrantes e visual jovem para uma festa animada.',
      preco: 1900,
      selecionado: false
    },
    {
      id: 'jardim-floral-15-anos',
      categoria: 'Tema',
      evento: '15 Anos',
      categoriaTema: 'romantico',
      nome: 'Jardim Floral',
      imagem: 'assets/orcamento/temas/15-anos/jardim-floral-15-anos.jpg',
      descricao: 'Tema romântico com flores, delicadeza, luzes e composição elegante para festa de 15 anos.',
      preco: 2000,
      selecionado: false
    },
    {
      id: 'sunset-party-boho-chic',
      categoria: 'Tema',
      evento: '15 Anos',
      categoriaTema: 'moderno',
      nome: 'Sunset Party - Boho Chic',
      imagem: 'assets/orcamento/temas/15-anos/sunset-party-boho-chic.jpg',
      descricao: 'Tema sofisticado com clima sunset, elementos boho, tons quentes e decoração elegante.',
      preco: 2100,
      selecionado: false
    }
  ];

  temasPastasEvento: TemaPastaEvento[] = [
    {
      id: 'casamento',
      categoria: 'Tema',
      evento: 'Casamento',
      nome: 'Casamento',
      imagem: 'assets/orcamento/temas/casamento/casamento.jpg',
      descricao: 'Tema elegante com ambientação clássica e composição visual para cerimônia e recepção.',
      preco: 2200,
      selecionado: false
    },
    {
      id: 'floral',
      categoria: 'Tema',
      evento: 'Floral',
      nome: 'Floral',
      imagem: 'assets/orcamento/temas/floral/floral.jpg',
      descricao: 'Tema delicado com flores, leveza e decoração romântica para um evento sofisticado.',
      preco: 1800,
      selecionado: false
    },
    {
      id: 'corporativo',
      categoria: 'Tema',
      evento: 'Corporativo',
      nome: 'Corporativo',
      imagem: 'assets/orcamento/temas/corporativo/corporativo.jpg',
      descricao: 'Tema profissional com composição clean, identidade visual e ambientação para eventos corporativos.',
      preco: 1900,
      selecionado: false
    }
  ];

  servicos: BudgetItem[] = [
    {
      id: 101,
      categoria: 'Buffet',
      nome: 'Buffet Básico',
      descricao: 'Salgados, frios, pratos quentes e estrutura essencial para os convidados.',
      imagem: 'assets/orcamento/buffet-basico.jpg',
      preco: 2500,
      obrigatorio: true,
      selecionado: true
    },
    {
      id: 102,
      categoria: 'Buffet',
      nome: 'Buffet Premium',
      descricao: 'Opção gourmet com estações ao vivo e cardápio mais sofisticado.',
      imagem: 'assets/orcamento/buffet-premium.jpg',
      preco: 4200
    },
    {
      id: 103,
      categoria: 'Buffet',
      nome: 'Coquetel',
      descricao: 'Finger foods, canapés e atendimento leve para eventos sociais.',
      imagem: 'assets/orcamento/buffet-coquetel.jpg',
      preco: 2600
    },
    {
      id: 201,
      categoria: 'Bolo',
      nome: 'Bolo Cenográfico',
      descricao: 'Bolo decorativo para compor a mesa principal e valorizar as fotos.',
      imagem: 'assets/orcamento/bolo-cenografico.jpg',
      preco: 850
    },
    {
      id: 202,
      categoria: 'Bolo',
      nome: 'Bolo Real Padrão (1 Andar)',
      descricao: 'Bolo real compacto com cobertura personalizada e acabamento delicado para eventos menores.',
      imagem: 'assets/orcamento/bolo-1-andar.jpg',
      preco: 700
    },
    {
      id: 203,
      categoria: 'Bolo',
      nome: 'Bolo Real Duplo (2 Andares)',
      descricao: 'Bolo real com dois andares, recheios variados e decoracao alinhada ao tema da festa.',
      imagem: 'assets/orcamento/bolo-2-andares.jpg',
      preco: 950
    },
    {
      id: 204,
      categoria: 'Bolo',
      nome: 'Bolo Real Majestoso (3 Andares)',
      descricao: 'Bolo real com recheios variados, cobertura personalizada e acabamento tematico.',
      imagem: 'assets/orcamento/bolo-3-andares.jpg',
      preco: 1200
    },
  ];

  docinhos: Docinho[] = [
    {
      id: 'beijinho',
      nome: 'Beijinho',
      imagem: 'assets/orcamento/docinhos/beijinho.jpg',
      precoUnitario: 2.5,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'tradicional',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'branco-crocante',
      nome: 'Branco Crocante',
      imagem: 'assets/orcamento/docinhos/branco-crocante.jpg',
      precoUnitario: 3,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'tradicional',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'brigadeiro',
      nome: 'Brigadeiro',
      imagem: 'assets/orcamento/docinhos/brigadeiro.jpg',
      precoUnitario: 3,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'tradicional',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'brigadeiro-branco',
      nome: 'Brigadeiro Branco',
      imagem: 'assets/orcamento/docinhos/brigadeiro-branco.jpg',
      precoUnitario: 3,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'tradicional',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'brigadeiro-confete',
      nome: 'Brigadeiro Confete',
      imagem: 'assets/orcamento/docinhos/brigadeiro-confete.jpg',
      precoUnitario: 3.2,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'tradicional',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'brigadeiro-kitkat',
      nome: 'Brigadeiro de KitKat',
      imagem: 'assets/orcamento/docinhos/brigadeiro-kitkat.jpg',
      precoUnitario: 3.8,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'brigadeiro-oreo',
      nome: 'Brigadeiro de Oreo',
      imagem: 'assets/orcamento/docinhos/brigadeiro-oreo.jpg',
      precoUnitario: 3.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'brigadeiro-churros',
      nome: 'Brigadeiro Sabor Churros',
      imagem: 'assets/orcamento/docinhos/brigadeiro-churros.jpg',
      precoUnitario: 3.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'casadinho',
      nome: 'Casadinho',
      imagem: 'assets/orcamento/docinhos/casadinho.jpg',
      precoUnitario: 3.2,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'tradicional',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'chocoball',
      nome: 'Chocoball',
      imagem: 'assets/orcamento/docinhos/chocoball.jpg',
      precoUnitario: 3.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'choco-branco',
      nome: 'Choco Branco',
      imagem: 'assets/orcamento/docinhos/choco-branco.jpg',
      precoUnitario: 3.2,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'tradicional',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'choco-crocante',
      nome: 'Choco Crocante',
      imagem: 'assets/orcamento/docinhos/choco-crocante.jpg',
      precoUnitario: 3.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'chocolate-cereja',
      nome: 'Chocolate com Cereja',
      imagem: 'assets/orcamento/docinhos/chocolate-cereja.jpg',
      precoUnitario: 4,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'ferrero',
      nome: 'Ferrero',
      imagem: 'assets/orcamento/docinhos/ferrero.jpg',
      precoUnitario: 4,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'kinder-avela',
      nome: 'Kinder com Avelã',
      imagem: 'assets/orcamento/docinhos/kinder-avela.jpg',
      precoUnitario: 4,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'ninho-nutela',
      nome: 'Ninho com Nutella',
      imagem: 'assets/orcamento/docinhos/ninho-nutela.jpg',
      precoUnitario: 3.8,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'prestigio',
      nome: 'Prestígio',
      imagem: 'assets/orcamento/docinhos/prestigio.jpg',
      precoUnitario: 3.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'sensacao',
      nome: 'Sensação',
      imagem: 'assets/orcamento/docinhos/sensacao.jpg',
      precoUnitario: 3.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'gourmet',
      linha: 'classica',
      quantidade: 0
    },
    {
      id: 'pistache-brigadeiro',
      nome: 'Brigadeiro de Pistache',
      imagem: 'assets/orcamento/doces-finos/pistache-brigadeiro.jpg',
      precoUnitario: 5,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'bombom-pistache-trufa',
      nome: 'Bombom Aberto de Pistache e Trufa Branca',
      imagem: 'assets/orcamento/doces-finos/bombom-pistache-trufa.jpg',
      precoUnitario: 6,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'caramelo-flor-de-sal',
      nome: 'Bombom de Caramelo Salgado com Flor de Sal',
      imagem: 'assets/orcamento/doces-finos/caramelo-flor-de-sal.jpg',
      precoUnitario: 4,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'champagne-frutas-vermelhas',
      nome: 'Bombom de Champagne com Frutas Vermelhas',
      imagem: 'assets/orcamento/doces-finos/champagne-frutas-vermelhas.jpg',
      precoUnitario: 6,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'coco-queimado-trufado',
      nome: 'Bombom de Coco Queimado Trufado',
      imagem: 'assets/orcamento/doces-finos/coco-queimado-trufado.jpg',
      precoUnitario: 4.5,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'caixinha-physalis',
      nome: 'Caixinha de Chocolate com Physalis',
      imagem: 'assets/orcamento/doces-finos/caixinha-physalis.jpg',
      precoUnitario: 5,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'camafeu-nozes',
      nome: 'Camafeu de Nozes',
      imagem: 'assets/orcamento/doces-finos/camafeu-nozes.jpg',
      precoUnitario: 4.5,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'cappuccino-ampola',
      nome: 'Copinho de Cappuccino com Ampola Saborizante',
      imagem: 'assets/orcamento/doces-finos/cappuccino-ampola.jpg',
      precoUnitario: 7.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'damasco-amendoas',
      nome: 'Damasco Recheado com Creme de Amêndoas',
      imagem: 'assets/orcamento/doces-finos/damasco-amendoas.jpg',
      precoUnitario: 5.5,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'fudge-belga-macadamia',
      nome: 'Fudge de Chocolate Belga com Macadâmias',
      imagem: 'assets/orcamento/doces-finos/fudge-belga-macadamia.jpg',
      precoUnitario: 6,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'macarons-gourmet',
      nome: 'Macarons Gourmet',
      imagem: 'assets/orcamento/doces-finos/macarons-gourmet.jpg',
      precoUnitario: 4.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'tartelete-limao-siciliano',
      nome: 'Mini Tartelete de Limão Siciliano com Merengue Suíço',
      imagem: 'assets/orcamento/doces-finos/tartelete-limao-siciliano.jpg',
      precoUnitario: 7.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    },
    {
      id: 'pao-de-mel-fino',
      nome: 'Pão de Mel Fino com Banho de Chocolate Decorado',
      imagem: 'assets/orcamento/doces-finos/pao-de-mel-fino.jpg',
      precoUnitario: 5.5,
      quantidadeMinima: 25,
      incremento: 5,
      categoria: 'fino',
      linha: 'premium',
      quantidade: 0
    }
  ];

  salgadinhos: Salgadinho[] = [
    {
      id: 'coxinha-frango',
      nome: 'Coxinha de Frango',
      imagem: 'assets/orcamento/salgadinhos/coxinha-frango.jpg',
      precoUnitario: 0.85,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'risole-carne',
      nome: 'Risole de Carne',
      imagem: 'assets/orcamento/salgadinhos/risole-carne.jpg',
      precoUnitario: 0.9,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'risole-queijo',
      nome: 'Risole de Queijo',
      imagem: 'assets/orcamento/salgadinhos/risole-queijo.jpg',
      precoUnitario: 0.9,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'bolinha-queijo',
      nome: 'Bolinha de Queijo',
      imagem: 'assets/orcamento/salgadinhos/bolinha-queijo.jpg',
      precoUnitario: 0.95,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'quibe',
      nome: 'Quibe',
      imagem: 'assets/orcamento/salgadinhos/quibe.jpg',
      precoUnitario: 1,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'croquete-carne',
      nome: 'Croquete de Carne',
      imagem: 'assets/orcamento/salgadinhos/croquete-carne.jpg',
      precoUnitario: 0.9,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'empada-frango',
      nome: 'Empada de Frango',
      imagem: 'assets/orcamento/salgadinhos/empada-frango.jpg',
      precoUnitario: 1.1,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'pastel-assado-carne',
      nome: 'Pastel Assado de Carne',
      imagem: 'assets/orcamento/salgadinhos/pastel-assado-carne.jpg',
      precoUnitario: 0.9,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'esfiha-carne',
      nome: 'Esfiha de Carne',
      imagem: 'assets/orcamento/salgadinhos/esfiha-carne.jpg',
      precoUnitario: 0.95,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'mini-cachorro-quente',
      nome: 'Mini Cachorro Quente',
      imagem: 'assets/orcamento/salgadinhos/mini-cachorro-quente.jpg',
      precoUnitario: 1.2,
      quantidadeMinima: 50,
      incremento: 10,
      categoria: 'tradicional',
      linha: 'classica'
    },
    {
      id: 'camarao-empanado-catupiry',
      nome: 'Camarão Empanado com Catupiry',
      imagem: 'assets/orcamento/salgadinhos/camarao-empanado-catupiry.jpg',
      precoUnitario: 5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'sofisticado',
      linha: 'premium'
    },
    {
      id: 'risole-camarao-catupiry',
      nome: 'Risole de Camarão com Catupiry',
      imagem: 'assets/orcamento/salgadinhos/risole-camarao-catupiry.jpg',
      precoUnitario: 3.5,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'sofisticado',
      linha: 'premium'
    },
    {
      id: 'mini-quiche-alho-poro-bacon',
      nome: 'Mini Quiche de Alho-Poró com Bacon',
      imagem: 'assets/orcamento/salgadinhos/mini-quiche-alho-poro-bacon.jpg',
      precoUnitario: 4.25,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'sofisticado',
      linha: 'premium'
    },
    {
      id: 'espetinho-file-mignon-madeira',
      nome: 'Espetinho de Filé Mignon ao Molho Madeira',
      imagem: 'assets/orcamento/salgadinhos/espetinho-file-mignon.jpg',
      precoUnitario: 6,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'sofisticado',
      linha: 'premium'
    },
    {
      id: 'coxinha-costela-paprica',
      nome: 'Coxinha de Costela com Páprica Defumada',
      imagem: 'assets/orcamento/salgadinhos/coxinha-costela.jpg',
      precoUnitario: 4.25,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'sofisticado',
      linha: 'premium'
    },
    {
      id: 'mini-bruschetta-tomate-seco-brie',
      nome: 'Mini Bruschetta de Tomate Seco com Brie',
      imagem: 'assets/orcamento/salgadinhos/mini-bruschetta-brie.jpg',
      precoUnitario: 4.75,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'sofisticado',
      linha: 'premium'
    },
    {
      id: 'mini-croissant-brie-damasco',
      nome: 'Mini Croissant de Brie com Damasco',
      imagem: 'assets/orcamento/salgadinhos/mini-croissant-brie-damasco.jpg',
      precoUnitario: 5.25,
      quantidadeMinima: 20,
      incremento: 5,
      categoria: 'sofisticado',
      linha: 'premium'
    }
  ];

  configuracaoBebidas: ConfiguracaoBebidas = {
    modo: 'inclusa',
    itensInclusos: ['Água', 'Refrigerante', 'Suco'],
    bebidasExtras: [
      {
        id: 'cerveja',
        nome: 'Cerveja',
        categoria: 'cerveja',
        precoUnitario: 9,
        quantidadeMinima: 12,
        incremento: 6
      },
      {
        id: 'espumante',
        nome: 'Espumante',
        categoria: 'espumante',
        precoUnitario: 16,
        quantidadeMinima: 10,
        incremento: 5
      },
      {
        id: 'drink-autoral',
        nome: 'Drink Autoral',
        categoria: 'drink',
        precoUnitario: 22,
        quantidadeMinima: 10,
        incremento: 5
      },
      {
        id: 'vinho',
        nome: 'Vinho',
        categoria: 'vinho',
        precoUnitario: 65,
        quantidadeMinima: 2,
        incremento: 1
      },
      {
        id: 'energetico',
        nome: 'Energético',
        categoria: 'energetico',
        precoUnitario: 12,
        quantidadeMinima: 6,
        incremento: 6
      }
    ],
    taxaRolha: 25,
    observacoesRolha: 'Vale para vinhos e espumantes trazidos pelo cliente.'
  };

  itensDecoracao: ItemDecoracao[] = [
    {
      id: 'arco-balao-classico',
      categoria: 'balao',
      nome: 'Arco de Balões Clássico',
      imagem: 'assets/orcamento/decoracao/arco-balao-classico.jpg',
      descricaoCurta: 'Arco de balões em até 2 cores, montado no local no dia do evento.',
      itensInclusos: ['Balões nas cores escolhidas', 'Estrutura de sustentação', 'Montagem no local'],
      itensNaoInclusos: ['Hélio', 'Balões metalizados especiais', 'Personagens licenciados'],
      fornecimento: 'parceiro',
      precoUnitario: 90,
      unidadeMedida: 'metro',
      quantidadeMinima: 3,
      incremento: 1
    },
    {
      id: 'painel-baloes',
      categoria: 'balao',
      nome: 'Painel com Balões',
      imagem: 'assets/orcamento/decoracao/painel-baloes.jpg',
      descricaoCurta: 'Painel decorativo com composição de balões para fotos e mesa principal.',
      itensInclusos: ['Balões em cores combinadas', 'Montagem no local', 'Composição visual para fotos'],
      itensNaoInclusos: ['Painel 3D personalizado', 'Personagens licenciados', 'Iluminação especial'],
      fornecimento: 'parceiro',
      precoUnitario: 350,
      unidadeMedida: 'pacote',
      quantidadeMinima: 1,
      incremento: 1
    },
    {
      id: 'coluna-baloes',
      categoria: 'balao',
      nome: 'Coluna de Balões',
      imagem: 'assets/orcamento/decoracao/coluna-baloes.jpg',
      descricaoCurta: 'Coluna decorativa de balões para entrada, salão ou mesa principal.',
      itensInclusos: ['Balões nas cores escolhidas', 'Base de sustentação', 'Montagem no local'],
      itensNaoInclusos: ['Hélio', 'Balões personalizados', 'Retirada fora do horário combinado'],
      fornecimento: 'parceiro',
      precoUnitario: 120,
      unidadeMedida: 'unidade',
      quantidadeMinima: 2,
      incremento: 1
    },
    {
      id: 'cenografia-tematica',
      categoria: 'cenografia',
      nome: 'Cenografia Temática Personalizada',
      imagem: 'assets/orcamento/decoracao/cenografia-tematica.jpg',
      descricaoCurta: 'Ambientação temática completa do salão, sob orçamento conforme o tema escolhido.',
      itensInclusos: ['Projeto de ambientação', 'Elementos cenográficos', 'Montagem e desmontagem'],
      itensNaoInclusos: ['Mobiliário especial', 'Iluminação cênica', 'Itens fora do tema contratado'],
      fornecimento: 'parceiro',
      precoUnitario: 0,
      unidadeMedida: 'pacote',
      quantidadeMinima: 1,
      incremento: 1,
      sobOrcamento: true,
      precoReferencia: 'a partir de R$ 800,00'
    },
    {
      id: 'painel-3d-personalizado',
      categoria: 'cenografia',
      nome: 'Painel 3D Personalizado',
      imagem: 'assets/orcamento/decoracao/painel-3d-personalizado.jpg',
      descricaoCurta: 'Painel cenográfico personalizado para tema infantil, 15 anos, casamento ou evento corporativo.',
      itensInclusos: ['Criação visual do painel', 'Estrutura decorativa', 'Montagem no local'],
      itensNaoInclusos: ['Personagens licenciados', 'Iluminação especial', 'Mobiliário extra'],
      fornecimento: 'parceiro',
      precoUnitario: 0,
      unidadeMedida: 'pacote',
      quantidadeMinima: 1,
      incremento: 1,
      sobOrcamento: true,
      precoReferencia: 'a partir de R$ 600,00'
    },
    {
      id: 'iluminacao-cenica',
      categoria: 'iluminacao',
      nome: 'Pacote de Iluminação Cênica',
      imagem: 'assets/orcamento/decoracao/iluminacao-cenica.jpg',
      descricaoCurta: 'Iluminação para destacar a pista, mesa principal e ambiente do evento.',
      itensInclusos: ['Canhões de luz', 'Efeitos de iluminação', 'Instalação no local'],
      itensNaoInclusos: ['Gerador de energia', 'Sonorização', 'Operador exclusivo, se não informado no contrato'],
      fornecimento: 'parceiro',
      precoUnitario: 450,
      unidadeMedida: 'diaria',
      quantidadeMinima: 1,
      incremento: 1
    },
    {
      id: 'maquina-fumaca',
      categoria: 'iluminacao',
      nome: 'Máquina de Fumaça',
      imagem: 'assets/orcamento/decoracao/maquina-fumaca.jpg',
      descricaoCurta: 'Efeito de fumaça para pista de dança, entrada especial ou momento do parabéns.',
      itensInclusos: ['Máquina de fumaça', 'Fluido básico', 'Instalação no local'],
      itensNaoInclusos: ['Operação contínua durante todo o evento', 'Reposição extra de fluido'],
      fornecimento: 'parceiro',
      precoUnitario: 180,
      unidadeMedida: 'diaria',
      quantidadeMinima: 1,
      incremento: 1
    },
    {
      id: 'personalizacao-digital',
      categoria: 'personalizacao',
      nome: 'Kit de Personalização — Arquivo Digital',
      imagem: 'assets/orcamento/decoracao/personalizacao-digital.jpg',
      descricaoCurta: 'Você recebe os arquivos digitais e providencia impressão e montagem.',
      itensInclusos: ['Arte digital no tema escolhido', 'Arquivos em alta resolução'],
      itensNaoInclusos: ['Impressão física', 'Material', 'Montagem no local'],
      fornecimento: 'casa',
      nivelPersonalizacao: 'digital',
      precoUnitario: 35,
      unidadeMedida: 'pacote',
      quantidadeMinima: 1,
      incremento: 1
    },
    {
      id: 'personalizacao-material',
      categoria: 'personalizacao',
      nome: 'Kit de Personalização — Material Pronto',
      imagem: 'assets/orcamento/decoracao/personalizacao-material.jpg',
      descricaoCurta: 'Material impresso e recortado entregue antes do evento.',
      itensInclusos: ['Material impresso', 'Recorte dos itens', 'Entrega antes do evento'],
      itensNaoInclusos: ['Montagem no local', 'Reposição em caso de dano'],
      fornecimento: 'casa',
      nivelPersonalizacao: 'prontoMontar',
      precoUnitario: 80,
      unidadeMedida: 'pacote',
      quantidadeMinima: 1,
      incremento: 1
    },
    {
      id: 'personalizacao-all-inclusive',
      categoria: 'personalizacao',
      nome: 'Kit de Personalização — All Inclusive',
      imagem: 'assets/orcamento/decoracao/personalizacao-all-inclusive.jpg',
      descricaoCurta: 'Tudo pronto e montado no local antes da festa começar.',
      itensInclusos: ['Material personalizado', 'Montagem completa no local', 'Equipe própria no dia do evento'],
      itensNaoInclusos: ['Alterações de última hora', 'Itens fora do tema contratado'],
      fornecimento: 'casa',
      nivelPersonalizacao: 'allInclusive',
      precoUnitario: 220,
      unidadeMedida: 'pacote',
      quantidadeMinima: 1,
      incremento: 1
    },
    {
      id: 'mesa-cadeira-padrao',
      categoria: 'mobiliario',
      nome: 'Mesa + 4 Cadeiras Padrão',
      imagem: 'assets/orcamento/decoracao/mesa-cadeira-padrao.jpg',
      descricaoCurta: 'Conjunto básico de mesa com 4 cadeiras para convidados.',
      itensInclusos: ['1 mesa', '4 cadeiras', 'Montagem prévia'],
      itensNaoInclusos: ['Toalha decorada', 'Capa de cadeira', 'Mobiliário premium'],
      fornecimento: 'casa',
      precoUnitario: 20,
      unidadeMedida: 'unidade',
      quantidadeMinima: 5,
      incremento: 1
    },
    {
      id: 'moveis-provencais',
      categoria: 'mobiliario',
      nome: 'Móveis Provençais',
      imagem: 'assets/orcamento/decoracao/moveis-provencais.jpg',
      descricaoCurta: 'Móveis decorativos para mesa principal, doces, lembrancinhas ou cenário de fotos.',
      itensInclusos: ['Conjunto de móveis decorativos', 'Montagem no local', 'Organização visual básica'],
      itensNaoInclusos: ['Decoração floral', 'Personalização temática', 'Transporte fora da região combinada'],
      fornecimento: 'parceiro',
      precoUnitario: 350,
      unidadeMedida: 'pacote',
      quantidadeMinima: 1,
      incremento: 1
    }
  ];

  itensMusicaAnimacao: ItemMusicaAnimacao[] = [
    {
      id: 'dj-musica',
      categoria: 'musica',
      nome: 'DJ & Música',
      imagem: 'assets/orcamento/musica-animacao/dj-musica.jpg',
      descricaoCurta: 'DJ profissional 6h',
      itensInclusos: [],
      itensNaoInclusos: [],
      preco: 800,
      duracaoHoras: 6,
      selecionado: false
    },
    {
      id: 'animadores',
      categoria: 'animacao',
      nome: 'Animadores',
      imagem: 'assets/orcamento/musica-animacao/animadores.jpg',
      descricaoCurta: 'Equipe de entretenimento',
      itensInclusos: [],
      itensNaoInclusos: [],
      preco: 1200,
      duracaoHoras: 6,
      selecionado: false
    },
    {
      id: 'fotografia',
      categoria: 'experiencia',
      nome: 'Fotografia',
      imagem: 'assets/orcamento/musica-animacao/fotografia.jpg',
      descricaoCurta: 'Fotógrafo profissional',
      itensInclusos: [],
      itensNaoInclusos: [],
      preco: 1500,
      duracaoHoras: 6,
      selecionado: false
    },
    {
      id: 'bartender',
      categoria: 'show',
      nome: 'Bartender',
      imagem: 'assets/orcamento/musica-animacao/bartender.jpg',
      descricaoCurta: 'Open bar premium',
      itensInclusos: [],
      itensNaoInclusos: [],
      preco: 650,
      duracaoHoras: 6,
      selecionado: false
    }
  ];

  ngOnInit(): void {
    this.inicializarQuantidadesBebidas();
    this.inicializarEstadoDecoracao();
    this.inicializarEstadoMusicaAnimacao();
  }

  get categoriasServico(): string[] {
    return [...new Set(this.servicos.map(servico => servico.categoria))];
  }

  get ehEventoInfantil(): boolean {
    return this.tipoEvento === 'Infantil';
  }

  get ehEventoQuinzeAnos(): boolean {
    return this.tipoEvento === '15 Anos';
  }

  get ehEventoTematico(): boolean {
    return this.tipoEvento === 'Temático';
  }

  get ehEventoComTemaDePasta(): boolean {
    return this.tipoEvento === 'Casamento' || this.tipoEvento === 'Floral' || this.tipoEvento === 'Corporativo';
  }

  get temasPastasEventoAtual(): TemaPastaEvento[] {
    if (!this.ehEventoComTemaDePasta) {
      return [];
    }

    return this.temasPastasEvento.filter(tema => tema.evento === this.tipoEvento);
  }

  get temasTematicosDisponiveis(): OrcamentoResumoItem[] {
    const temasDisponiveis: OrcamentoResumoItem[] = [];
    const chaves = new Set<string>();

    const fontes: OrcamentoResumoItem[][] = [
      this.temasInfantis,
      this.temasQuinzeAnos,
      this.temasPastasEvento
    ];

    for (const fonte of fontes) {
      for (const tema of fonte) {
        const chave = this.normalizarChaveTema(tema.nome);

        if (chaves.has(chave)) {
          continue;
        }

        chaves.add(chave);
        temasDisponiveis.push(tema);
      }
    }

    return temasDisponiveis;
  }

  get temasInfantisFiltrados(): TemaInfantil[] {
    if (this.temaInfantilFiltroAtual === 'todos') {
      return this.temasInfantis;
    }

    return this.temasInfantis.filter(tema => tema.genero === this.temaInfantilFiltroAtual);
  }

  get docinhosClassicos(): Docinho[] {
    const docinhosDaLinhaClassica = this.docinhos.filter(docinho => docinho.linha === 'classica');

    if (this.docinhoFiltroAtual === 'todos') {
      return docinhosDaLinhaClassica;
    }

    return docinhosDaLinhaClassica.filter(docinho => docinho.categoria === this.docinhoFiltroAtual);
  }

  get docesFinos(): Docinho[] {
    return this.docinhos.filter(docinho => docinho.linha === 'premium');
  }

  get docinhosFiltrados(): Docinho[] {
    return this.docinhosClassicos;
  }

  get docinhosSelecionados(): Docinho[] {
    return this.docinhos.filter(docinho => docinho.quantidade > 0);
  }

  get docinhosClassicosSelecionados(): Docinho[] {
    return this.docinhosSelecionados.filter(docinho => docinho.linha === 'classica');
  }

  get docesFinosSelecionados(): Docinho[] {
    return this.docinhosSelecionados.filter(docinho => docinho.linha === 'premium');
  }

  get totalUnidadesDocinhosClassicos(): number {
    return this.docinhosClassicosSelecionados.reduce((total, docinho) => total + docinho.quantidade, 0);
  }

  get totalValorDocinhosClassicos(): number {
    return this.docinhosClassicosSelecionados.reduce((total, docinho) => total + this.subtotalDocinho(docinho), 0);
  }

  get totalUnidadesDocesFinos(): number {
    return this.docesFinosSelecionados.reduce((total, docinho) => total + docinho.quantidade, 0);
  }

  get totalValorDocesFinos(): number {
    return this.docesFinosSelecionados.reduce((total, docinho) => total + this.subtotalDocinho(docinho), 0);
  }

  get totalUnidadesDocinhos(): number {
    return this.docinhosSelecionados.reduce((total, docinho) => total + docinho.quantidade, 0);
  }

  get totalValorDocinhos(): number {
    return this.docinhosSelecionados.reduce((total, docinho) => total + this.subtotalDocinho(docinho), 0);
  }

  get salgadinhosTradicionais(): Salgadinho[] {
    return this.salgadinhos.filter(salgadinho => salgadinho.linha === 'classica');
  }

  get salgadosSofisticados(): Salgadinho[] {
    return this.salgadinhos.filter(salgadinho => salgadinho.linha === 'premium');
  }

  get salgadinhosSelecionados(): Salgadinho[] {
    return this.salgadinhos.filter(salgadinho => this.quantidadeSalgadinho(salgadinho) > 0);
  }

  get salgadinhosTradicionaisSelecionados(): Salgadinho[] {
    return this.salgadinhosSelecionados.filter(salgadinho => salgadinho.linha === 'classica');
  }

  get salgadosSofisticadosSelecionados(): Salgadinho[] {
    return this.salgadinhosSelecionados.filter(salgadinho => salgadinho.linha === 'premium');
  }

  get totalUnidadesSalgadinhosTradicionais(): number {
    return this.salgadinhosTradicionaisSelecionados.reduce(
      (total, salgadinho) => total + this.quantidadeSalgadinho(salgadinho),
      0
    );
  }

  get totalValorSalgadinhosTradicionais(): number {
    return this.salgadinhosTradicionaisSelecionados.reduce(
      (total, salgadinho) => total + this.subtotalSalgadinho(salgadinho),
      0
    );
  }

  get totalUnidadesSalgadosSofisticados(): number {
    return this.salgadosSofisticadosSelecionados.reduce(
      (total, salgadinho) => total + this.quantidadeSalgadinho(salgadinho),
      0
    );
  }

  get totalValorSalgadosSofisticados(): number {
    return this.salgadosSofisticadosSelecionados.reduce(
      (total, salgadinho) => total + this.subtotalSalgadinho(salgadinho),
      0
    );
  }

  get totalUnidadesSalgadinhos(): number {
    return this.salgadinhosSelecionados.reduce(
      (total, salgadinho) => total + this.quantidadeSalgadinho(salgadinho),
      0
    );
  }

  get totalValorSalgadinhos(): number {
    return this.salgadinhosSelecionados.reduce(
      (total, salgadinho) => total + this.subtotalSalgadinho(salgadinho),
      0
    );
  }

  bebidasAtivas(): Bebida[] {
    return this.configuracaoBebidas.bebidasExtras ?? [];
  }

  get bebidasSelecionadas(): BebidaSelecionada[] {
    return this.bebidasAtivas()
      .map(bebida => {
        const quantidade = this.quantidadeBebida(bebida);

        return {
          bebidaId: bebida.id,
          nome: bebida.nome,
          quantidade,
          precoUnitario: bebida.precoUnitario,
          subtotal: quantidade * bebida.precoUnitario
        };
      })
      .filter(bebidaSelecionada => bebidaSelecionada.quantidade > 0);
  }

  get totalBebidas(): number {
    return this.bebidasSelecionadas.reduce((total, bebida) => total + bebida.subtotal, 0);
  }

  get totalTaxaRolha(): number {
    if (this.configuracaoBebidas.modo !== 'trazPropia' || !this.trazPropiaConfirmado) {
      return 0;
    }

    return this.configuracaoBebidas.taxaRolha ?? 0;
  }

  itensDecoracaoPorCategoria(categoria: CategoriaDecoracao): ItemDecoracao[] {
    return this.itensDecoracao.filter(item => item.categoria === categoria);
  }

  get decoracaoSelecionada(): ItemDecoracaoSelecionado[] {
    return this.itensDecoracao
      .filter(item => !item.sobOrcamento && this.quantidadeDecoracao(item) > 0)
      .map(item => ({
        itemId: item.id,
        nome: item.nome,
        quantidade: this.quantidadeDecoracao(item),
        precoUnitario: item.precoUnitario,
        subtotal: this.subtotalDecoracao(item),
        unidadeMedida: item.unidadeMedida
      }));
  }

  get itensDecoracaoAguardandoOrcamento(): SolicitacaoDecoracao[] {
    return this.itensDecoracao
      .filter(item => item.sobOrcamento && this.solicitacoesDecoracao[item.id]?.solicitado)
      .map(item => this.solicitacoesDecoracao[item.id]);
  }

  get totalDecoracao(): number {
    return this.decoracaoSelecionada.reduce((total, item) => total + item.subtotal, 0);
  }

  itensMusicaAnimacaoPorCategoria(categoria: CategoriaMusicaAnimacao): ItemMusicaAnimacao[] {
    return this.itensMusicaAnimacao.filter(item => item.categoria === categoria);
  }

  get musicaAnimacaoSelecionados(): ItemMusicaAnimacao[] {
    return this.itensMusicaAnimacao.filter(item => item.selecionado);
  }

  get totalMusicaAnimacao(): number {
    return this.musicaAnimacaoSelecionados.reduce((total, item) => total + item.preco, 0);
  }

  get temItensNoResumo(): boolean {
    return (
      this.itensSelecionados.length > 0 ||
      this.docinhosSelecionados.length > 0 ||
      this.salgadinhosSelecionados.length > 0 ||
      this.bebidasSelecionadas.length > 0 ||
      this.totalTaxaRolha > 0 ||
      this.decoracaoSelecionada.length > 0 ||
      this.itensDecoracaoAguardandoOrcamento.length > 0 ||
      this.musicaAnimacaoSelecionados.length > 0
    );
  }

  servicosPorCategoria(categoria: string): BudgetItem[] {
    return this.servicos.filter(servico => servico.categoria === categoria);
  }

  get temaSelecionado(): OrcamentoResumoItem | undefined {
    if (this.ehEventoInfantil) {
      return this.temasInfantis.find(tema => tema.selecionado);
    }

    if (this.ehEventoQuinzeAnos) {
      return this.temasQuinzeAnos.find(tema => tema.selecionado);
    }

    if (this.ehEventoTematico) {
      return this.temasTematicosDisponiveis.find(tema => tema.selecionado);
    }

    if (this.ehEventoComTemaDePasta) {
      return this.temasPastasEvento.find(tema => tema.evento === this.tipoEvento && tema.selecionado);
    }

    return this.todosOsTemasSelecionados()[0];
  }

  get itensSelecionados(): OrcamentoResumoItem[] {
    const tema = this.temaSelecionado ? [this.temaSelecionado] : [];
    const servicos = this.servicos.filter(servico => servico.selecionado);
    return [...tema, ...servicos];
  }

  get subtotal(): number {
    const subtotalServicos = this.itensSelecionados.reduce((total, item) => total + item.preco, 0);
    return subtotalServicos + this.totalValorDocinhos + this.totalValorSalgadinhos + this.totalBebidas + this.totalTaxaRolha + this.totalDecoracao + this.totalMusicaAnimacao;
  }

  get taxaServico(): number {
    return this.subtotal * 0.05;
  }

  get total(): number {
    return this.subtotal + this.taxaServico;
  }

  get larguraProgresso(): string {
    return `${(this.etapaAtual / 4) * 100}%`;
  }

  irParaEtapa(etapa: number): void {
    this.etapaAtual = etapa;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selecionarTipoEvento(tipo: string): void {
    const temaAtual = this.temaSelecionado;
    this.tipoEvento = tipo;

    if (tipo === 'Infantil') {
      this.temaInfantilFiltroAtual = 'todos';
      this.irParaEtapa(2);
      return;
    }

    if (tipo === '15 Anos') {
      this.irParaEtapa(2);
      return;
    }

    if (tipo === 'Temático') {
      this.normalizarSelecaoTematica(temaAtual);
      this.irParaEtapa(2);
    }
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

  atualizarFaixaPreco(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.faixaPreco = select.value;
  }

  selecionarTema(temaSelecionado: OrcamentoResumoItem): void {
    if (this.ehEventoInfantil) {
      this.temasInfantis = this.temasInfantis.map(tema => ({
        ...tema,
        selecionado: tema.id === temaSelecionado.id
      }));
      return;
    }

    if (this.ehEventoQuinzeAnos) {
      this.temasQuinzeAnos = this.temasQuinzeAnos.map(tema => ({
        ...tema,
        selecionado: tema.id === temaSelecionado.id
      }));
      return;
    }

    if (this.ehEventoTematico) {
      this.normalizarSelecaoTematica(temaSelecionado);
      return;
    }

    if (this.ehEventoComTemaDePasta) {
      this.temasPastasEvento = this.temasPastasEvento.map(tema => ({
        ...tema,
        selecionado: tema.evento === this.tipoEvento ? tema.id === temaSelecionado.id : tema.selecionado
      }));
      return;
    }

    this.normalizarSelecaoTematica(temaSelecionado);
  }

  selecionarFiltroTemaInfantil(filtro: TemaInfantilFiltro): void {
    this.temaInfantilFiltroAtual = filtro;
  }

  alternarServico(servico: BudgetItem): void {
    if (servico.obrigatorio) {
      servico.selecionado = true;
      return;
    }

    servico.selecionado = !servico.selecionado;
  }

  selecionarFiltroDocinho(filtro: DocinhoFilter): void {
    this.docinhoFiltroAtual = filtro;
  }

  private normalizarSelecaoTematica(temaPreferido?: OrcamentoResumoItem): void {
    const temasSelecionados = this.todosOsTemasSelecionados();
    const temaSelecionado = temaPreferido
      ? this.temasTematicosDisponiveis.find(tema => this.normalizarChaveTema(tema.nome) === this.normalizarChaveTema(temaPreferido.nome))
      : this.temasTematicosDisponiveis.find(temaTematico =>
          temasSelecionados.some(temaAtual => this.normalizarChaveTema(temaAtual.nome) === this.normalizarChaveTema(temaTematico.nome))
        );

    this.limparSelecoesTemas();

    if (!temaSelecionado) {
      return;
    }

    this.marcarTemaSelecionado(temaSelecionado);
  }

  private todosOsTemasSelecionados(): OrcamentoResumoItem[] {
    return [
      ...this.temasInfantis.filter(tema => tema.selecionado),
      ...this.temasQuinzeAnos.filter(tema => tema.selecionado),
      ...this.temasPastasEvento.filter(tema => tema.selecionado)
    ];
  }

  private limparSelecoesTemas(): void {
    this.temasInfantis = this.temasInfantis.map(tema => ({ ...tema, selecionado: false }));
    this.temasQuinzeAnos = this.temasQuinzeAnos.map(tema => ({ ...tema, selecionado: false }));
    this.temasPastasEvento = this.temasPastasEvento.map(tema => ({ ...tema, selecionado: false }));
  }

  private marcarTemaSelecionado(temaSelecionado: OrcamentoResumoItem): void {
    this.temasInfantis = this.temasInfantis.map(tema => ({
      ...tema,
      selecionado: tema.id === temaSelecionado.id
    }));

    this.temasQuinzeAnos = this.temasQuinzeAnos.map(tema => ({
      ...tema,
      selecionado: tema.id === temaSelecionado.id
    }));

    this.temasPastasEvento = this.temasPastasEvento.map(tema => ({
      ...tema,
      selecionado: tema.id === temaSelecionado.id
    }));
  }

  private normalizarChaveTema(nome: string): string {
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  incrementarDocinho(docinho: Docinho): void {
    if (docinho.quantidade === 0) {
      docinho.quantidade = docinho.quantidadeMinima;
      return;
    }

    docinho.quantidade += docinho.incremento;
  }

  decrementarDocinho(docinho: Docinho): void {
    if (docinho.quantidade <= docinho.quantidadeMinima) {
      docinho.quantidade = 0;
      return;
    }

    docinho.quantidade = Math.max(0, docinho.quantidade - docinho.incremento);
  }

  subtotalDocinho(docinho: Docinho): number {
    return docinho.quantidade * docinho.precoUnitario;
  }

  limparDocinho(docinho: Docinho): void {
    docinho.quantidade = 0;
  }

  quantidadeSalgadinho(salgadinho: Salgadinho): number {
    return this.quantidadesSalgadinhos[salgadinho.id] ?? 0;
  }

  incrementarSalgadinho(salgadinho: Salgadinho): void {
    const quantidadeAtual = this.quantidadeSalgadinho(salgadinho);

    if (quantidadeAtual === 0) {
      this.quantidadesSalgadinhos[salgadinho.id] = salgadinho.quantidadeMinima;
      return;
    }

    this.quantidadesSalgadinhos[salgadinho.id] = quantidadeAtual + salgadinho.incremento;
  }

  decrementarSalgadinho(salgadinho: Salgadinho): void {
    const quantidadeAtual = this.quantidadeSalgadinho(salgadinho);

    if (quantidadeAtual <= salgadinho.quantidadeMinima) {
      delete this.quantidadesSalgadinhos[salgadinho.id];
      return;
    }

    this.quantidadesSalgadinhos[salgadinho.id] = Math.max(0, quantidadeAtual - salgadinho.incremento);
  }

  subtotalSalgadinho(salgadinho: Salgadinho): number {
    return this.quantidadeSalgadinho(salgadinho) * salgadinho.precoUnitario;
  }

  limparSalgadinho(salgadinho: Salgadinho): void {
    delete this.quantidadesSalgadinhos[salgadinho.id];
  }

  quantidadeBebida(bebida: Bebida): number {
    return this.quantidadesBebidas[bebida.id] ?? 0;
  }

  incrementarBebida(bebida: Bebida): void {
    const quantidadeAtual = this.quantidadeBebida(bebida);

    if (quantidadeAtual === 0) {
      this.quantidadesBebidas[bebida.id] = bebida.quantidadeMinima;
      return;
    }

    this.quantidadesBebidas[bebida.id] = quantidadeAtual + bebida.incremento;
  }

  decrementarBebida(bebida: Bebida): void {
    const quantidadeAtual = this.quantidadeBebida(bebida);

    if (quantidadeAtual <= bebida.quantidadeMinima) {
      this.quantidadesBebidas[bebida.id] = 0;
      return;
    }

    this.quantidadesBebidas[bebida.id] = Math.max(0, quantidadeAtual - bebida.incremento);
  }

  subtotalBebida(bebida: Bebida): number {
    return this.quantidadeBebida(bebida) * bebida.precoUnitario;
  }

  limparBebida(bebidaId: string): void {
    this.quantidadesBebidas[bebidaId] = 0;
  }

  toggleTrazPropia(): void {
    this.trazPropiaConfirmado = !this.trazPropiaConfirmado;
  }

  quantidadeDecoracao(item: ItemDecoracao): number {
    return this.quantidadesDecoracao[item.id] ?? 0;
  }

  toggleDetalhesDecoracao(item: ItemDecoracao): void {
    this.decoracaoExpandida[item.id] = !this.decoracaoExpandida[item.id];
  }

  incrementarDecoracao(item: ItemDecoracao): void {
    const quantidadeAtual = this.quantidadeDecoracao(item);

    if (quantidadeAtual === 0) {
      this.quantidadesDecoracao[item.id] = item.quantidadeMinima;
      return;
    }

    this.quantidadesDecoracao[item.id] = quantidadeAtual + item.incremento;
  }

  decrementarDecoracao(item: ItemDecoracao): void {
    const quantidadeAtual = this.quantidadeDecoracao(item);

    if (quantidadeAtual <= item.quantidadeMinima) {
      this.quantidadesDecoracao[item.id] = 0;
      return;
    }

    this.quantidadesDecoracao[item.id] = Math.max(0, quantidadeAtual - item.incremento);
  }

  subtotalDecoracao(item: ItemDecoracao): number {
    if (item.sobOrcamento) {
      return 0;
    }

    return this.quantidadeDecoracao(item) * item.precoUnitario;
  }

  toggleSolicitarDecoracao(item: ItemDecoracao): void {
    if (!this.solicitacoesDecoracao[item.id]) {
      this.solicitacoesDecoracao[item.id] = {
        itemId: item.id,
        nome: item.nome,
        observacoes: '',
        solicitado: false
      };
    }

    this.solicitacoesDecoracao[item.id].solicitado = !this.solicitacoesDecoracao[item.id].solicitado;
  }

  atualizarObservacaoDecoracao(item: ItemDecoracao, texto: string): void {
    if (!this.solicitacoesDecoracao[item.id]) {
      this.solicitacoesDecoracao[item.id] = {
        itemId: item.id,
        nome: item.nome,
        observacoes: '',
        solicitado: false
      };
    }

    this.solicitacoesDecoracao[item.id].observacoes = texto;
  }

  limparDecoracao(itemId: string): void {
    this.quantidadesDecoracao[itemId] = 0;
  }

  cancelarSolicitacaoDecoracao(itemId: string): void {
    if (!this.solicitacoesDecoracao[itemId]) {
      return;
    }

    this.solicitacoesDecoracao[itemId].solicitado = false;
  }

  toggleMusicaAnimacao(item: ItemMusicaAnimacao): void {
    item.selecionado = !item.selecionado;
  }

  toggleDetalhesMusicaAnimacao(item: ItemMusicaAnimacao): void {
    this.musicaAnimacaoExpandida[item.id] = !this.musicaAnimacaoExpandida[item.id];
  }

  private inicializarQuantidadesBebidas(): void {
    this.quantidadesBebidas = {};

    for (const bebida of this.bebidasAtivas()) {
      this.quantidadesBebidas[bebida.id] = 0;
    }
  }

  private inicializarEstadoDecoracao(): void {
    this.quantidadesDecoracao = {};
    this.decoracaoExpandida = {};
    this.solicitacoesDecoracao = {};

    for (const item of this.itensDecoracao) {
      this.quantidadesDecoracao[item.id] = 0;
      this.decoracaoExpandida[item.id] = false;

      if (item.sobOrcamento) {
        this.solicitacoesDecoracao[item.id] = {
          itemId: item.id,
          nome: item.nome,
          observacoes: '',
          solicitado: false
        };
      }
    }
  }

  private inicializarEstadoMusicaAnimacao(): void {
    this.musicaAnimacaoExpandida = {};

    for (const item of this.itensMusicaAnimacao) {
      item.selecionado = false;
      this.musicaAnimacaoExpandida[item.id] = false;
    }
  }

  removerItem(item: OrcamentoResumoItem): void {
    if (item.obrigatorio) return;

    if (item.categoria === 'Tema') {
      if (this.temasInfantis.some(tema => tema.id === item.id)) {
        this.temasInfantis = this.temasInfantis.map(tema => ({ ...tema, selecionado: false }));
        return;
      }

      if (this.temasQuinzeAnos.some(tema => tema.id === item.id)) {
        this.temasQuinzeAnos = this.temasQuinzeAnos.map(tema => ({ ...tema, selecionado: false }));
        return;
      }

      if (this.temasPastasEvento.some(tema => tema.id === item.id && tema.evento === this.tipoEvento)) {
        this.temasPastasEvento = this.temasPastasEvento.map(tema =>
          tema.id === item.id && tema.evento === this.tipoEvento ? { ...tema, selecionado: false } : tema
        );
        return;
      }

      return;
    }

    const servico = this.servicos.find(servicoAtual => servicoAtual.id === item.id);
    if (servico) {
      servico.selecionado = false;
    }
  }

  salvarRascunho(): void {
    this.rascunhoSalvo = true;

    setTimeout(() => {
      this.rascunhoSalvo = false;
    }, 2000);
  }

  // ← ATUALIZADO: gera numeroPedido antes de abrir o modal
  enviarOrcamento(): void {
    this.numeroPedido = '#FP-2026-' + Math.floor(Math.random() * 90000 + 10000);
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  scrollCarousel(id: string, direcao: number): void {
    const elemento = document.getElementById(id);

    if (!elemento) return;

    elemento.scrollBy({
      left: direcao * 480,
      behavior: 'smooth'
    });
  }

  trackById(index: number, item: OrcamentoResumoItem): number | string {
    return item.id;
  }

  trackByNome(index: number, item: EventType | string): string {
    return typeof item === 'string' ? item : item.nome;
  }
}
