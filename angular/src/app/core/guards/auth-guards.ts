/**
 * GUARD: Proteção de Rotas do Administrador
 *
 * Impede que usuários não autenticados OU autenticados como CLIENTE
 * acessem rotas restritas ao ADM.
 * Usado em app.routes.ts para proteger /admin, /admin/pedidos, /admin/agenda.
 *
 * Como funciona:
 * 1. Angular chama canActivate() antes de carregar o componente
 * 2. Sem token → redireciona para /login (guardando a URL pra voltar depois)
 * 3. Com token, mas perfil !== 'ADMINISTRADOR' → redireciona para /conta
 *    (a pessoa está logada, só não tem permissão ali — não faz sentido
 *    mandar de volta pro login)
 * 4. Com token e perfil === 'ADMINISTRADOR' → libera o acesso
 */
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAutenticado()) {
    router.navigate(['/login'], { queryParams: { retorno: state.url } });
    return false;
  }

  const usuario = authService.getUsuario();

  if (!usuario || usuario.perfil !== 'ADMINISTRADOR') {
    router.navigate(['/conta']);
    return false;
  }

  return true;
};