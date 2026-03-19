export class FilterEngine {
  private static noiseCache: HTMLCanvasElement | null = null;

  private static getNoiseTexture(): HTMLCanvasElement {
    if (this.noiseCache) return this.noiseCache;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(256, 256);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    this.noiseCache = canvas;
    return canvas;
  }

  public static applyGrain(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    intensity: number,
  ): void {
    if (intensity <= 0) return;

    const texture = this.getNoiseTexture();
    const pattern = ctx.createPattern(texture, 'repeat');

    if (!pattern) return;

    ctx.save();

    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = intensity / 100;

    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  public static applyChromaticAberration(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    offset: number,
  ): void {
    const original = ctx.getImageData(0, 0, w, h);
    const shifted = ctx.createImageData(w, h);
    const oData = original.data;
    const sData = shifted.data;

    for (let i = 0; i < oData.length; i += 4) {
      sData[i] = oData[i + offset * 4] || oData[i];
      sData[i + 1] = oData[i + 1];
      sData[i + 2] = oData[i + 2 - offset * 4] || oData[i + 2];
      sData[i + 3] = oData[i + 3];
    }
    ctx.putImageData(shifted, 0, 0);
  }

  public static applyVignette(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    intensity: number,
  ): void {
    const gradient = ctx.createRadialGradient(
      w / 2,
      h / 2,
      0,
      w / 2,
      h / 2,
      Math.sqrt((w / 2) ** 2 + (h / 2) ** 2),
    );
    const alpha = intensity / 100;
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, `rgba(0,0,0,${alpha})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  public static applyBloomAndHalation(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    canvas: HTMLCanvasElement,
    bloom: number,
    halation: number
  ): void {
    ctx.save();
    if (bloom > 0) {
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(12px)';
      ctx.globalAlpha = bloom / 100;
      ctx.drawImage(canvas, 0, 0, w, h);
    }
  
    if (halation > 0) {
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(10px) sepia(100%) hue-rotate(-50deg) saturate(300%)';
      ctx.globalAlpha = halation / 100;
      ctx.drawImage(canvas, 0, 0, w, h);
    }
    ctx.restore();
  }
  
  public static applyToneCurve(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    intensity: number
  ): void {
    if (intensity <= 0) return;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const factor = intensity / 100; 
  
    for (let i = 0; i < data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        let val = data[i + c] / 255;
        const sVal = val * val * (3 - 2 * val); 
        data[i + c] = (val + (sVal - val) * factor) * 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  public static applyPixelation(ctx: CanvasRenderingContext2D, w: number, h: number, size: number): void {
    if (size <= 1) return;
    const smW = Math.max(1, Math.floor(w / size));
    const smH = Math.max(1, Math.floor(h / size));
    
    const off = document.createElement('canvas');
    off.width = smW;
    off.height = smH;
    const offCtx = off.getContext('2d', { willReadFrequently: true })!;
    offCtx.drawImage(ctx.canvas, 0, 0, smW, smH);
    
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, smW, smH, 0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
  }

  public static applyVHS(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number): void {
    if (intensity <= 0) return;
    
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.03 + (intensity / 100) * 0.1})`;
    const scanlineHeight = Math.max(1, Math.floor(h / 500));
    for (let y = 0; y < h; y += scanlineHeight * 2) {
      ctx.fillRect(0, y, w, scanlineHeight);
    }
    ctx.restore();
  }
}
