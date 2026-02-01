import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private readonly _loading = signal(false);
  private readonly _message = signal<string | null>(null);

  readonly isLoading = this._loading.asReadonly();
  readonly message = this._message.asReadonly();

  show(message?: string): void {
    this._message.set(message ?? null);
    this._loading.set(true);
  }

  hide(): void {
    this._loading.set(false);
    this._message.set(null);
  }
}
