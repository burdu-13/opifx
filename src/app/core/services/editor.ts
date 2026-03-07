import { computed, Injectable, signal } from '@angular/core';
import {
  EditorStep,
  FilterState,
  NEUTRAL_FILTERS,
  Preset,
} from '../../shared/interfaces/editor.interface';

@Injectable({
  providedIn: 'root',
})
export class Editor {
  private readonly stepSignal = signal<EditorStep>('UPLOAD');
  private readonly sourceImageSignal = signal<string | null>(null);
  private readonly filtersSignal = signal<FilterState>(NEUTRAL_FILTERS);

  public readonly step = this.stepSignal.asReadonly();
  public readonly sourceImage = this.sourceImageSignal.asReadonly();
  public readonly filters = this.filtersSignal.asReadonly();

  public readonly filterString = computed(() => {
    const f = this.filtersSignal();
    return `
    brightness(${f.brightness}%) 
    contrast(${f.contrast}%) 
    saturate(${f.saturation}%) 
    sepia(${f.sepia ?? 0}%) 
    hue-rotate(${f.hueRotate ?? 0}deg) 
    blur(${f.blur ?? 0}px)
    grayscale(${f.grayscale ?? 0}%)
  `.trim();
  });

  public setStep(newStep: EditorStep): void {
    this.stepSignal.set(newStep);
  }

  public applyPreset(preset: Preset): void {
    this.filtersSignal.set({
      ...NEUTRAL_FILTERS,
      ...preset.state,
    });
  }

  public setImage(base64: string): void {
    this.sourceImageSignal.set(base64);
    this.stepSignal.set('EDIT');
  }

  public updateFilter(update: Partial<FilterState>): void {
    this.filtersSignal.update((state) => ({ ...state, ...update }));
  }

  public reset(): void {
    this.filtersSignal.set(NEUTRAL_FILTERS);
    this.sourceImageSignal.set(null);
    this.stepSignal.set('UPLOAD');
  }
}
