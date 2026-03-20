import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CropOverlay } from './crop-overlay';

describe('CropOverlay', () => {
  let component: CropOverlay;
  let fixture: ComponentFixture<CropOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(CropOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
