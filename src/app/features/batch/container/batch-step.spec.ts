import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatchStepContainer } from './batch-step';

describe('BatchStep', () => {
  let component: BatchStepContainer;
  let fixture: ComponentFixture<BatchStepContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchStepContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchStepContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
