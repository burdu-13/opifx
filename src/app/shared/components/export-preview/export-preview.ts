import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
  AfterViewInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CropRect, FilterState } from '../../interfaces/editor.interface';
import { CanvasRenderer } from '../../../features/editor/utils/canvas-renderer';

@Component({
  selector: 'app-export-preview',
  imports: [],
  templateUrl: './export-preview.html',
  styleUrl: './export-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportPreview implements AfterViewInit, OnDestroy {
  public readonly src = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly cropRect = input<CropRect | null>(null);

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('exportCanvas');
  private readonly wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapperRef');
  private readonly imageElement = new Image();

  public readonly displayWidth = signal<number>(0);
  public readonly displayHeight = signal<number>(0);

  private resizeObserver: ResizeObserver | null = null;
  private renderFrameId: number | null = null;

  constructor() {
    this.imageElement.onload = () => this.scheduleRender();

    effect(() => {
      const source = this.src();
      if (source) this.imageElement.src = source;
    });

    effect(() => {
      this.filters();
      this.cropRect();
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

  private executeRender(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl || !this.imageElement.complete) return;

    CanvasRenderer.render(canvasEl, this.imageElement, this.filters(), 1200, this.cropRect());

    this.updateDisplaySize();
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

    const safeW = Math.max(10, availW);
    const safeH = Math.max(10, availH);

    const fitScale = Math.min(safeW / bufW, safeH / bufH, 1);

    this.displayWidth.set(Math.floor(bufW * fitScale));
    this.displayHeight.set(Math.floor(bufH * fitScale));
  }
}
