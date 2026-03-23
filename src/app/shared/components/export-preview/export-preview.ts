import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
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
export class ExportPreview {
  public readonly src = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly cropRect = input<CropRect | null>(null);

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('exportCanvas');
  private readonly imageElement = new Image();

  constructor() {
    this.imageElement.onload = () => this.renderCanvas();

    effect(() => {
      const source = this.src();
      if (source) this.imageElement.src = source;
    });

    effect(() => {
      this.filters();
      this.cropRect();
      this.renderCanvas();
    });
  }

  private renderCanvas(): void {
    CanvasRenderer.render(
      this.canvas()?.nativeElement,
      this.imageElement,
      this.filters(),
      1200,
      this.cropRect(),
    );
  }
}
