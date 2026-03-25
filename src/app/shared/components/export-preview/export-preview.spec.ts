import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPreview } from './export-preview';

describe('ExportPreview', () => {
  let component: ExportPreview;
  let fixture: ComponentFixture<ExportPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
