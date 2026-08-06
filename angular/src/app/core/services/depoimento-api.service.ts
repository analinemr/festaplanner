/**
 * SERVIÇO: DepoimentoApiService
 *
 *   POST   /api/depoimentos            → cliente envia mensagem (autenticado)
 *   GET    /api/depoimentos/aprovados  → público, usado na Home
 *   GET    /api/admin/depoimentos      → moderação (ADM)
 *   PATCH  /api/admin/depoimentos/{id}/aprovar
 *   DELETE /api/admin/depoimentos/{id}
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DepoimentoRequest {
  mensagem: string;
  referenteEvento?: string;
}

export interface DepoimentoResponse {
  id: number;
  nomeCliente: string;
  mensagem: string;
  referenteEvento?: string;
  aprovado: boolean;
  criadoEm: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepoimentoApiService {

  private readonly apiUrl = `${environment.apiUrl}/depoimentos`;
  private readonly adminUrl = `${environment.apiUrl}/admin/depoimentos`;

  constructor(private http: HttpClient) {}

  enviar(dados: DepoimentoRequest): Observable<DepoimentoResponse> {
    return this.http.post<DepoimentoResponse>(this.apiUrl, dados);
  }

  /** Público — usado na Home. */
  listarAprovados(): Observable<DepoimentoResponse[]> {
    return this.http.get<DepoimentoResponse[]>(`${this.apiUrl}/aprovados`);
  }

  // ==================== ADMIN (moderação) ====================

  listarParaAdmin(): Observable<DepoimentoResponse[]> {
    return this.http.get<DepoimentoResponse[]>(this.adminUrl);
  }

  aprovar(id: number): Observable<DepoimentoResponse> {
    return this.http.patch<DepoimentoResponse>(`${this.adminUrl}/${id}/aprovar`, {});
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}