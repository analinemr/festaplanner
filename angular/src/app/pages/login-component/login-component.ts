/**
 * COMPONENTE: Login
 *
 * Tela de autenticação (cliente e administrador — mesma tela, redireciona
 * conforme o perfil retornado pelo backend após o login).
 * Usa Reactive Forms do Angular para validação robusta.
 * Envia credenciais ao Spring Boot via AuthService e armazena o token JWT
 * retornado para uso nas requisições seguintes (via authInterceptor).
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  carregando = false;
  erro: string | null = null;
  mostrarSenha = false;

  /** Se veio de "Salvar rascunho" sem login, guarda a URL pra voltar depois — também usado pelo link "Criar conta". */
  retornoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.retornoUrl = this.route.snapshot.queryParamMap.get('retorno');
  }

  campoInvalido(campo: string): boolean {
    const c = this.loginForm.get(campo);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  alternarSenha(): void { this.mostrarSenha = !this.mostrarSenha; }
  limparErro(): void { this.erro = null; }

  onLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.carregando = true;
    this.erro = null;

    const credenciais = this.loginForm.value;

    this.authService.login(credenciais).subscribe({
      next: (resposta) => {
        this.carregando = false;

        // Se veio de "Salvar rascunho" sem estar logado, volta para o orçamento
        // em vez de ir para /admin ou /conta (ver query param `retorno`).
        if (this.retornoUrl) {
          this.router.navigateByUrl(this.retornoUrl);
          return;
        }

        this.router.navigate([resposta.perfil === 'ADMINISTRADOR' ? '/admin' : '/conta']);
      },
      error: (err) => {
        this.carregando = false;

        if (err.status === 401) {
          this.erro = 'E-mail ou senha incorretos.';
        } else if (err.status === 0) {
          this.erro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else {
          this.erro = err.error?.message || 'Erro inesperado. Tente novamente.';
        }
      }
    });
  }
}