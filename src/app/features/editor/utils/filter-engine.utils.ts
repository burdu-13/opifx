export class FilterEngine {
  public static applyGrain(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number,
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = intensity * 2.55;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * factor;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  public static applyChromaticAberration(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number,
  ): void {
    const original = ctx.getImageData(0, 0, width, height);
    const shifted = ctx.createImageData(width, height);

    for (let i = 0; i < original.data.length; i += 4) {
      shifted.data[i] = original.data[i + offset * 4] || original.data[i];
      shifted.data[i + 1] = original.data[i + 1];
      shifted.data[i + 2] = original.data[i + 2 - offset * 4] || original.data[i + 2];
      shifted.data[i + 3] = original.data[i + 3];
    }
    ctx.putImageData(shifted, 0, 0);
  }
}
