import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { FilterState } from '../../../../../../shared/interfaces/editor.interface';
import { CanvasRendererUtil } from '../../../../utils/canvas-renderer.utils';

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

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('exportCanvas');
  private readonly imageElement = new Image();

  constructor() {
    this.imageElement.onload = () => {
      CanvasRendererUtil.render(
        this.canvas()?.nativeElement,
        this.imageElement,
        this.filters(),
        1200,
      );
    };

    effect(() => {
      const source = this.src();
      if (source) this.imageElement.src = source;
    });

    effect(() => {
      const f = this.filters();
      CanvasRendererUtil.render(this.canvas()?.nativeElement, this.imageElement, f, 1200);
    });
  }
}
