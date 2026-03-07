export class FilterEngine {
  public static applyGrain(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    intensity: number,
  ): void {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const factor = intensity * 2.55;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * factor;
      data[i] += noise; // Red
      data[i + 1] += noise; // Green
      data[i + 2] += noise; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
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
}
