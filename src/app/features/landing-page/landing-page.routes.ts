import { Routes } from '@angular/router';

export const LANDING_PAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/empresa-vagas/lista-vagas-public.component').then(
        (m) => m.ListaVagasPublicComponent,
      ),
  },
  {
    path: 'vaga/:id',
    loadComponent: () =>
      import('./pages/vaga-detalhe/detalhe-vaga-public.component').then(
        (m) => m.DetalheVagaPublicComponent,
      ),
  },
];
