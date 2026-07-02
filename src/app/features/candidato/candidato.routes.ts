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
];
