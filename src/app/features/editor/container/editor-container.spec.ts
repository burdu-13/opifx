import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorContainer } from './editor-container';

describe('EditorContainer', () => {
  let component: EditorContainer;
  let fixture: ComponentFixture<EditorContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
