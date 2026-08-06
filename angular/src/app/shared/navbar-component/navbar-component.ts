/**
 * COMPONENTE: Navbar
 *
 * Barra de navegação global — fiel ao layout do index.html modelo.
 *
 * Comportamentos:
 *  - Transparente sobre o hero; ao rolar 60px adiciona fundo branco fosco (.scrolled)
 *  - routerLinkActive → destaca o link da rota atual
 *  - Menu mobile (hamburguer) → toggle via (click)
 *  - Fecha o menu mobile ao navegar
 *  - Link "Conta" → /conta se logado, /login se não (ver linkConta)
 *
 * Usado em: todas as páginas públicas (home, catálogo, orçamento)
 * NÃO usado no painel admin (tem sidebar própria)
 *
 * Registrado como componente standalone — basta importar onde precisar.
 */
import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  /** Controla a classe .scrolled na navbar (fundo transparente → branco) */
  scrolled = false;

  /**
   * Força o visual "com fundo" (texto escuro) mesmo no topo da página —
   * use em páginas que não têm hero escuro atrás do navbar (ex: Orçamento,
   * Conta), onde o texto branco padrão ficaria invisível.
   * Ex.: <app-navbar [sempreComFundo]="true"></app-navbar>
   */
  @Input() sempreComFundo = false;

  /** Estado real usado no template — combina o scroll de verdade com o override acima. */
  get mostrarComFundo(): boolean {
    return this.scrolled || this.sempreComFundo;
  }

  /** Controla abertura/fechamento do menu mobile */
  menuAberto = false;

  constructor(private authService: AuthService) {}

  /** Pra onde o link "Conta" aponta — /login se ninguém estiver logado. */
  get linkConta(): string {
    return this.authService.isAutenticado() ? '/conta' : '/login';
  }

  ngOnInit(): void {
    /* Verifica o scroll inicial (caso a página já comece scrollada) */
    this.scrolled = window.scrollY > 60;
  }

  ngOnDestroy(): void {
    /* Remove a restrição de scroll do body se o componente for destruído com menu aberto */
    document.body.style.overflow = '';
  }

  /**
   * @HostListener('window:scroll') → escuta o scroll da janela.
   * Adiciona/remove .scrolled na navbar aos 60px de scroll.
   */
  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 60;
  }

  /** Abre/fecha o menu mobile */
  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
    /* Trava o scroll do body enquanto o menu está aberto */
    document.body.style.overflow = this.menuAberto ? 'hidden' : '';
  }

  /** Fecha o menu ao clicar em um link */
  fecharMenu(): void {
    this.menuAberto = false;
    document.body.style.overflow = '';
  }

  /**
   * Fecha o menu mobile ao pressionar Escape
   */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuAberto) this.fecharMenu();
  }
}