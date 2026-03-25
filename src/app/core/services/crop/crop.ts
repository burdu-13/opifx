import { computed, inject, Injectable } from '@angular/core';
import { CropRect } from '../../../shared/interfaces/editor.interface';
import { Editor } from '../editor/editor';

@Injectable({
  providedIn: 'root',
})
export class Crop {
  private readonly editor = inject(Editor);

  public readonly cropRect = this.editor.cropRect;
  public readonly aspectRatio = this.editor.aspectRatio;
  public readonly isCropActive = this.editor.isCropActive;
  public readonly hasCrop = computed(() => this.cropRect() !== null);

  public setCropRect(rect: CropRect): void {
    this.editor.updateCropConfig({ cropRect: this.clamp(rect) });
  }

  public setAspectRatio(ratio: number | null): void {
    this.editor.updateCropConfig({ aspectRatio: ratio });
  }

  public activateCropMode(): void {
    const currentRect = this.cropRect() || { x: 0.1, y: 0.1, width: 0.8, height: 0.8 };
    this.editor.updateCropConfig({ isCropActive: true, cropRect: currentRect });
  }

  public deactivateCropMode(): void {
    this.editor.updateCropConfig({ isCropActive: false });
  }

  public applyCrop(): void {
    this.editor.updateCropConfig({ isCropActive: false });
  }

  public resetCrop(): void {
    this.editor.updateCropConfig({
      cropRect: null,
      aspectRatio: null,
      isCropActive: false,
    });
  }

  public constrainToAspectRatio(ratio: number, imageAspect: number): void {
    const current = this.cropRect();
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

    const newX = Math.max(0, Math.min(centerX - newW / 2, 1 - newW));
    const newY = Math.max(0, Math.min(centerY - newH / 2, 1 - newH));

    this.editor.updateCropConfig({ cropRect: { x: newX, y: newY, width: newW, height: newH } });
  }

  private clamp(rect: CropRect): CropRect {
    const minSize = 0.02;
    let { x, y, width, height } = rect;
    width = Math.max(minSize, Math.min(width, 1));
    height = Math.max(minSize, Math.min(height, 1));
    return {
      x: Math.max(0, Math.min(x, 1 - width)),
      y: Math.max(0, Math.min(y, 1 - height)),
      width,
      height,
    };
  }
}
