import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

/**
 * Componente de skeleton loading
 * Exibe placeholders animados enquanto o conteúdo carrega
 * Melhor UX que spinners para listas e cards
 *
 * Uso:
 * <!-- Skeleton de card -->
 * <app-loading-skeleton type="card"></app-loading-skeleton>
 *
 * <!-- Skeleton de lista -->
 * <app-loading-skeleton type="list" [quantidade]="5"></app-loading-skeleton>
 *
 * <!-- Skeleton de tabela -->
 * <app-loading-skeleton type="table" [quantidade]="8"></app-loading-skeleton>
 *
 * <!-- Skeleton de formulário -->
 * <app-loading-skeleton type="form" [campos]="6"></app-loading-skeleton>
 */
@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  template: `
    <!-- Card Skeleton -->
    <div *ngIf="type === 'card'" class="skeleton-card">
      <p-skeleton width="100%" height="200px" borderRadius="8px"></p-skeleton>
      <div class="skeleton-card-body">
        <p-skeleton width="70%" height="24px" borderRadius="4px"></p-skeleton>
        <p-skeleton width="50%" height="16px" borderRadius="4px"></p-skeleton>
        <p-skeleton width="90%" height="16px" borderRadius="4px"></p-skeleton>
      </div>
    </div>

    <!-- List Skeleton -->
    <div *ngIf="type === 'list'" class="skeleton-list">
      <div
        *ngFor="let item of [].constructor(quantidade); let i = index"
        class="skeleton-list-item"
      >
        <p-skeleton shape="circle" size="48px"></p-skeleton>
        <div class="skeleton-list-content">
          <p-skeleton width="60%" height="20px" borderRadius="4px"></p-skeleton>
          <p-skeleton width="40%" height="16px" borderRadius="4px"></p-skeleton>
        </div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div *ngIf="type === 'table'" class="skeleton-table">
      <!-- Cabeçalho -->
      <div class="skeleton-table-header">
        <p-skeleton width="100%" height="48px" borderRadius="4px"></p-skeleton>
      </div>
      <!-- Linhas -->
      <div
        *ngFor="let item of [].constructor(quantidade); let i = index"
        class="skeleton-table-row"
      >
        <p-skeleton width="100%" height="40px" borderRadius="4px"></p-skeleton>
      </div>
    </div>

    <!-- Form Skeleton -->
    <div *ngIf="type === 'form'" class="skeleton-form">
      <div *ngFor="let item of [].constructor(campos); let i = index" class="skeleton-form-field">
        <p-skeleton width="30%" height="16px" borderRadius="4px"></p-skeleton>
        <p-skeleton width="100%" height="48px" borderRadius="6px"></p-skeleton>
      </div>
    </div>

    <!-- Profile Skeleton -->
    <div *ngIf="type === 'profile'" class="skeleton-profile">
      <div class="skeleton-profile-header">
        <p-skeleton shape="circle" size="80px"></p-skeleton>
        <div class="skeleton-profile-info">
          <p-skeleton width="200px" height="28px" borderRadius="4px"></p-skeleton>
          <p-skeleton width="150px" height="20px" borderRadius="4px"></p-skeleton>
        </div>
      </div>
      <div class="skeleton-profile-body">
        <p-skeleton width="100%" height="16px" borderRadius="4px"></p-skeleton>
        <p-skeleton width="100%" height="16px" borderRadius="4px"></p-skeleton>
        <p-skeleton width="80%" height="16px" borderRadius="4px"></p-skeleton>
      </div>
    </div>

    <!-- Dashboard Skeleton -->
    <div *ngIf="type === 'dashboard'" class="skeleton-dashboard">
      <div class="skeleton-dashboard-stats">
        <p-skeleton
          *ngFor="let item of [].constructor(4)"
          width="23%"
          height="120px"
          borderRadius="8px"
        >
        </p-skeleton>
      </div>
      <div class="skeleton-dashboard-chart">
        <p-skeleton width="100%" height="300px" borderRadius="8px"></p-skeleton>
      </div>
    </div>
  `,
  styles: [
    `
      /* Card */
      .skeleton-card {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
      }
      .skeleton-card-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      /* List */
      .skeleton-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .skeleton-list-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface-card);
        border-radius: var(--border-radius);
      }
      .skeleton-list-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      /* Table */
      .skeleton-table {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .skeleton-table-header {
        margin-bottom: 0.5rem;
      }

      /* Form */
      .skeleton-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .skeleton-form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      /* Profile */
      .skeleton-profile {
        padding: 1.5rem;
        background: var(--surface-card);
        border-radius: var(--border-radius);
      }
      .skeleton-profile-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .skeleton-profile-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .skeleton-profile-body {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      /* Dashboard */
      .skeleton-dashboard {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .skeleton-dashboard-stats {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .skeleton-dashboard-chart {
        width: 100%;
      }

      @media (max-width: 768px) {
        .skeleton-dashboard-stats {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class LoadingSkeletonComponent {
  /** Tipo de skeleton a ser exibido */
  @Input() type: 'card' | 'list' | 'table' | 'form' | 'profile' | 'dashboard' = 'list';

  /** Quantidade de itens repetidos (listas, tabelas) */
  @Input() quantidade: number = 3;

  /** Quantidade de campos (formulários) */
  @Input() campos: number = 4;
}
