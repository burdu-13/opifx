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
import { CanvasRendererUtil } from '../../../../utils/canvas-renderer.utils';

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

  private renderFrameId: number | null = null;

  public readonly transformStyle = computed(
    () => `translate(${this.position().x}px, ${this.position().y}px) scale(${this.zoom()})`,
  );

  constructor() {
    // Trigger render when the image finishes loading
    this.imageElement.onload = () => this.scheduleRender();

    // Update image source when input changes
    effect(() => {
      const source = this.src();
      if (source) {
        this.imageElement.src = source;
      }
    });

    // Re-render when filters change
    effect(() => {
      this.filters();
      this.scheduleRender();
    });
  }

  private scheduleRender(): void {
    if (this.renderFrameId) {
      cancelAnimationFrame(this.renderFrameId);
    }

    this.renderFrameId = requestAnimationFrame(() => {
      this.executeRender();
      this.renderFrameId = null;
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

  public readonly cssFilterPreview = computed(() => {
    const f = this.filters();
    return `
    brightness(${f.brightness}%) 
    contrast(${f.contrast}%) 
    saturate(${f.saturation}%) 
    blur(${f.blur}px)
  `;
  });

  public onMouseUp(): void {
    this.isDragging = false;
  }

  private executeRender(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl || !this.imageElement.complete) return;

    // Ensure CanvasRendererUtil handles the internal drawing logic
    CanvasRendererUtil.render(canvasEl, this.imageElement, this.filters());
  }
}
