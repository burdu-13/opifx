import { FilterState } from '../../../shared/interfaces/editor.interface';
import { FilterEngine } from './filter-engine.utils';

export class CanvasRendererUtil {
  public static render(
    canvas: HTMLCanvasElement | undefined,
    image: HTMLImageElement,
    filters: FilterState,
  ): void {
    if (!canvas || !image.complete) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%)
      sepia(${filters.sepia}%)
      hue-rotate(${filters.hueRotate}deg)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
    `.trim();

    ctx.drawImage(image, 0, 0);

    ctx.filter = 'none';
    if (filters.grain > 0) {
      FilterEngine.applyGrain(ctx, canvas.width, canvas.height, filters.grain);
    }
    if (filters.chromaticAberration > 0) {
      FilterEngine.applyChromaticAberration(
        ctx,
        canvas.width,
        canvas.height,
        filters.chromaticAberration,
      );
    }
    if (filters.vignette > 0) {
      FilterEngine.applyVignette(ctx, canvas.width, canvas.height, filters.vignette);
    }
  }
}
