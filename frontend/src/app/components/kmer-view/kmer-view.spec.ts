import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmerView } from './kmer-view';

describe('KmerView', () => {
  let component: KmerView;
  let fixture: ComponentFixture<KmerView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KmerView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KmerView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
