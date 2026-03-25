import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActiveFilterControl, AspectRatioOption, CropRect, FilterState } from '../../interfaces/editor.interface';
import { LibSlider } from '../lib-slider/lib-slider';
import { CropControls } from '../crop-controls/crop-controls';

@Component({
  selector: 'app-edit-controls',
  imports: [LibSlider, CropControls],
  templateUrl: './edit-controls.html',
  styleUrl: './edit-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditControls {
  public readonly standardControls = input.required<ActiveFilterControl[]>();
  public readonly aestheticControls = input.required<ActiveFilterControl[]>();

  public readonly isCropActive = input.required<boolean>();
  public readonly aspectRatio = input.required<number | null>();
  public readonly cropRect = input.required<CropRect | null>();
  public readonly aspectRatioOptions = input.required<readonly AspectRatioOption[]>();
  public readonly sourceWidth = input.required<number>();
  public readonly sourceHeight = input.required<number>();

  public readonly change = output<Partial<FilterState>>();
  public readonly reset = output<void>();

  public readonly toggleCrop = output<void>();
  public readonly aspectRatioChange = output<number | null>();
  public readonly cropApply = output<void>();
  public readonly cropReset = output<void>();
  public readonly customResolution = output<{ width: number; height: number }>();

  public update(key: keyof FilterState, val: number): void {
    this.change.emit({ [key]: val });
  }

  public resetAll(): void {
    this.reset.emit();
  }
}
