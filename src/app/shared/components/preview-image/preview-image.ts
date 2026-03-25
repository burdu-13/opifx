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

  public readonly isDragging = signal(false);
  private startX = 0;
  private startY = 0;

  public readonly displayWidth = signal<number>(0);
  public readonly displayHeight = signal<number>(0);

  private renderFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  public readonly transformStyle = computed(
    () => `translate(${this.position().x}px, ${this.position().y}px) scale(${this.zoom()})`,
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
    if (bufW === 0 || bufH === 0) return;

    const style = getComputedStyle(wrapperEl);
    const padH = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    const padV = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
    const availW = wrapperEl.clientWidth - padH;
    const availH = wrapperEl.clientHeight - padV;

    if (availW <= 0 || availH <= 0) return;

    const scale = Math.min(availW / bufW, availH / bufH, 1);
    this.displayWidth.set(Math.floor(bufW * scale));
    this.displayHeight.set(Math.floor(bufH * scale));
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
      1200,
      this.appliedCropRect(),
    );
    this.canvasDimensions.emit({ width: canvasEl.width, height: canvasEl.height });
    this.updateDisplaySize();
  }
}
