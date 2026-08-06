/**
 * SERVIÇO: UsuarioApiService
 *
 * Endpoints do próprio usuário logado — usados pela tela "Sua conta" (cliente)
 * e pela edição de perfil do ADM.
 *
 *   GET /api/usuarios/me → dados do usuário logado
 *   PUT /api/usuarios/me → atualiza nome/telefone
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  perfil: string;
}

export interface AtualizarPerfilRequest {
  nome: string;
  telefone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {

  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  meuPerfil(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`);
  }

  atualizarMeuPerfil(dados: AtualizarPerfilRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.apiUrl}/me`, dados);
  }
}