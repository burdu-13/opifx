import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CropControls } from './crop-controls';

describe('CropControls', () => {
  let component: CropControls;
  let fixture: ComponentFixture<CropControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropControls],
    }).compileComponents();

    fixture = TestBed.createComponent(CropControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
