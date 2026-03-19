import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibPill } from './lib-pill';

describe('LibPill', () => {
  let component: LibPill;
  let fixture: ComponentFixture<LibPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibPill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibPill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
