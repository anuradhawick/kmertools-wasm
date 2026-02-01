import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner';
import { SpinnerService } from '../../services/spinner.service';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinnerService: SpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    spinnerService = TestBed.inject(SpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show spinner by default', () => {
    const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
    expect(overlay).toBeNull();
  });

  it('should show spinner when service.show() is called', () => {
    spinnerService.show();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should hide spinner when service.hide() is called', () => {
    spinnerService.show();
    fixture.detectChanges();

    spinnerService.hide();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
    expect(overlay).toBeNull();
  });

  it('should display message when provided', () => {
    spinnerService.show('Loading data...');
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.spinner-message');
    expect(message.textContent).toBe('Loading data...');
  });

  it('should not display message element when no message provided', () => {
    spinnerService.show();
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.spinner-message');
    expect(message).toBeNull();
  });
});
