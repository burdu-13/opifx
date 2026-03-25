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
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { CropRect, FilterState } from '../../interfaces/editor.interface';
import { CanvasRenderer } from '../../../features/editor/utils/canvas-renderer';

@Component({
  selector: 'app-preview-image',
  imports: [],
  templateUrl: './preview-image.html',
  styleUrl: './preview-image.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewImage implements AfterViewInit, OnDestroy {
  public readonly src = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly zoom = input.required<number>();
  public readonly position = input.required<{ x: number; y: number }>();
  public readonly appliedCropRect = input<CropRect | null>(null);

  public readonly pan = output<{ x: number; y: number }>();
  public readonly zoomDelta = output<number>();
  public readonly canvasDimensions = output<{ width: number; height: number }>();

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('mainCanvas');
  private readonly wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapperRef');
  private readonly imageElement = new Image();

  public readonly isDragging = signal<boolean>(false);
  private startX: number = 0;
  private startY: number = 0;

  public readonly displayWidth = signal<number>(0);
  public readonly displayHeight = signal<number>(0);

  private renderFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  public readonly transformStyle = computed(
    () =>
      `translate(calc(-50% + ${this.position().x}px), calc(-50% + ${this.position().y}px)) scale(${this.zoom()})`,
  );

  public readonly containerStyle = computed(() => ({
    width: `${this.displayWidth()}px`,
    height: `${this.displayHeight()}px`,
  }));

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
      this.appliedCropRect();
      this.scheduleRender();
    });
  }

  public ngAfterViewInit(): void {
    const wrapperEl = this.wrapper()?.nativeElement;
    if (wrapperEl) {
      this.resizeObserver = new ResizeObserver(() => this.updateDisplaySize());
      this.resizeObserver.observe(wrapperEl);
    }
  }

  public ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.renderFrameId) cancelAnimationFrame(this.renderFrameId);
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

  private updateDisplaySize(): void {
    const canvasEl = this.canvas()?.nativeElement;
    const wrapperEl = this.wrapper()?.nativeElement;

    if (!canvasEl || !wrapperEl) return;

    const bufW = canvasEl.width;
    const bufH = canvasEl.height;
    const availW = wrapperEl.clientWidth;
    const availH = wrapperEl.clientHeight;

    if (availW <= 0 || availH <= 0 || bufW === 0 || bufH === 0) return;

    const padding = 64;
    const safeW = Math.max(10, availW - padding);
    const safeH = Math.max(10, availH - padding);

    const fitScale = Math.min(safeW / bufW, safeH / bufH, 1);

    this.displayWidth.set(Math.floor(bufW * fitScale));
    this.displayHeight.set(Math.floor(bufH * fitScale));

    this.canvasDimensions.emit({ width: bufW, height: bufH });
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

    CanvasRenderer.render(
      canvasEl,
      this.imageElement,
      this.filters(),
      1600,
      this.appliedCropRect(),
    );
    this.updateDisplaySize();
  }
}
