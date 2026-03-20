import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AspectRatioOption, CropRect } from '../../../../../../shared/interfaces/editor.interface';

@Component({
  selector: 'app-crop-controls',
  imports: [FormsModule],
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

  public customW = '';
  public customH = '';

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
    this.customW = '';
    this.customH = '';
    this.cropReset.emit();
  }

  public onCustomResolution(): void {
    const w = parseInt(this.customW, 10);
    const h = parseInt(this.customH, 10);
    const sw = this.sourceWidth();
    const sh = this.sourceHeight();

    if (!w || !h || w <= 0 || h <= 0) return;

    const finalW = Math.min(w, sw);
    const finalH = Math.min(h, sh);

    this.customResolution.emit({ width: finalW, height: finalH });
  }

  public getCropPixelWidth(): number {
    const rect = this.cropRect();
    if (!rect) return 0;
    return Math.round(rect.width * this.sourceWidth());
  }

  public getCropPixelHeight(): number {
    const rect = this.cropRect();
    if (!rect) return 0;
    return Math.round(rect.height * this.sourceHeight());
  }
}
