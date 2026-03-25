import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryGrid } from './library-grid';

describe('LibraryGrid', () => {
  let component: LibraryGrid;
  let fixture: ComponentFixture<LibraryGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
