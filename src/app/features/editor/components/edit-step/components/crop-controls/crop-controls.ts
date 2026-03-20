import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { AspectRatioOption, CropRect } from '../../../../../../shared/interfaces/editor.interface';

@Component({
  selector: 'app-crop-controls',
  imports: [],
  templateUrl: './crop-controls.html',
  styleUrl: './crop-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropControls {
  public readonly isCropActive = input.required<boolean>();
  public readonly aspectRatio = input.required<number | null>();
  public readonly cropRect = input.required<CropRect | null>();
  public readonly aspectRatioOptions = input.required<readonly AspectRatioOption[]>();
  public readonly sourceWidth = input.required<number>();
  public readonly sourceHeight = input.required<number>();

  public readonly toggleCrop = output<void>();
  public readonly aspectRatioChange = output<number | null>();
  public readonly cropApply = output<void>();
  public readonly cropReset = output<void>();
  public readonly customResolution = output<{ width: number; height: number }>();

  public readonly customW = model<string>('');
  public readonly customH = model<string>('');

  public readonly toggleLabel = computed(() =>
    this.isCropActive() ? 'Exit Crop' : 'Crop Image',
  );

  public readonly cropPixelWidth = computed(() => {
    const rect = this.cropRect();
    if (!rect) return 0;
    return Math.round(rect.width * this.sourceWidth());
  });

  public readonly cropPixelHeight = computed(() => {
    const rect = this.cropRect();
    if (!rect) return 0;
    return Math.round(rect.height * this.sourceHeight());
  });

  public readonly dimensionLabel = computed(() =>
    `${this.cropPixelWidth()} × ${this.cropPixelHeight()} px`,
  );

  public onToggle(): void {
    this.toggleCrop.emit();
  }

  public onAspectRatio(value: number | null): void {
    this.aspectRatioChange.emit(value);
  }

  public onApply(): void {
    this.cropApply.emit();
  }

  public onReset(): void {
    this.customW.set('');
    this.customH.set('');
    this.cropReset.emit();
  }

  public onCustomResolution(): void {
    const w = parseInt(this.customW(), 10);
    const h = parseInt(this.customH(), 10);
    const sw = this.sourceWidth();
    const sh = this.sourceHeight();

    if (!w || !h || w <= 0 || h <= 0) return;

    this.customResolution.emit({
      width: Math.min(w, sw),
      height: Math.min(h, sh),
    });
  }
}
