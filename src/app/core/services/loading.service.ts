import { Injectable, signal } from '@angular/core';

/**
 * Serviço simples para controlar o estado de loading global
 * Usado pelo LoadingInterceptor
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // Signal que indica se deve mostrar o loading
  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  mostrar(): void {
    this._loading.set(true);
  }

  esconder(): void {
    this._loading.set(false);
  }
}
