import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionVisualisationByCgr } from './composition-visualisation-by-cgr';

describe('CompositionVisualisationByCgr', () => {
  let component: CompositionVisualisationByCgr;
  let fixture: ComponentFixture<CompositionVisualisationByCgr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionVisualisationByCgr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionVisualisationByCgr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
