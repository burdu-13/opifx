import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  ActiveFilterControl,
  CropRect,
  FilterState,
  PresetSpec,
  Preset,
  AspectRatioOption,
} from '../../../../../shared/interfaces/editor.interface';
import { PreviewImage } from '../../../../../shared/components/preview-image/preview-image';
import { EditControls } from '../../../../../shared/components/edit-controls/edit-controls';
import { CropOverlay } from '../../../../../shared/components/crop-overlay/crop-overlay';
import { LibButton } from '../../../../../shared/components/lib-button/lib-button';
import { PresetBar } from '../../../../../shared/components/preset-bar/preset-bar';

@Component({
  selector: 'app-edit-step',
  imports: [PreviewImage, EditControls, PresetBar, LibButton, CropOverlay],
  templateUrl: './edit-step.html',
  styleUrl: './edit-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStep {
  public readonly image = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly isBatchMode = input.required<boolean>();
  public readonly presets = input.required<Preset[]>();
  public readonly activePresetId = input.required<string | null>();
  public readonly isPresetGalleryOpen = input.required<boolean>();
  public readonly zoom = input.required<number>();
  public readonly position = input.required<{ x: number; y: number }>();
  public readonly zoomLabel = input.required<string>();
  public readonly activeFilters = input.required<FilterState>();
  public readonly sourceWidth = input.required<number>();
  public readonly sourceHeight = input.required<number>();
  public readonly activePresetDetails = input.required<Preset | null>();
  public readonly activeSpecs = input.required<PresetSpec[]>();
  public readonly standardControls = input.required<ActiveFilterControl[]>();
  public readonly aestheticControls = input.required<ActiveFilterControl[]>();
  public readonly isCropActive = input.required<boolean>();
  public readonly cropRect = input.required<CropRect | null>();
  public readonly aspectRatio = input.required<number | null>();
  public readonly aspectRatioOptions = input.required<AspectRatioOption[]>();
  public readonly imageAspect = input.required<number>();
  public readonly appliedCropRect = input.required<CropRect | null>();

  public readonly canvasDimensions = output<{ width: number; height: number }>();
  public readonly presetSelection = output<string | null>();
  public readonly presetGalleryOpenChange = output<boolean>();
  public readonly reset = output<void>();
  public readonly manualChange = output<Partial<FilterState>>();
  public readonly zoomUpdate = output<number>();
  public readonly resetView = output<void>();
  public readonly pan = output<{ x: number; y: number }>();
  public readonly proceedToExport = output<void>();
  public readonly backToBatch = output<void>();
  public readonly applyToAll = output<void>();
  public readonly showBeforeChange = output<boolean>();
  public readonly toggleCrop = output<void>();
  public readonly cropChange = output<CropRect>();
  public readonly aspectRatioChange = output<number | null>();
  public readonly cropApply = output<void>();
  public readonly cropReset = output<void>();
  public readonly customResolution = output<{ width: number; height: number }>();
}