import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoadingSpinnerComponent } from '../app/shared/components/loading-spinner/loading-spinner.component';
import { LoadingService } from '../app/core/services/loading.service';
import { NotificationService } from '../app/core/services/notification.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, LoadingSpinnerComponent],
  template: `
    <!-- Loading Global -->
    @if (loadingService.loading()) {
      <app-loading-spinner mensagem="Carregando..."></app-loading-spinner>
    }

    <!-- Toast de Notificações -->
    <p-toast
      position="top-right"
      [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }"
    >
    </p-toast>

    <!-- Diálogos de Confirmação -->
    <p-confirmDialog [style]="{ width: '450px' }" acceptLabel="Confirmar" rejectLabel="Cancelar">
    </p-confirmDialog>

    <!-- Conteúdo Principal -->
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    public loadingService: LoadingService,
    private notificationService: NotificationService,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit(): void {
    // Configura PrimeNG
    this.primengConfig.ripple = true;

    // Configura traduções PrimeNG
    this.primengConfig.setTranslation({
      accept: 'Confirmar',
      reject: 'Cancelar',
      choose: 'Escolher',
      upload: 'Upload',
      cancel: 'Cancelar',
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      today: 'Hoje',
      clear: 'Limpar',
      // Mais traduções podem ser adicionadas conforme necessário
    });
  }
}
