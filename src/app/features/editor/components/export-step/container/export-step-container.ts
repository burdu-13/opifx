import { ChangeDetectionStrategy, Component, computed, signal, inject, OnInit } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, from, concatMap, delay, of, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { CanvasRenderer } from '../../../utils/canvas-renderer';
import { CropRect, ExportFormat, ExportFormatOption, FilterState, ImageState } from '../../../../../shared/interfaces/editor.interface';
import { ExportPreview } from '../../../../../shared/components/export-preview/export-preview';
import { ExportControls } from '../../../../../shared/components/export-controls/export-controls';
import { Editor } from '../../../../../core/services/editor/editor';
import { Crop } from '../../../../../core/services/crop/crop';

@Component({
  selector: 'app-export-step',
  imports: [ExportPreview, ExportControls],
  templateUrl: './export-step-container.html',
  styleUrl: './export-step-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportStepContainer implements OnInit {
  private readonly srv = inject(Editor);
  private readonly cropSrv = inject(Crop);
  private readonly router = inject(Router);

  private readonly previewImageState = computed(() => 
    this.srv.activeImageObj() || (this.srv.isBatchMode() ? this.srv.imagesList()[0] : null)
  );

  public readonly image = computed(() => this.previewImageState()?.url || null);
  public readonly filters = computed(() => this.previewImageState()?.filters || this.srv.filters());
  public readonly cropRect = computed(() => this.previewImageState()?.cropRect || null);

  public readonly format = signal<ExportFormat>('image/png');

  public readonly formats: ExportFormatOption[] = [
    { label: 'PNG (Lossless)', value: 'image/png' },
    { label: 'JPEG (High)', value: 'image/jpeg' },
    { label: 'WEBP (Optimized)', value: 'image/webp' },
  ];

  public readonly quality = signal<number>(0.9);
  public readonly scale = signal<number>(1);
  public readonly isProcessing = signal<boolean>(false);

  private readonly configChanges$ = toObservable(
    computed(() => ({
      src: this.image(),
      format: this.format(),
      quality: this.quality(),
      scale: this.scale(),
      filters: this.filters(),
      crop: this.cropRect(),
    }))
  );

  public readonly estimatedSize = toSignal(
    this.configChanges$.pipe(
      switchMap((config) => {
        if (!config.src) return of('Unknown');
        return this.estimateSizeRx(config.src, config.filters, config.format, config.quality, config.scale, config.crop).pipe(
          catchError(() => of('Error calculating'))
        );
      })
    ),
    { initialValue: 'Calculating...' }
  );

  public readonly buttonText = computed(() => {
    if (this.srv.isBatchMode()) {
      return `Download All (${this.srv.imagesList().length})`;
    }
    return 'Download Image';
  });

  public readonly batchWarning = computed(() => {
    if (this.srv.isBatchMode()) {
      return `Configuration will be applied independently across all ${this.srv.imagesList().length} images globally executing in sequence.`;
    }
    return null;
  });

  public ngOnInit(): void {
    if (!this.image()) {
      this.router.navigate(['/']);
    }
  }

  public goBack(): void {
    if (this.srv.isBatchMode() && !this.srv.activeImageObj()) {
      this.router.navigate(['/batch']);
    } else {
      this.router.navigate(['/edit']);
    }
  }

  private estimateSizeRx(
    src: string,
    filters: FilterState,
    format: ExportFormat,
    quality: number,
    scale: number,
    crop: CropRect | null,
  ): Observable<string> {
    return new Observable<string>((observer) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const offscreenCanvas = document.createElement('canvas');
        CanvasRenderer.render(offscreenCanvas, img, filters, undefined, crop);

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
              observer.next(mb < 1 ? `${(blob.size / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`);
            } else {
              observer.next('Unknown');
            }
            observer.complete();
          },
          format,
          quality,
        );
      };
      
      img.onerror = () => {
        observer.next('Unknown');
        observer.complete();
      };
      img.src = src;
    });
  }

  public handleDownload(): void {
    const images = this.srv.isBatchMode() ? this.srv.imagesList() : [this.srv.activeImageObj()];
    if (!images.length || !images[0]) return;

    this.isProcessing.set(true);

    from(images).pipe(
      concatMap((imgState) => {
        if (!imgState) return of(void 0);
        return this.processImageRx(imgState).pipe(delay(50));
      })
    ).subscribe({
      complete: () => {
        this.isProcessing.set(false);
      }
    });
  }

  private processImageRx(imgState: ImageState): Observable<void> {
    return new Observable<void>((observer) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const offscreenCanvas = document.createElement('canvas');

        CanvasRenderer.render(offscreenCanvas, img, imgState.filters, undefined, imgState.cropRect);

        let finalCanvas = offscreenCanvas;
        if (this.scale() !== 1) {
          finalCanvas = document.createElement('canvas');
          finalCanvas.width = Math.max(1, offscreenCanvas.width * this.scale());
          finalCanvas.height = Math.max(1, offscreenCanvas.height * this.scale());
          const ctx = finalCanvas.getContext('2d');
          if (ctx) ctx.drawImage(offscreenCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
        }

        const dataUrl = finalCanvas.toDataURL(this.format(), this.quality());
        this.triggerBrowserDownload(dataUrl, this.format(), imgState.name);
        observer.next();
        observer.complete();
      };
      
      img.onerror = () => {
        observer.next();
        observer.complete();
      };
      img.src = imgState.url;
    });
  }

  private triggerBrowserDownload(dataUrl: string, mimeType: ExportFormat, name?: string): void {
    const extension = mimeType.split('/')[1];
    const prefix = name ? name.split('.')[0] : `opifx-render-${Date.now()}`;
    const filename = `${prefix}_edited.${extension}`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
