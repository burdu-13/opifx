import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportStepContainer } from './export-step';

describe('ExportStepContainer', () => {
  let component: ExportStepContainer;
  let fixture: ComponentFixture<ExportStepContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportStepContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportStepContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
