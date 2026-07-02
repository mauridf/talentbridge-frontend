import { Routes } from '@angular/router';

export const CANDIDATO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro-candidato.component').then(
        (m) => m.RegistroCandidatoComponent,
      ),
  },
  {
    path: 'confirmar-email',
    loadComponent: () =>
      import('./pages/confirmar-email/confirmar-email.component').then(
        (m) => m.ConfirmarEmailComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-candidato.component').then(
        (m) => m.DashboardCandidatoComponent,
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
];
