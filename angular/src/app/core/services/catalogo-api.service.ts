/**
 * SERVIÇO: CatalogoApiService
 *
 * Busca o catálogo real (temas + produtos) do backend Spring Boot,
 * substituindo os arrays fixos que existiam antes no orcamento-component.ts.
 *
 * Endpoints públicos (leitura, não exigem login):
 *   GET /api/temas?tipoEvento=INFANTIL
 *   GET /api/produtos?categoria=DOCES
 *
 * Endpoints de administração (exigem ADMINISTRADOR — ver SecurityConfig):
 *   POST   /api/produtos
 *   PUT    /api/produtos/{id}
 *   DELETE /api/produtos/{id}   (desativação lógica, não remove do banco)
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Espelha com.festaplanner.model.Tema no backend. */
export interface ApiTema {
  id: number;
  nome: string;
  descricao?: string;
  imagemUrl?: string;
  tipoEvento: string;
  valor: number;
  genero?: 'MENINO' | 'MENINA' | 'UNISSEX';
  categoriaTema?: 'CLASSICO' | 'MODERNO' | 'ROMANTICO';
  ativo: boolean;
}

/** Espelha com.festaplanner.model.Produto no backend. */
export interface ApiProduto {
  id: number;
  nome: string;
  descricao?: string;
  categoria: string;
  tipoItem: 'OBRIGATORIO' | 'OPCIONAL';
  valor: number;
  unidadeMedida?: string;
  quantidadeMinima?: number;
  incremento?: number;
  imagemUrl?: string;
  subcategoria?: string;
  linha?: 'CLASSICA' | 'PREMIUM';
  fornecimento?: 'CASA' | 'PARCEIRO' | 'CLIENTE_TRAZ';
  itensInclusos?: string;
  itensNaoInclusos?: string;
  duracaoHoras?: number;
  sobOrcamento?: boolean;
  precoReferencia?: string;
  produtoPai?: ApiProduto | null;
  ativo: boolean;
}

/** Espelha com.festaplanner.dto.ProdutoRequest no backend — corpo de POST/PUT. */
export interface ProdutoRequest {
  nome: string;
  descricao?: string;
  categoria: string;
  tipoItem: 'OBRIGATORIO' | 'OPCIONAL';
  valor: number;
  unidadeMedida?: string;
  quantidadeMinima?: number;
  imagemUrl?: string;
  produtoPaiId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoApiService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================== LEITURA (pública) ====================

  /** Busca todos os temas de um tipo de evento (ex.: 'INFANTIL', 'QUINZE_ANOS', 'CASAMENTO'). */
  buscarTemas(tipoEvento: string): Observable<ApiTema[]> {
    return this.http.get<ApiTema[]>(`${this.apiUrl}/temas`, { params: { tipoEvento } });
  }

  /** Busca todos os produtos de uma categoria (ex.: 'BUFFET', 'DOCES', 'DECORACAO'). */
  buscarProdutos(categoria: string): Observable<ApiProduto[]> {
    return this.http.get<ApiProduto[]>(`${this.apiUrl}/produtos`, { params: { categoria } });
  }

  /** Busca o catálogo inteiro (todas as categorias de produto de uma vez). */
  buscarTodosProdutos(): Observable<ApiProduto[]> {
    return this.http.get<ApiProduto[]>(`${this.apiUrl}/produtos`);
  }

  // ==================== ESCRITA (admin) ====================

  /** Cria um novo produto no catálogo. Exige usuário ADMINISTRADOR. */
  criarProduto(request: ProdutoRequest): Observable<ApiProduto> {
    return this.http.post<ApiProduto>(`${this.apiUrl}/produtos`, request);
  }

  /** Atualiza um produto existente. Exige usuário ADMINISTRADOR. */
  atualizarProduto(id: number, request: ProdutoRequest): Observable<ApiProduto> {
    return this.http.put<ApiProduto>(`${this.apiUrl}/produtos/${id}`, request);
  }

  /** Desativa (exclusão lógica) um produto do catálogo. Exige usuário ADMINISTRADOR. */
  desativarProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produtos/${id}`);
  }

  // ==================== UPLOAD DE IMAGEM (admin) ====================

  /** Envia um arquivo de imagem para o servidor. Retorna a URL relativa salva (ex: '/uploads/produtos/xxx.jpg'). */
  uploadImagem(arquivo: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/imagem`, formData);
  }

  /**
   * Converte a URL relativa devolvida pelo backend em uma URL absoluta utilizável em <img>.
   * Necessário porque `apiUrl` inclui o sufixo '/api', mas os uploads são servidos na raiz
   * (ex: apiUrl = 'http://localhost:8080/api' → arquivos em 'http://localhost:8080/uploads/...').
   * Se a URL já for absoluta (começa com http) ou vazia, retorna como está.
   */
  resolverUrlImagem(url: string | undefined | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const origem = this.apiUrl.replace(/\/api\/?$/, '');
    return origem + url;
  }
}