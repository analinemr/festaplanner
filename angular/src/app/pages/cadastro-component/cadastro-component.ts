/**
 * COMPONENTE: Cadastro
 *
 * Tela de criação de conta para clientes (visitantes que querem salvar o
 * orçamento e acompanhar depois, ou já sabem que vão contratar).
 * Envia os dados ao Spring Boot via AuthService.registrar() e, com sucesso,
 * já loga automaticamente (o backend devolve um token no registro).
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cadastro-component.html',
  styleUrl: './cadastro-component.css'
})
export class CadastroComponent implements OnInit {

  cadastroForm!: FormGroup;
  carregando = false;
  erro: string | null = null;
  mostrarSenha = false;

  /** Se veio de "Salvar rascunho" sem login, volta pra essa URL depois de criar a conta. */
  retornoUrl: string | null = null;

  /** true quando a pessoa chegou aqui vinda do botão "Salvar rascunho" — muda a mensagem de topo. */
  vindoDeRascunho = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.retornoUrl = this.route.snapshot.queryParamMap.get('retorno');
    this.vindoDeRascunho = this.route.snapshot.queryParamMap.get('motivo') === 'rascunho';
  }

  campoInvalido(campo: string): boolean {
    const c = this.cadastroForm.get(campo);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  alternarSenha(): void { this.mostrarSenha = !this.mostrarSenha; }
  limparErro(): void { this.erro = null; }

  onCadastrar(): void {
    if (this.cadastroForm.invalid) { this.cadastroForm.markAllAsTouched(); return; }
    this.carregando = true;
    this.erro = null;

    this.authService.registrar(this.cadastroForm.value).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigateByUrl(this.retornoUrl ?? '/conta');
      },
      error: (err) => {
        this.carregando = false;

        if (err.status === 409) {
          this.erro = 'Já existe uma conta com este e-mail. Tente fazer login.';
        } else if (err.status === 0) {
          this.erro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else {
          this.erro = err.error?.message || 'Erro inesperado. Tente novamente.';
        }
      }
    });
  }
}