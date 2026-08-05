/**
 * SERVIÇO: CatalogoApiService
 *
 * Busca o catálogo real (temas + produtos) do backend Spring Boot,
 * substituindo os arrays fixos que existiam antes no orcamento-component.ts.
 *
 * Endpoints usados (públicos, não exigem login):
 *   GET /api/temas?tipoEvento=INFANTIL
 *   GET /api/produtos?categoria=DOCES
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
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoApiService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
}
