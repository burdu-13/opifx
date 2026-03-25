import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditControls } from './edit-controls';

describe('EditControls', () => {
  let component: EditControls;
  let fixture: ComponentFixture<EditControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
