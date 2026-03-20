import { ChangeDetectionStrategy, Component, effect, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportFormat } from '../interfaces/export.interface';
import { CanvasRendererUtil } from '../../../utils/canvas-renderer.utils';
import { CropRect, FilterState } from '../../../../../shared/interfaces/editor.interface';
import { ExportPreview } from '../components/export-preview/export-preview';
import { ExportControls } from '../components/export-controls/export-controls';
import { Editor } from '../../../../../core/services/editor';
import { CropService } from '../../../../../core/services/crop.service';

@Component({
  selector: 'app-export-step',
  imports: [ExportPreview, ExportControls],
  templateUrl: './export-step-container.html',
  styleUrl: './export-step-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportStepContainer implements OnInit {
  private readonly srv = inject(Editor);
  private readonly cropSrv = inject(CropService);
  private readonly router = inject(Router);

  public readonly image = this.srv.sourceImage;
  public readonly filters = this.srv.filters;
  public readonly cropRect = this.cropSrv.cropRect;

  public readonly format = signal<ExportFormat>('image/png');

  public readonly formats: { label: string; value: ExportFormat }[] = [
    { label: 'PNG (Lossless)', value: 'image/png' },
    { label: 'JPEG (High)', value: 'image/jpeg' },
    { label: 'WEBP (Optimized)', value: 'image/webp' },
  ];

  public readonly quality = signal<number>(0.9);
  public readonly scale = signal<number>(1);
  public readonly estimatedSize = signal<string>('Calculating...');
  public readonly isProcessing = signal<boolean>(false);

  constructor() {
    effect(() => {
      const src = this.image();
      const f = this.format();
      const q = this.quality();
      const s = this.scale();
      const flt = this.filters();
      const crop = this.cropRect();

      if (src) {
        this.estimateSize(src, flt, f, q, s, crop);
      }
    });
  }

  public ngOnInit() {
    if (!this.image()) {
      this.router.navigate(['/']);
    }
  }

  public goBack(): void {
    this.router.navigate(['/edit']);
  }

  private estimateSize(
    src: string,
    filters: FilterState,
    format: ExportFormat,
    quality: number,
    scale: number,
    crop?: CropRect | null,
  ): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const offscreenCanvas = document.createElement('canvas');
      CanvasRendererUtil.render(offscreenCanvas, img, filters, undefined, crop);

      let finalCanvas = offscreenCanvas;
      if (scale !== 1) {
        finalCanvas = document.createElement('canvas');
        finalCanvas.width = Math.max(1, offscreenCanvas.width * scale);
        finalCanvas.height = Math.max(1, offscreenCanvas.height * scale);
        const ctx = finalCanvas.getContext('2d');
        if (ctx) ctx.drawImage(offscreenCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
      }

      finalCanvas.toBlob(
        (blob) => {
          if (blob) {
            const mb = blob.size / (1024 * 1024);
            this.estimatedSize.set(
              mb < 1 ? `${(blob.size / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`,
            );
          } else {
            this.estimatedSize.set('Unknown');
          }
        },
        format,
        quality,
      );
    };
    img.src = src;
  }

  public handleDownload(): void {
    const src = this.image();
    if (!src) return;

    this.isProcessing.set(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const offscreenCanvas = document.createElement('canvas');

      CanvasRendererUtil.render(offscreenCanvas, img, this.filters(), undefined, this.cropRect());

      let finalCanvas = offscreenCanvas;
      if (this.scale() !== 1) {
        finalCanvas = document.createElement('canvas');
        finalCanvas.width = Math.max(1, offscreenCanvas.width * this.scale());
        finalCanvas.height = Math.max(1, offscreenCanvas.height * this.scale());
        const ctx = finalCanvas.getContext('2d');
        if (ctx) ctx.drawImage(offscreenCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
      }

      const dataUrl = finalCanvas.toDataURL(this.format(), this.quality());
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
