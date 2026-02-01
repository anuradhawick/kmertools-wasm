import { Component, ChangeDetectionStrategy, signal, forwardRef, Injector } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { inject } from '@angular/core';

interface KMerSize {
  label: string;
  k: number;
}

@Component({
  selector: 'app-kmer-view',
  imports: [SelectModule],
  templateUrl: './kmer-view.html',
  styleUrl: './kmer-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KmerView),
      multi: true,
    },
  ],
})
export class KmerView implements ControlValueAccessor {
  kMerSizes: KMerSize[] = [
    { label: '3', k: 3 },
    { label: '4', k: 4 },
    { label: '5', k: 5 },
  ];

  private injector = inject(Injector);

  // Lazy getter to avoid circular dependency
  get ngControl(): NgControl | null {
    return this.injector.get(NgControl, null);
  }

  selectedK = signal<number | null>(null);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  onKChange(value: number | null) {
    if (this.isDisabled) {
      return;
    }
    this.selectedK.set(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: number | null): void {
    this.selectedK.set(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
