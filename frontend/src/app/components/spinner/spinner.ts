import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  private readonly spinnerService = inject(SpinnerService);

  readonly isLoading = this.spinnerService.isLoading;
  readonly message = this.spinnerService.message;
}
