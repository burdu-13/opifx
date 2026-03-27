import { Observable } from 'rxjs';
import { CanvasRenderer } from './canvas-renderer';
import { CropRect, ExportFormat, FilterState } from '../../../shared/interfaces/editor.interface';

export class ExportUtils {
  public static estimateSizeRx(
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

  public static processImageRx(
    src: string,
    name: string,
    filters: FilterState,
    format: ExportFormat,
    quality: number,
    scale: number,
    crop: CropRect | null,
  ): Observable<void> {
    return new Observable<void>((observer) => {
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

        const dataUrl = finalCanvas.toDataURL(format, quality);
        ExportUtils.triggerBrowserDownload(dataUrl, format, name);
        observer.next();
        observer.complete();
      };

      img.onerror = () => {
        observer.next();
        observer.complete();
      };
      img.src = src;
    });
  }

  private static triggerBrowserDownload(
    dataUrl: string,
    mimeType: ExportFormat,
    name?: string,
  ): void {
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
