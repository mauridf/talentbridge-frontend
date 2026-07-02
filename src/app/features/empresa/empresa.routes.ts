import { Routes } from '@angular/router';

export const EMPRESA_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-empresa.component').then(
        (m) => m.DashboardEmpresaComponent,
      ),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro-empresa.component').then((m) => m.RegistroEmpresaComponent),
  },
  {
    path: 'oportunidades',
    loadComponent: () =>
      import('./pages/vagas/vaga-list/vaga-list.component').then((m) => m.VagaListComponent),
  },
];
