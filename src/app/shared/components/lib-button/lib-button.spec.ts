import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibButton } from './lib-button';

describe('LibButton', () => {
  let component: LibButton;
  let fixture: ComponentFixture<LibButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
