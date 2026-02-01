import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberView } from './number-view';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  template: `<app-number-view [formControl]="control" [minValue]="min" [maxValue]="max" />`,
  imports: [NumberView, ReactiveFormsModule],
})
class TestHostComponent {
  control = new FormControl<number | null>(null);
  min = 1;
  max = 5;
}

describe('NumberView', () => {
  let component: NumberView;
  let fixture: ComponentFixture<NumberView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberView],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selectedValue when writeValue is called', () => {
    component.writeValue(3);
    expect(component.selectedValue()).toBe(3);
  });
});

describe('NumberView with FormControl', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should work with reactive forms', () => {
    hostComponent.control.setValue(3);
    hostFixture.detectChanges();

    const numberView = hostFixture.debugElement.children[0].componentInstance as NumberView;
    expect(numberView.selectedValue()).toBe(3);
  });
});
