import { FilterState } from '../../../shared/interfaces/editor.interface';
import { FilterEngine } from './filter-engine.utils';

export class CanvasRendererUtil {
  public static render(
    canvas: HTMLCanvasElement | undefined,
    image: HTMLImageElement,
    filters: FilterState,
    maxResolution?: number,
  ): void {
    if (!canvas || !image.complete) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let targetWidth = image.width;
    let targetHeight = image.height;

    if (maxResolution) {
      const maxDim = Math.max(targetWidth, targetHeight);
      if (maxDim > maxResolution) {
        const ratio = maxResolution / maxDim;
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%)
      sepia(${filters.sepia}%)
      hue-rotate(${filters.hueRotate}deg)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
    `.trim();

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    ctx.filter = 'none';

    if (filters.bloom > 0 || filters.halation > 0) {
      FilterEngine.applyBloomAndHalation(
        ctx,
        targetWidth,
        targetHeight,
        canvas,
        filters.bloom ?? 0,
        filters.halation ?? 0,
      );
    }
    if (filters.grain > 0) {
      FilterEngine.applyGrain(ctx, targetWidth, targetHeight, filters.grain);
    }
    if (filters.chromaticAberration > 0) {
      FilterEngine.applyChromaticAberration(
        ctx,
        targetWidth,
        targetHeight,
        filters.chromaticAberration,
      );
    }
    if (filters.toneCurve > 0) {
      FilterEngine.applyToneCurve(ctx, targetWidth, targetHeight, filters.toneCurve);
    }
    if (filters.vignette > 0) {
      FilterEngine.applyVignette(ctx, targetWidth, targetHeight, filters.vignette);
    }
    if (filters.pixelation > 0) {
      FilterEngine.applyPixelation(ctx, targetWidth, targetHeight, filters.pixelation);
    }
    if (filters.vhsOverlay > 0) {
      FilterEngine.applyVHS(ctx, targetWidth, targetHeight, filters.vhsOverlay);
    }
  }
}
