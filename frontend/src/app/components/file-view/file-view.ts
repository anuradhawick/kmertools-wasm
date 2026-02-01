import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  forwardRef,
  Injector,
  input,
} from '@angular/core';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DecimalPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-file-view',
  imports: [FileUploadModule, ToastModule, DecimalPipe],
  providers: [
    MessageService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileView),
      multi: true,
    },
  ],
  templateUrl: './file-view.html',
  styleUrl: './file-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileView implements ControlValueAccessor {
  private messageService = inject(MessageService);
  private injector = inject(Injector);

  // Lazy getter to avoid circular dependency
  get ngControl(): NgControl | null {
    return this.injector.get(NgControl, null);
  }

  // Internal value as a signal for reactive rendering
  files = signal<File[]>([]);

  // Configurable minimum file count for validation
  minFileCount = input(1);

  // CVA callbacks
  private onChange: (value: File[]) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  onSelect(event: FileSelectEvent) {
    if (this.isDisabled) {
      return;
    }
    const current = this.files();
    const newFiles = Array.from(event.files).filter(
      (file) => !current.some((f) => f.name === file.name && f.size === file.size),
    );

    if (newFiles.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Files',
        detail: 'All selected files are already added.',
        life: 3000,
      });
      return;
    }

    const duplicateCount = event.files.length - newFiles.length;
    const next = [...current, ...newFiles];
    this.files.set(next);
    this.onChange(next);
    this.onTouched();

    const detail =
      duplicateCount > 0
        ? `${newFiles.length} file(s) added. ${duplicateCount} duplicate(s) skipped.`
        : `${newFiles.length} file(s) added successfully.`;

    this.messageService.add({
      severity: 'info',
      summary: 'File Added',
      detail,
      life: 3000,
    });
  }

  removeFile(index: number) {
    if (this.isDisabled) {
      return;
    }
    const current = this.files();
    const removed = current[index];
    const next = current.filter((_, i) => i !== index);
    this.files.set(next);
    this.onChange(next);
    this.onTouched();
    this.messageService.add({
      severity: 'info',
      summary: 'File Removed',
      detail: `${removed.name} has been removed.`,
      life: 3000,
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: File[] | null): void {
    this.files.set(value ?? []);
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
