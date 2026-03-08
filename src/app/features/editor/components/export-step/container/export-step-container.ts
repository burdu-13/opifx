import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ExportFormat } from '../interfaces/export.interface';
import { CanvasRendererUtil } from '../../../utils/canvas-renderer.utils';
import { FilterState } from '../../../../../shared/interfaces/editor.interface';
import { ExportPreview } from "../components/export-preview/export-preview";
import { ExportControls } from "../components/export-controls/export-controls";

@Component({
  selector: 'app-export-step',
  imports: [ExportPreview, ExportControls],
  templateUrl: './export-step-container.html',
  styleUrl: './export-step-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportStepContainer {
  public readonly image = input.required<string | null>();
  public readonly filters = input.required<FilterState>();

  public readonly goBack = output<void>();

  public readonly format = signal<ExportFormat>('image/png');
  public readonly isProcessing = signal<boolean>(false);

  public handleDownload(): void {
    const src = this.image();
    if (!src) return;

    this.isProcessing.set(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const offscreenCanvas = document.createElement('canvas');

      CanvasRendererUtil.render(offscreenCanvas, img, this.filters());

      const dataUrl = offscreenCanvas.toDataURL(this.format(), 1.0);
      this.triggerBrowserDownload(dataUrl, this.format());

      this.isProcessing.set(false);
    };

    img.src = src;
  }

  private triggerBrowserDownload(dataUrl: string, mimeType: ExportFormat): void {
    const extension = mimeType.split('/')[1];
    const filename = `opifx-render-${Date.now()}.${extension}`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
