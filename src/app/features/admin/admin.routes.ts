import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-admin.component').then((m) => m.DashboardAdminComponent),
  },
  {
    path: 'monitor',
    loadComponent: () =>
      import('./pages/monitor/monitor.component').then((m) => m.MonitorComponent),
  },
  {
    path: 'geocode',
    loadComponent: () =>
      import('./pages/geocode/geocode.component').then((m) => m.GeocodeComponent),
  },
  {
    path: 'convites',
    loadComponent: () =>
      import('./pages/convites/admin-convites.component').then((m) => m.AdminConvitesComponent),
  },
  {
    path: 'parametros',
    loadComponent: () =>
      import('./pages/parametros/parametros-gerais.component').then(
        (m) => m.ParametrosGeraisComponent,
      ),
  },
  {
    path: 'creditos',
    loadComponent: () =>
      import('./pages/creditos/gerenciar-creditos.component').then(
        (m) => m.GerenciarCreditosComponent,
      ),
  },
  {
    path: 'cupons',
    loadComponent: () => import('./pages/cupons/cupons.component').then((m) => m.CuponsComponent),
  },
];
