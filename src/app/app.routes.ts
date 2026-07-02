import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { candidatoGuard } from './core/guards/candidato.guard';
import { empresaGuard } from './core/guards/empresa.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Redirecionamento inicial
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Rotas de autenticação (públicas)
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Rotas do Candidato (protegidas)
  //   {
  //     path: 'candidatos',
  //     canActivate: [authGuard, candidatoGuard],
  //     loadChildren: () => import('./features/candidato/candidato.routes').then(m => m.CANDIDATO_ROUTES)
  //   },

  // Rotas da Empresa (protegidas)
  //   {
  //     path: 'empresa',
  //     canActivate: [authGuard, empresaGuard],
  //     loadChildren: () => import('./features/empresa/empresa.routes').then(m => m.EMPRESA_ROUTES)
  //   },

  // Rotas do Admin (protegidas)
  //   {
  //     path: 'admin',
  //     canActivate: [authGuard, adminGuard],
  //     loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  //   },

  // Landing Pages (públicas)
  //   {
  //     path: 'empresa/:slug',
  //     loadChildren: () => import('./features/landing-page/landing-page.routes').then(m => m.LANDING_PAGE_ROUTES)
  //   },

  // Acesso negado
  {
    path: 'acesso-negado',
    loadComponent: () =>
      import('./features/auth/pages/acesso-negado/acesso-negado.component').then(
        (m) => m.AcessoNegadoComponent,
      ),
  },

  // Fallback - Página não encontrada
  {
    path: '**',
    redirectTo: '/login',
  },
];
