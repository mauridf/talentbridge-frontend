import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConviteService } from '../../../../core/services/convite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-validar-convite',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, RouterLink,
  ],
  template: `
    <div class="validar-convite-page">
      <div class="bg-decoration">
        <div class="bg-blob bg-blob-1"></div>
        <div class="bg-blob bg-blob-2"></div>
      </div>
      <main class="validar-main">
        <div class="brand-top">
          <span class="brand-text">TalentBridge</span>
        </div>

        <div class="validar-card">
          <div class="card-body">
            <div class="card-icon-wrap">
              <span class="material-symbols-outlined card-icon">mail</span>
            </div>
            <h1 class="card-title">Validar Convite</h1>
            <p class="card-subtitle">Insira o token recebido por email para criar sua conta</p>
          </div>

          @if (!validando && !conviteValido) {
            <form class="card-form" (ngSubmit)="validar()">
              <div class="input-group">
                <label class="input-label" for="token">Token do Convite</label>
                <div class="input-wrapper">
                  <span class="material-symbols-outlined input-icon">key</span>
                  <input
                    id="token"
                    type="text"
                    [(ngModel)]="token"
                    name="token"
                    placeholder="Cole o token recebido no email"
                    class="form-input"
                    [class.has-value]="token.length > 0"
                  />
                </div>
                <p class="input-hint">
                  <span class="material-symbols-outlined">info</span>
                  Verifique sua pasta de spam se não encontrar o email.
                </p>
              </div>
              <button type="submit" class="btn-primary" [disabled]="carregando || !token.trim()">
                @if (carregando) {
                  <svg class="btn-spinner" viewBox="0 0 24 24">
                    <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                    <path class="spinner-arc" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                } @else {
                  Validar Token
                  <span class="material-symbols-outlined btn-arrow">arrow_forward</span>
                }
              </button>
            </form>
          }

          @if (validando) {
            <div class="status-section">
              <span class="material-symbols-outlined status-spinner">sync</span>
              <p>Validando convite...</p>
            </div>
          }

          @if (conviteInvalido) {
            <div class="status-section error">
              <span class="material-symbols-outlined status-icon">warning</span>
              <h2>Convite Inválido</h2>
              <p>O token informado é inválido ou expirou. Solicite um novo convite.</p>
              <button class="btn-primary btn-retry" (click)="reiniciar()">
                <span class="material-symbols-outlined">refresh</span>
                Tentar Novamente
              </button>
            </div>
          }

          @if (conviteValido && !validando) {
            <div class="status-section success">
              <span class="material-symbols-outlined status-icon">check_circle</span>
              <h2>Convite Válido!</h2>
              <p>Redirecionando para o cadastro...</p>
            </div>
          }

          <div class="card-footer">
            <a routerLink="/login" class="back-link">
              <span class="material-symbols-outlined">arrow_back</span>
              Voltar para o Login
            </a>
          </div>
        </div>

        <footer class="validar-footer">
          <p>&copy; 2024 TalentBridge. All rights reserved.</p>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .validar-convite-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7f9fb;
      padding: 16px;
      position: relative;
      font-family: 'Inter', sans-serif;
    }

    .bg-decoration {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
    }

    .bg-blob-1 {
      top: -10%;
      left: -10%;
      width: 40%;
      height: 40%;
      background: rgba(0, 62, 199, 0.05);
    }

    .bg-blob-2 {
      bottom: -10%;
      right: -10%;
      width: 40%;
      height: 40%;
      background: rgba(80, 95, 118, 0.05);
    }

    .validar-main {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand-top {
      text-align: center;
      margin-bottom: 32px;
    }

    .brand-text {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.01em;
      color: #003ec7;
    }

    .validar-card {
      width: 100%;
      background: #ffffff;
      padding: 32px 64px;
      border-radius: 12px;
      box-shadow: 0px 1px 2px rgba(0,0,0,0.05), 0px 4px 12px rgba(0,0,0,0.03);
      border: 1px solid rgba(195, 197, 217, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @media (max-width: 480px) {
      .validar-card {
        padding: 24px 32px;
      }
    }

    .card-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32px;
    }

    .card-icon-wrap {
      width: 64px;
      height: 64px;
      background: rgba(0, 82, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .card-icon {
      font-size: 32px;
      color: #003ec7;
    }

    .card-title {
      font-size: 24px;
      font-weight: 600;
      color: #191c1e;
      margin: 0 0 8px;
    }

    .card-subtitle {
      font-size: 14px;
      line-height: 20px;
      color: #434656;
      text-align: center;
      margin: 0;
      padding: 0 16px;
    }

    .card-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .input-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #505f76;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      font-size: 20px;
      color: #737688;
      pointer-events: none;
      transition: color 0.2s;
    }

    .input-wrapper:focus-within .input-icon {
      color: #003ec7;
    }

    .form-input {
      width: 100%;
      height: 48px;
      padding: 12px 16px 12px 44px;
      background: #f2f4f6;
      border: 1px solid #c3c5d9;
      border-radius: 8px;
      font-size: 16px;
      line-height: 24px;
      color: #191c1e;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: 'Inter', sans-serif;
    }

    .form-input:focus {
      border-color: #003ec7;
      box-shadow: 0 0 0 2px rgba(0, 62, 199, 0.15);
    }

    .form-input.has-value {
      border-color: #003ec7;
    }

    .form-input::placeholder {
      color: #737688;
      opacity: 0.5;
    }

    .input-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      color: #737688;
      margin: 0;
    }

    .input-hint span {
      font-size: 14px;
    }

    .btn-primary {
      width: 100%;
      height: 48px;
      background: #003ec7;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      font-family: 'Inter', sans-serif;
    }

    .btn-primary:hover {
      background: #0052ff;
    }

    .btn-primary:active {
      transform: scale(0.98);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-arrow {
      font-size: 18px;
      transition: transform 0.2s;
    }

    .btn-primary:hover .btn-arrow {
      transform: translateX(4px);
    }

    .btn-retry {
      max-width: 280px;
      margin: 0 auto;
    }

    .btn-spinner {
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }

    .spinner-track {
      opacity: 0.25;
    }

    .spinner-arc {
      opacity: 0.75;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .status-section {
      text-align: center;
      padding: 24px 0;
    }

    .status-section h2 {
      margin: 12px 0 8px;
      color: #191c1e;
    }

    .status-section p {
      color: #434656;
      margin-bottom: 20px;
    }

    .status-spinner {
      font-size: 32px;
      color: #003ec7;
      animation: spin 1s linear infinite;
    }

    .status-icon {
      font-size: 40px;
    }

    .status-section.error .status-icon {
      color: #ba1a1a;
    }

    .status-section.success .status-icon {
      color: #22C55E;
    }

    .card-footer {
      width: 100%;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid rgba(195, 197, 217, 0.3);
      display: flex;
      justify-content: center;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 500;
      color: #003ec7;
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .back-link span {
      font-size: 16px;
    }

    .validar-footer {
      margin-top: 24px;
      text-align: center;
    }

    .validar-footer p {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: rgba(115, 118, 136, 0.6);
      margin: 0;
    }
  `],
})
export class ValidarConviteComponent implements OnInit {
  token = '';
  carregando = false;
  validando = false;
  conviteInvalido = false;
  conviteValido = false;

