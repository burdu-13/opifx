import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
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
  public readonly zoomDelta = output<number>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('mainCanvas');
  private readonly imageElement = new Image();

  public readonly isDragging = signal(false);
  private startX = 0;
  private startY = 0;

  private renderFrameId: number | null = null;
  public readonly transformStyle = computed(
    () => `translate(${this.position().x}px, ${this.position().y}px) scale(${this.zoom()})`,
  );

  constructor() {
    this.imageElement.onload = () => this.scheduleRender();

    effect(() => {
      const source = this.src();
      if (source) {
        this.imageElement.src = source;
      }
    });

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
    this.isDragging.set(true);
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  public onMouseMove(e: MouseEvent): void {
    if (!this.isDragging()) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.pan.emit({ x: dx, y: dy });
  }

  public onMouseUp(): void {
    this.isDragging.set(false);
  }

  public onWheel(e: WheelEvent): void {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    this.zoomDelta.emit(delta);
  }

  private executeRender(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl || !this.imageElement.complete) return;

    CanvasRendererUtil.render(canvasEl, this.imageElement, this.filters(), 1200);
  }
}
