import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionVisualisationByKmers } from './composition-visualisation-by-kmers';

describe('CompositionVisualisationByKmers', () => {
  let component: CompositionVisualisationByKmers;
  let fixture: ComponentFixture<CompositionVisualisationByKmers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionVisualisationByKmers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionVisualisationByKmers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