  private conviteService = inject(ConviteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const tokenUrl = this.route.snapshot.queryParams['token'];
    if (tokenUrl) {
      this.token = tokenUrl;
      this.validar();
    }
  }

  validar(): void {
    if (!this.token.trim()) return;

    this.carregando = true;
    this.validando = true;
    this.conviteInvalido = false;

    this.conviteService.validar(this.token.trim())
      .pipe(finalize(() => {
        this.carregando = false;
        this.validando = false;
      }))
      .subscribe({
        next: (convite) => {
          this.conviteValido = true;

          if (convite.tipo === 'EMPRESA' || convite.tipo === 'Empresa') {
            this.notificationService.success('Convite Válido!', 'Redirecionando para cadastro da empresa.');
            setTimeout(() => this.router.navigate(['/empresa/registro'], {
              queryParams: { token: this.token.trim() }
            }), 1000);
          } else if (convite.tipo === 'RECRUTADOR' || convite.tipo === 'Recrutador') {
            this.notificationService.success('Convite Válido!', 'Redirecionando para cadastro do recrutador.');
            setTimeout(() => this.router.navigate(['/recrutador/registro'], {
              queryParams: { token: this.token.trim() }
            }), 1000);
          } else {
            this.notificationService.error('Tipo desconhecido', 'Tipo de convite não reconhecido.');
            this.conviteValido = false;
          }
        },
        error: () => {
          this.conviteInvalido = true;
        },
      });
  }

  reiniciar(): void {
    this.token = '';
    this.conviteInvalido = false;
    this.conviteValido = false;
    this.carregando = false;
  }
}