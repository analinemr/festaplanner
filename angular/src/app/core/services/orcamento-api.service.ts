/**
 * SERVIÇO: OrcamentoApiService
 *
 * Implementa o fluxo real do wizard de orçamento contra o backend Spring Boot,
 * em substituição ao método enviarOrcamento() antigo, que só simulava sucesso
 * com um número de pedido aleatório (Math.random()) sem chamar a API.
 *
 * Fluxo (precisa de usuário CLIENTE autenticado — o AuthController /login
 * já devolve o token, e o authInterceptor já anexa o header Authorization):
 *   1. POST /api/orcamentos                         → cria o orçamento (etapa 1)
 *   2. PUT  /api/orcamentos/{id}/tema/{temaId}       → define o tema (etapa 2)
 *   3. POST /api/orcamentos/{id}/itens (repetido)    → adiciona cada item (etapa 3)
 *   4. POST /api/orcamentos/{id}/enviar              → confirma e envia (etapa 4)
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

/** Espelha com.festaplanner.model.Orcamento no backend (campos usados aqui). */
export interface ApiOrcamento {
  id: number;
  status: string;
  totalEstimado: number;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class OrcamentoApiService {

  private readonly apiUrl = `${environment.apiUrl}/orcamentos`;

  constructor(private http: HttpClient) {}

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
}
