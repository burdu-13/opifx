import { computed, Injectable, signal } from '@angular/core';
import { CropRect } from '../../shared/interfaces/editor.interface';

@Injectable({
  providedIn: 'root',
})
export class CropService {
  private readonly cropRectSignal = signal<CropRect | null>(null);
  private readonly aspectRatioSignal = signal<number | null>(null);
  private readonly isCropActiveSignal = signal<boolean>(false);

  public readonly cropRect = this.cropRectSignal.asReadonly();
  public readonly aspectRatio = this.aspectRatioSignal.asReadonly();
  public readonly isCropActive = this.isCropActiveSignal.asReadonly();
  public readonly hasCrop = computed(() => this.cropRectSignal() !== null);

  public setCropRect(rect: CropRect): void {
    this.cropRectSignal.set(this.clamp(rect));
  }

  public setAspectRatio(ratio: number | null): void {
    this.aspectRatioSignal.set(ratio);
  }

  public activateCropMode(): void {
    this.isCropActiveSignal.set(true);
    if (!this.cropRectSignal()) {
      this.cropRectSignal.set({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    }
  }

  public deactivateCropMode(): void {
    this.isCropActiveSignal.set(false);
  }

  public applyCrop(): void {
    this.isCropActiveSignal.set(false);
  }

  public resetCrop(): void {
    this.cropRectSignal.set(null);
    this.aspectRatioSignal.set(null);
    this.isCropActiveSignal.set(false);
  }

  public constrainToAspectRatio(ratio: number, imageAspect: number): void {
    const current = this.cropRectSignal();
    if (!current) return;

    const centerX = current.x + current.width / 2;
    const centerY = current.y + current.height / 2;

    let newW = current.width;
    let newH = (newW * imageAspect) / ratio;

    if (newH > 1) {
      newH = 0.9;
      newW = (newH * ratio) / imageAspect;
    }
    if (newW > 1) {
      newW = 0.9;
      newH = (newW * imageAspect) / ratio;
    }

    let newX = centerX - newW / 2;
    let newY = centerY - newH / 2;

    newX = Math.max(0, Math.min(newX, 1 - newW));
    newY = Math.max(0, Math.min(newY, 1 - newH));

    this.cropRectSignal.set({ x: newX, y: newY, width: newW, height: newH });
  }

  private clamp(rect: CropRect): CropRect {
    const minSize = 0.02;
    let { x, y, width, height } = rect;

    width = Math.max(minSize, Math.min(width, 1));
    height = Math.max(minSize, Math.min(height, 1));
    x = Math.max(0, Math.min(x, 1 - width));
    y = Math.max(0, Math.min(y, 1 - height));

    return { x, y, width, height };
  }
}
