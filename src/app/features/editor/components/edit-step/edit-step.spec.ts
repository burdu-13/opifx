import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStep } from './edit-step';

describe('EditStep', () => {
  let component: EditStep;
  let fixture: ComponentFixture<EditStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
