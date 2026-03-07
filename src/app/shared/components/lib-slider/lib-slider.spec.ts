import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibSlider } from './lib-slider';

describe('LibSlider', () => {
  let component: LibSlider;
  let fixture: ComponentFixture<LibSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
