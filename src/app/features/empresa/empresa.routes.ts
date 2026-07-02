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
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil-empresa/perfil-empresa.component').then(
        (m) => m.PerfilEmpresaComponent,
      ),
  },
  {
    path: 'convites',
    loadComponent: () =>
      import('./pages/convites/empresa-convites.component').then(
        (m) => m.EmpresaConvitesComponent,
      ),
  },
  {
    path: 'oportunidades',
    loadComponent: () =>
      import('./pages/vagas/vaga-list/vaga-list.component').then((m) => m.VagaListComponent),
  },
  {
    path: 'criar-vagas',
    loadComponent: () =>
      import('./pages/vagas/vaga-form/vaga-form.component').then((m) => m.VagaFormComponent),
  },
  {
    path: 'editar-vagas/:id',
    loadComponent: () =>
      import('./pages/vagas/vaga-form/vaga-form.component').then((m) => m.VagaFormComponent),
  },
  {
    path: 'candidaturas/:vagaId',
    loadComponent: () =>
      import('./pages/candidaturas/lista-candidaturas/lista-candidaturas.component').then(
        (m) => m.ListaCandidaturasComponent,
      ),
  },
  {
    path: 'candidato/:id/:vaga',
    loadComponent: () =>
      import('./pages/perfil-candidato/perfil-candidato-detalhe.component').then(
        (m) => m.PerfilCandidatoDetalheComponent,
      ),
  },
];
