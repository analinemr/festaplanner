/**
 * SERVIÇO: OrcamentoApiService
 *
 * Implementa o fluxo real do wizard de orçamento contra o backend Spring Boot
 * (cliente/visitante) e os endpoints administrativos da tela "Pedidos" do ADM.
 *
 * Fluxo do cliente (visitante ou logado):
 *   1. POST /api/orcamentos                         → cria o orçamento (etapa 1)
 *   2. PUT  /api/orcamentos/{id}/tema/{temaId}       → define o tema (etapa 2)
 *   3. POST /api/orcamentos/{id}/itens (repetido)    → adiciona cada item (etapa 3)
 *   4. POST /api/orcamentos/{id}/enviar              → confirma e envia (etapa 4)
 *
 * Endpoints do ADM (exigem ADMINISTRADOR — ver SecurityConfig, /api/admin/**):
 *   GET   /api/admin/orcamentos?status=NOVO   → lista pedidos (tela "Pedidos")
 *   PATCH /api/admin/orcamentos/{id}/status   → aprova/recusa/move de status
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrcamentoEventoRequest {
  tipoEvento: string;
  numeroConvidados: number;
  dataEvento?: string;
}

export interface OrcamentoItemRequest {
  produtoId: number;
  quantidade: number;
}

export interface OrcamentoConfirmarRequest {
  nomeContato: string;
  emailContato: string;
  whatsappContato: string;
  melhorHorarioContato?: string;
  observacoes?: string;
}

export interface ApiOrcamentoItem {
  id: number;
  produto: {
    id: number;
    nome: string;
    categoria: string;
    valor: number;
    [key: string]: unknown;
  };
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

/** Espelha com.festaplanner.model.Orcamento no backend. */
export interface ApiOrcamento {
  id: number;
  cliente?: { id: number; nome: string; email: string } | null;
  tipoEvento: string;
  tema?: { id: number; nome: string; valor: number } | null;
  numeroConvidados: number;
  dataEvento?: string;
  status: string;
  itens: ApiOrcamentoItem[];
  subtotal: number;
  taxaServicoPercentual: number;
  totalEstimado: number;
  nomeContato?: string;
  emailContato?: string;
  whatsappContato?: string;
  melhorHorarioContato?: string;
  observacoes?: string;
  criadoEm?: string;
  atualizadoEm?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class OrcamentoApiService {

  private readonly apiUrl = `${environment.apiUrl}/orcamentos`;
  private readonly adminUrl = `${environment.apiUrl}/admin/orcamentos`;

  constructor(private http: HttpClient) {}

  // ==================== FLUXO DO CLIENTE (wizard) ====================

  iniciar(request: OrcamentoEventoRequest): Observable<ApiOrcamento> {
    return this.http.post<ApiOrcamento>(this.apiUrl, request);
  }

  definirTema(orcamentoId: number, temaId: number): Observable<ApiOrcamento> {
    return this.http.put<ApiOrcamento>(`${this.apiUrl}/${orcamentoId}/tema/${temaId}`, {});
  }

  adicionarItem(orcamentoId: number, request: OrcamentoItemRequest): Observable<ApiOrcamento> {
    return this.http.post<ApiOrcamento>(`${this.apiUrl}/${orcamentoId}/itens`, request);
  }

  enviar(orcamentoId: number, request: OrcamentoConfirmarRequest): Observable<ApiOrcamento> {
    return this.http.post<ApiOrcamento>(`${this.apiUrl}/${orcamentoId}/enviar`, request);
  }

  salvarRascunho(orcamentoId: number): Observable<ApiOrcamento> {
    return this.http.post<ApiOrcamento>(`${this.apiUrl}/${orcamentoId}/salvar-rascunho`, {});
  }

  /** Busca um orçamento específico por ID (público — usado para retomar um rascunho). */
  buscar(orcamentoId: number): Observable<ApiOrcamento> {
    return this.http.get<ApiOrcamento>(`${this.apiUrl}/${orcamentoId}`);
  }

  /** Histórico de orçamentos do cliente logado — usado na tela "Sua conta". */
  meusOrcamentos(): Observable<ApiOrcamento[]> {
    return this.http.get<ApiOrcamento[]>(`${this.apiUrl}/meus`);
  }

  // ==================== ADMIN (tela "Pedidos") ====================

  /** Lista os pedidos para o ADM. Sem status: retorna tudo exceto rascunhos. */
  listarParaAdmin(status?: string): Observable<ApiOrcamento[]> {
    const params: Record<string, string> = {};
    if (status) {
      params['status'] = status;
    }
    return this.http.get<ApiOrcamento[]>(this.adminUrl, { params });
  }

  /** Atualiza o status de um pedido (ex: 'CONFIRMADO', 'RECUSADO', 'PRE_RESERVA'). */
  atualizarStatusAdmin(id: number, status: string): Observable<ApiOrcamento> {
    return this.http.patch<ApiOrcamento>(`${this.adminUrl}/${id}/status`, { status });
  }
}