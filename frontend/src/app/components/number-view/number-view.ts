import {
  Component,
  ChangeDetectionStrategy,
  signal,
  forwardRef,
  Injector,
  input,
  inject,
} from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-number-view',
  imports: [InputNumberModule, FormsModule],
  templateUrl: './number-view.html',
  styleUrl: './number-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberView),
      multi: true,
    },
  ],
})
export class NumberView implements ControlValueAccessor {
  readonly minValue = input<number>(1);
  readonly maxValue = input<number>(10);
  readonly label = input<string>('Select a Number');
  readonly description = input<string>('Select a number from the available options.');
  readonly errorMessage = input<string>('Please select a number to continue.');

  private injector = inject(Injector);

  // Lazy getter to avoid circular dependency
  get ngControl(): NgControl | null {
    return this.injector.get(NgControl, null);
  }

  selectedValue = signal<number | null>(null);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  onValueChange(value: number | null) {
    if (this.isDisabled) {
      return;
    }
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: number | null): void {
    this.selectedValue.set(value);
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
