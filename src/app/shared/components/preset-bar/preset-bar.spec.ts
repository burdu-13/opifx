import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetBar } from './preset-bar';

describe('PresetBar', () => {
  let component: PresetBar;
  let fixture: ComponentFixture<PresetBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresetBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresetBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
