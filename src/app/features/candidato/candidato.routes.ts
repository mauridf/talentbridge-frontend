import { Routes } from '@angular/router';

export const CANDIDATO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-candidato.component').then(
        (m) => m.DashboardCandidatoComponent,
      ),
  },
  {
    path: 'editar',
    loadComponent: () =>
      import('./pages/perfil-pessoal/perfil-pessoal.component').then(
        (m) => m.PerfilPessoalComponent,
      ),
  },
  {
    path: 'perfil-profissional',
    loadComponent: () =>
      import('./pages/perfil-profissional/perfil-profissional.component').then(
        (m) => m.PerfilProfissionalComponent,
      ),
  },
  {
    path: 'teste-big-five',
    loadComponent: () =>
      import('./pages/big-five/big-five-quiz/big-five-quiz.component').then(
        (m) => m.BigFiveQuizComponent,
      ),
  },
  {
    path: 'resultado-big-five',
    loadComponent: () =>
      import('./pages/big-five/big-five-resultado/big-five-resultado.component').then(
        (m) => m.BigFiveResultadoComponent,
      ),
  },
  {
    path: 'minhas-candidaturas',
    loadComponent: () =>
      import('./pages/candidaturas/minhas-candidaturas.component').then(
        (m) => m.MinhasCandidaturasComponent,
      ),
  },
];
