import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FileView } from '../../components/file-view/file-view';
import { KmerView } from '../../components/kmer-view/kmer-view';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LineChart } from '../../components/line-chart/line-chart';
import { SpinnerService } from '../../services/spinner.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

declare var loadPyodide: (options: { indexURL: string }) => Promise<any>;

interface KMerVecResult {
  header: string[];
  vectors: { file: string; id: string; vector: number[] }[];
}

@Component({
  selector: 'app-composition-visualisation-by-kmers',
  imports: [ReactiveFormsModule, FileView, KmerView, ButtonModule, LineChart, ToastModule],
  providers: [MessageService],
  templateUrl: './composition-visualisation-by-kmers.html',
  styleUrl: './composition-visualisation-by-kmers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionVisualisationByKmers {
  readonly form = new FormGroup({
    files: new FormControl<File[]>([], {
      nonNullable: true,
      validators: [minFilesValidator(2)],
    }),
    kmer: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  });
  readonly spinner = inject(SpinnerService);
  private readonly messageService = inject(MessageService);
  pyodideVersion = '0.29.3';
  header = signal<string[]>([]);
  data = signal<number[][]>([]);
  refNames = signal<string[]>([]);

  async computeCompositionVectors() {
    this.spinner.show('Computing composition vectors...');
    try {
      console.log('Computing composition vectors...');
      const pyodide = await loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${this.pyodideVersion}/full/`,
      });
      await pyodide.loadPackage('/pykmertools-0.2.1-cp39-abi3-emscripten_4_0_9_wasm32.whl');
      await pyodide.loadPackage('biopython');
      pyodide.runPython(`__name__ = "__not_main__"`);
      pyodide.runPython(await (await fetch('/composition.py')).text());

      const fileNames = this.form.value.files?.map((f) => f.name) ?? [];
      for (const file of this.form.value.files ?? []) {
        console.log('Loading file into pyodide FS:', file.name);
        pyodide.FS.writeFile(file.name, new Uint8Array(await file.arrayBuffer()));
      }

      const result: KMerVecResult = (
        await pyodide.globals['vectorise_from_files'].call(null, fileNames, this.form.value.kmer!)
      ).toJs();

      this.header.set(result.header);
      this.data.set(result.vectors.map((v) => v.vector));
      this.refNames.set(result.vectors.map((v) => `${v.file} | ${v.id}`));
    } catch (error) {
      console.error('Error computing composition vectors:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          error instanceof Error
            ? error.message
            : 'An error occurred while computing composition vectors',
      });
    } finally {
      this.spinner.hide();
    }
  }
}

function minFilesValidator(min: number) {
  return (control: AbstractControl<File[] | null>): ValidationErrors | null => {
    const value = control.value ?? [];
    return value.length >= min ? null : { minFiles: { required: min, actual: value.length } };
  };
}
