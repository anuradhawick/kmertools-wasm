import { Component, inject, signal } from '@angular/core';
import { FileView } from '../../components/file-view/file-view';
import { Button } from 'primeng/button';
import { NumberView } from '../../components/number-view/number-view';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SpinnerService } from '../../services/spinner.service';
import { ScatterChart } from '../../components/scatter-chart/scatter-chart';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

declare var loadPyodide: (options: { indexURL: string }) => Promise<any>;

type ScatterDataPoint = [number, number];

interface CGRVecResultItem {
  file: string;
  id: string;
  vector: ScatterDataPoint[];
}

type CGRVecResult = Array<CGRVecResultItem>;

@Component({
  selector: 'app-composition-visualisation-by-cgr',
  imports: [ReactiveFormsModule, FileView, Button, NumberView, ScatterChart, ToastModule],
  providers: [MessageService],
  templateUrl: './composition-visualisation-by-cgr.html',
  styleUrl: './composition-visualisation-by-cgr.css',
})
export class CompositionVisualisationByCgr {
  readonly form = new FormGroup({
    files: new FormControl<File[]>([], {
      nonNullable: true,
      validators: [minFilesValidator(1)],
    }),
    vecsize: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  });
  readonly spinner = inject(SpinnerService);
  private readonly messageService = inject(MessageService);
  pyodideVersion = '0.29.3';
  data = signal<ScatterDataPoint[][]>([]);
  refNames = signal<string[]>([]);

  async computeCGRVectors() {
    this.spinner.show('Computing CGR vectors...');

    try {
      console.log('Computing composition vectors...');
      const pyodide = await loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${this.pyodideVersion}/full/`,
      });
      await pyodide.loadPackage('/pykmertools-0.2.1-cp39-abi3-emscripten_4_0_9_wasm32.whl');
      await pyodide.loadPackage('biopython');
      pyodide.runPython(`__name__ = "__not_main__"`);
      pyodide.runPython(await (await fetch('/cgr.py')).text());

      const fileNames = this.form.value.files?.map((f) => f.name) ?? [];
      for (const file of this.form.value.files ?? []) {
        console.log('Loading file into pyodide FS:', file.name);
        pyodide.FS.writeFile(file.name, new Uint8Array(await file.arrayBuffer()));
      }

      const result: CGRVecResult = (
        await pyodide.globals['vectorise_from_files'].call(
          null,
          fileNames,
          this.form.value.vecsize!,
        )
      ).toJs();

      console.log('CGR Result:', result);
      this.refNames.set(result.map((v) => `${v.file} | ${v.id}`));
      this.data.set(result.map((v) => v.vector));
    } catch (error) {
      console.error('Error computing CGR vectors:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          error instanceof Error ? error.message : 'An error occurred while computing CGR vectors',
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
