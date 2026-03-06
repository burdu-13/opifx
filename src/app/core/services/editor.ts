import { computed, Injectable, signal } from '@angular/core';
import { EditorStep, FilterState, INITIAL_FILTERS } from '../../shared/interfaces/editor.interface';

@Injectable({
  providedIn: 'root',
})
export class Editor {
  private readonly stepSignal = signal<EditorStep>('UPLOAD');
  private readonly sourceImageSignal = signal<string | null>(null);
  private readonly filtersSignal = signal<FilterState>(INITIAL_FILTERS);

  public readonly step = this.stepSignal.asReadonly();
  public readonly sourceImage = this.sourceImageSignal.asReadonly();
  public readonly filters = this.filtersSignal.asReadonly();

  public readonly filterString = computed(() => {
    const f = this.filtersSignal();
    return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
  });

  public setStep(newStep: EditorStep): void {
    this.stepSignal.set(newStep);
  }

  public setImage(base64: string): void {
    this.sourceImageSignal.set(base64);
    this.stepSignal.set('EDIT');
  }

  public updateFilter(update: Partial<FilterState>): void {
    this.filtersSignal.update((state) => ({ ...state, ...update }));
  }

  public reset(): void {
    this.filtersSignal.set(INITIAL_FILTERS);
    this.sourceImageSignal.set(null);
    this.stepSignal.set('UPLOAD');
  }
}
