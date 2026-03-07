import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FilterState } from '../../../../../../shared/interfaces/editor.interface';
import { FilterEngine } from '../../../../utils/filter-engine.utils';

@Component({
  selector: 'app-preview-image',
  imports: [],
  templateUrl: './preview-image.html',
  styleUrl: './preview-image.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewImage {
  public readonly src = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly zoom = input.required<number>();
  public readonly position = input.required<{ x: number; y: number }>();

  public readonly pan = output<{ x: number; y: number }>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('mainCanvas');
  private readonly imageElement = new Image();

  private isDragging = false;
  private startX = 0;
  private startY = 0;

  public readonly transformStyle = computed(
    () => `translate(${this.position().x}px, ${this.position().y}px) scale(${this.zoom()})`,
  );

  constructor() {
    // FIX: Guarantee a render as soon as the image successfully loads into memory
    this.imageElement.onload = () => {
      this.render();
    };

    effect(() => {
      const source = this.src();
      if (source) {
        this.imageElement.src = source;
      }
    });

    effect(() => {
      this.filters(); // Track filter changes
      this.render();
    });
  }

  public onMouseDown(e: MouseEvent): void {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  public onMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.pan.emit({ x: dx, y: dy });
  }

  public onMouseUp(): void {
    this.isDragging = false;
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
}
