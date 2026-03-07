import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FilterEngine } from '../../utils/filter-engine.utils';
import { FilterState } from '../../../../shared/interfaces/editor.interface';
import { LibSlider } from '../../../../shared/components/lib-slider/lib-slider';

@Component({
  selector: 'app-edit-step',
  imports: [LibSlider],
  templateUrl: './edit-step.html',
  styleUrl: './edit-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStep {
  public readonly image = input.required<string | null>();
  public readonly filters = input.required<FilterState>();

  public readonly filterChange = output<Partial<FilterState>>();
  public readonly proceed = output<void>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('mainCanvas');
  private readonly imageElement = new Image();

  constructor() {
    effect(() => {
      const src = this.image();
      if (src) {
        this.imageElement.src = src;
      }
    });

    effect(() => {
      this.filters();
      this.render();
    });
  }

  private render(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl || !this.imageElement.complete) return;

    const ctx = canvasEl.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvasEl.width = this.imageElement.width;
    canvasEl.height = this.imageElement.height;

    const f = this.filters();

    ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
    ctx.drawImage(this.imageElement, 0, 0);

    if (f.grain > 0) {
      FilterEngine.applyGrain(ctx, canvasEl.width, canvasEl.height, f.grain);
    }
    if (f.chromaticAberration > 0) {
      FilterEngine.applyChromaticAberration(
        ctx,
        canvasEl.width,
        canvasEl.height,
        f.chromaticAberration,
      );
    }
  }

  public update(key: keyof FilterState, val: number): void {
    this.filterChange.emit({ [key]: val });
  }
}
