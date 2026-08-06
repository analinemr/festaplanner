/**
 * COMPONENTE: Conta
 *
 * Tela "Sua conta" do cliente: editar dados pessoais, ver o histórico de
 * orçamentos enviados (GET /api/orcamentos/meus) e enviar uma mensagem sobre
 * a festa realizada (POST /api/depoimentos).
 *
 * Se o visitante não estiver logado, mostra um aviso com link para o login
 * em vez de travar a tela — o mesmo padrão que já existia no mock original.
 */
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth-service';
import { UsuarioApiService, UsuarioResponse } from '../../core/services/usuario-api.service';
import { OrcamentoApiService, ApiOrcamento } from '../../core/services/orcamento-api.service';
import { DepoimentoApiService } from '../../core/services/depoimento-api.service';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './conta-component.html',
  styleUrl: './conta-component.css'
})
export class ContaComponent implements OnInit {

  // ---- PERFIL ----
  perfil = signal<UsuarioResponse | null>(null);
  carregandoPerfil = signal(false);
  erroPerfil = signal('');

  editandoDados = signal(false);
  nomeEdicao = '';
  telefoneEdicao = '';
  salvandoPerfil = signal(false);
  erroSalvarPerfil = signal('');
  perfilSalvo = signal(false);

  // ---- ORÇAMENTOS ----
  orcamentos = signal<ApiOrcamento[]>([]);
  carregandoOrcamentos = signal(false);
  erroOrcamentos = signal('');

  // ---- MENSAGEM / DEPOIMENTO ----
  mensagemTexto = '';
  referenteEvento = '';
  enviandoMensagem = signal(false);
  erroMensagem = signal('');
  mensagemEnviada = signal(false);

  readonly statusLabel: Record<string, string> = {
    RASCUNHO: 'Rascunho',
    NOVO: 'Enviado — aguardando contato',
    PENDENTE: 'Em análise',
    PRE_RESERVA: 'Pré-Reserva',
    CONFIRMADO: 'Confirmado',
    RECUSADO: 'Recusado'
  };

  readonly tipoEventoLabel: Record<string, string> = {
    CASAMENTO: 'Casamento',
    QUINZE_ANOS: '15 Anos',
    INFANTIL: 'Infantil',
    FLORAL: 'Floral',
    TEMATICO: 'Temático',
    CORPORATIVO: 'Corporativo'
  };

  constructor(
    private authService: AuthService,
    private usuarioApi: UsuarioApiService,
    private orcamentoApi: OrcamentoApiService,
    private depoimentoApi: DepoimentoApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAutenticado()) {
      return;
    }
    this.carregarPerfil();
    this.carregarOrcamentos();
  }

  get autenticado(): boolean {
    return this.authService.isAutenticado();
  }

  labelStatus(status: string): string { return this.statusLabel[status] ?? status; }
  labelTipoEvento(tipo: string): string { return this.tipoEventoLabel[tipo] ?? tipo; }

  formatarData(iso?: string): string {
    if (!iso) return '—';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // ==================== PERFIL ====================

  async carregarPerfil(): Promise<void> {
    this.carregandoPerfil.set(true);
    this.erroPerfil.set('');
    try {
      const dados = await firstValueFrom(this.usuarioApi.meuPerfil());
      this.perfil.set(dados);
      this.nomeEdicao = dados.nome;
      this.telefoneEdicao = dados.telefone ?? '';
    } catch {
      this.erroPerfil.set('Não foi possível carregar seus dados agora.');
    } finally {
      this.carregandoPerfil.set(false);
    }
  }

  iniciarEdicao(): void {
    this.editandoDados.set(true);
  }

  cancelarEdicao(): void {
    const p = this.perfil();
    this.nomeEdicao = p?.nome ?? '';
    this.telefoneEdicao = p?.telefone ?? '';
    this.editandoDados.set(false);
    this.erroSalvarPerfil.set('');
  }

  async salvarPerfil(): Promise<void> {
    if (!this.nomeEdicao.trim()) {
      this.erroSalvarPerfil.set('O nome não pode ficar em branco.');
      return;
    }
    this.salvandoPerfil.set(true);
    this.erroSalvarPerfil.set('');
    try {
      const atualizado = await firstValueFrom(
        this.usuarioApi.atualizarMeuPerfil({ nome: this.nomeEdicao, telefone: this.telefoneEdicao })
      );
      this.perfil.set(atualizado);
      this.editandoDados.set(false);
      this.perfilSalvo.set(true);
      setTimeout(() => this.perfilSalvo.set(false), 3000);
    } catch {
      this.erroSalvarPerfil.set('Não foi possível salvar agora. Tente novamente.');
    } finally {
      this.salvandoPerfil.set(false);
    }
  }

  // ==================== ORÇAMENTOS ====================

  async carregarOrcamentos(): Promise<void> {
    this.carregandoOrcamentos.set(true);
    this.erroOrcamentos.set('');
    try {
      const dados = await firstValueFrom(this.orcamentoApi.meusOrcamentos());
      this.orcamentos.set(dados);
    } catch {
      this.erroOrcamentos.set('Não foi possível carregar seus orçamentos agora.');
    } finally {
      this.carregandoOrcamentos.set(false);
    }
  }

  // ==================== MENSAGEM / DEPOIMENTO ====================

  async enviarMensagem(): Promise<void> {
    if (!this.mensagemTexto.trim()) {
      this.erroMensagem.set('Escreva sua mensagem antes de enviar.');
      return;
    }
    this.enviandoMensagem.set(true);
    this.erroMensagem.set('');
    try {
      await firstValueFrom(this.depoimentoApi.enviar({
        mensagem: this.mensagemTexto,
        referenteEvento: this.referenteEvento || undefined
      }));
      this.mensagemTexto = '';
      this.referenteEvento = '';
      this.mensagemEnviada.set(true);
      setTimeout(() => this.mensagemEnviada.set(false), 4000);
    } catch {
      this.erroMensagem.set('Não foi possível enviar sua mensagem agora. Tente novamente.');
    } finally {
      this.enviandoMensagem.set(false);
    }
  }

  // ==================== AUTH ====================

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}