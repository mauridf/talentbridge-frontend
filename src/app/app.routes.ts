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

  // Rotas públicas do candidato (sem layout, sem autenticação)
  {
    path: 'candidatos/registro',
    loadComponent: () => import('./features/candidato/pages/registro/registro-candidato.component').then(m => m.RegistroCandidatoComponent),
  },
  {
    path: 'candidatos/confirmar-email',
    loadComponent: () => import('./features/candidato/pages/confirmar-email/confirmar-email.component').then(m => m.ConfirmarEmailComponent),
  },

  // Rotas protegidas (com layout)
  {
    path: 'candidatos',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard, candidatoGuard],
    loadChildren: () => import('./features/candidato/candidato.routes').then(m => m.CANDIDATO_ROUTES),
  },
  {
    path: 'empresa',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard, empresaGuard],
    loadChildren: () => import('./features/empresa/empresa.routes').then(m => m.EMPRESA_ROUTES),
  },
  {
    path: 'admin',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },

  // Landing Pages (públicas, sem layout) — prefixo /c/ para evitar conflito com rotas protegidas
  {
    path: 'c/:slug',
    loadComponent: () => import('./features/landing-page/pages/empresa-vagas/lista-vagas-public.component').then(m => m.ListaVagasPublicComponent),
  },
  {
    path: 'c/:slug/vaga/:id',
    loadComponent: () => import('./features/landing-page/pages/vaga-detalhe/detalhe-vaga-public.component').then(m => m.DetalheVagaPublicComponent),
  },

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
