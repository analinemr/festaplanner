/**
 * SERVIÇO: Autenticação
 *
 * Gerencia login, registro, logout e armazenamento do token JWT
 * retornado pelo Spring Boot Security.
 *
 * Endpoints Spring Boot esperados:
 *   POST /api/auth/login    → { email, senha } → retorna { token, nome, ... }
 *   POST /api/auth/registro → { nome, email, senha, telefone? } → retorna { token, nome, ... }
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Login, AuthResponse } from '../../models/login';
import { environment } from '../../../environments/environment';

export interface RegistroDados {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** URL base da autenticação no Spring Boot */
  private apiUrl = `${environment.apiUrl}/auth`;

  /**
   * Chave usada para armazenar o token JWT no localStorage do navegador
   * O token é enviado em todas as requisições protegidas via HTTP Interceptor
   */
  private TOKEN_KEY = 'fp_token';

  /** Chave para armazenar dados básicos do usuário logado */
  private USER_KEY = 'fp_user';

  constructor(private http: HttpClient) {}

  /**
   * Realiza login no backend Spring Boot
   * Após sucesso, salva o token JWT e dados do usuário no localStorage
   * O operador `tap` executa o armazenamento sem alterar o fluxo Observable
   *
   * @param credenciais - { email, senha }
   */
  login(credenciais: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciais).pipe(
      tap((resposta: AuthResponse) => this.salvarSessao(resposta.token, resposta))
    );
  }

  /**
   * Cria uma nova conta (perfil CLIENTE por padrão) e já loga automaticamente,
   * já que o backend devolve um token pronto na resposta de /registro.
   */
  registrar(dados: RegistroDados): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, dados).pipe(
      tap((resposta: AuthResponse) => this.salvarSessao(resposta.token, resposta))
    );
  }

  /**
   * Realiza logout: remove token e dados do localStorage
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Verifica se o usuário está autenticado
   * Usado pelos Guards para proteger rotas privadas
   * @returns true se existe um token salvo (não valida expiração aqui — o backend valida)
   */
  isAutenticado(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retorna o token JWT salvo no localStorage
   * Usado pelo HTTP Interceptor para adicionar ao header Authorization
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retorna os dados do usuário logado (nome, email, perfil)
   * Usado para exibir informações na barra de navegação
   */
  getUsuario(): any {
    const dados = localStorage.getItem(this.USER_KEY);
    return dados ? JSON.parse(dados) : null;
  }

  /** Salva token e dados do usuário logado (cliente ou admin). */
  salvarSessao(token: string, usuario: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
  }

  /** Alias de isAutenticado(), mantido por compatibilidade com código existente. */
  estaAutenticado(): boolean {
    return this.isAutenticado();
  }
}