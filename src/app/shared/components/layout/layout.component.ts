import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { TokenService } from '@core/services/token.service';
import { AuthService } from '@core/services/auth.service';
import { PerfilUsuario } from '@core/models/auth.models';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
  visible: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    AvatarModule,
    TooltipModule,
  ],
  template: `
    <div class="layout-wrapper">
      <!-- Sidebar -->
      <aside class="layout-sidebar" [class.sidebar-collapsed]="sidebarCollapsed()">
        <div class="sidebar-header">
          <i class="pi pi-briefcase sidebar-logo-icon"></i>
          @if (!sidebarCollapsed()) {
            <span class="sidebar-title">TalentBridge</span>
          }
          <button
            pButton
            class="p-button-text p-button-rounded sidebar-toggle"
            [icon]="sidebarCollapsed() ? 'pi pi-angle-right' : 'pi pi-angle-left'"
            (click)="toggleSidebar()"
          >
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of menuItems(); track item.label) {
            @if (item.visible) {
              <a
                class="sidebar-nav-item"
                [routerLink]="item.routerLink"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: false }"
              >
                <i [class]="item.icon"></i>
                @if (!sidebarCollapsed()) {
                  <span>{{ item.label }}</span>
                }
              </a>
            }
          }
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="layout-main" [class.main-expanded]="sidebarCollapsed()">
        <!-- Header -->
        <header class="layout-header">
          <div class="header-left">
            <span class="header-greeting">Bem-vindo, <strong>{{ nomeUsuario() }}</strong></span>
          </div>
          <div class="header-right">
            <span class="header-profile-badge">{{ perfilLabel }}</span>
            <button
              pButton
              icon="pi pi-sign-out"
              class="p-button-text p-button-rounded p-button-sm"
              pTooltip="Sair"
              (click)="logout()"
            >
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="layout-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .layout-sidebar {
      width: 250px;
      min-width: 250px;
      background: var(--surface-card);
      border-right: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      transition: width 0.3s, min-width 0.3s;
      overflow: hidden;
    }
    .sidebar-collapsed {
      width: 60px;
      min-width: 60px;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border-bottom: 1px solid var(--surface-border);
      min-height: 60px;
    }
    .sidebar-logo-icon {
      font-size: 1.5rem;
      color: var(--primary-color);
    }
    .sidebar-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
      white-space: nowrap;
    }
    .sidebar-toggle {
      margin-left: auto;
    }
    .sidebar-nav {
      flex: 1;
      padding: 0.5rem;
      overflow-y: auto;
    }
    .sidebar-nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--border-radius);
      color: var(--text-color-secondary);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .sidebar-nav-item:hover {
      background: var(--surface-hover);
      color: var(--text-color);
    }
    .sidebar-nav-item.active {
      background: var(--primary-color);
      color: #ffffff;
    }
    .sidebar-nav-item i {
      font-size: 1.25rem;
      min-width: 1.25rem;
    }
    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .layout-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      background: var(--surface-card);
      border-bottom: 1px solid var(--surface-border);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .header-greeting {
      color: var(--text-color-secondary);
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .header-profile-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--primary-light);
      color: var(--primary-dark);
    }
    .layout-content {
      flex: 1;
      overflow-y: auto;
      background: var(--surface-ground);
    }
  `],
})
export class LayoutComponent implements OnInit {
  sidebarCollapsed = signal(false);
  nomeUsuario = signal('');
  perfilUsuario = signal<PerfilUsuario | null>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const claims = this.tokenService.obterClaims();
    if (claims) {
      this.nomeUsuario.set(claims.nome);
      this.perfilUsuario.set(claims.perfil as PerfilUsuario);
      this.configurarMenu(claims.perfil as PerfilUsuario);
    }
  }

  private configurarMenu(perfil: PerfilUsuario): void {
    const candidatoMenu: MenuItem[] = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/candidatos/dashboard', visible: true },
      { label: 'Editar Perfil', icon: 'pi pi-user-edit', routerLink: '/candidatos/editar', visible: true },
      { label: 'Perfil Profissional', icon: 'pi pi-briefcase', routerLink: '/candidatos/perfil-profissional', visible: true },
      { label: 'Teste Big Five', icon: 'pi pi-chart-bar', routerLink: '/candidatos/teste-big-five', visible: true },
      { label: 'Resultado', icon: 'pi pi-verified', routerLink: '/candidatos/resultado-big-five', visible: true },
      { label: 'Minhas Candidaturas', icon: 'pi pi-send', routerLink: '/candidatos/minhas-candidaturas', visible: true },
    ];

    const empresaMenu: MenuItem[] = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/empresa/dashboard', visible: true },
      { label: 'Perfil', icon: 'pi pi-building', routerLink: '/empresa/perfil', visible: true },
      { label: 'Vagas', icon: 'pi pi-briefcase', routerLink: '/empresa/oportunidades', visible: true },
      { label: 'Criar Vaga', icon: 'pi pi-plus-circle', routerLink: '/empresa/criar-vagas', visible: true },
      { label: 'Convites', icon: 'pi pi-envelope', routerLink: '/empresa/convites', visible: true },
    ];

    const adminMenu: MenuItem[] = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/admin/dashboard', visible: true },
      { label: 'Monitor', icon: 'pi pi-heartbeat', routerLink: '/admin/monitor', visible: true },
      { label: 'Geocode', icon: 'pi pi-map-marker', routerLink: '/admin/geocode', visible: true },
      { label: 'Convites', icon: 'pi pi-envelope', routerLink: '/admin/convites', visible: true },
      { label: 'Parâmetros', icon: 'pi pi-cog', routerLink: '/admin/parametros', visible: true },
      { label: 'Créditos', icon: 'pi pi-wallet', routerLink: '/admin/creditos', visible: true },
      { label: 'Cupons', icon: 'pi pi-ticket', routerLink: '/admin/cupons', visible: true },
    ];

    switch (perfil) {
      case PerfilUsuario.CANDIDATO:
        this.menuItems.set(candidatoMenu);
        break;
      case PerfilUsuario.GESTOR_EMPRESA:
      case PerfilUsuario.RECRUTADOR:
        this.menuItems.set(empresaMenu);
        break;
      case PerfilUsuario.ADMIN:
        this.menuItems.set(adminMenu);
        break;
      default:
        this.menuItems.set([]);
    }
  }

  get perfilLabel(): string {
    const labels: Record<string, string> = {
      ADMIN: 'Administrador',
      GESTOR_EMPRESA: 'Gestor',
      RECRUTADOR: 'Recrutador',
      CANDIDATO: 'Candidato',
    };
    return labels[this.perfilUsuario() || ''] || this.perfilUsuario() || '';
  }

  menuItems = signal<MenuItem[]>([]);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
