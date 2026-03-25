import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  CropRect,
  ExportFormat,
  ExportFormatOption,
  FilterState,
} from '../../../../../shared/interfaces/editor.interface';
import { ExportPreview } from '../../../../../shared/components/export-preview/export-preview';
import { ExportControls } from '../../../../../shared/components/export-controls/export-controls';

@Component({
  selector: 'app-export-step',
  imports: [ExportPreview, ExportControls],
  templateUrl: './export-step.html',
  styleUrl: './export-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportStep {
  public readonly image = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly cropRect = input.required<CropRect | null>();
  public readonly formats = input.required<ExportFormatOption[]>();
  public readonly format = input.required<ExportFormat>();
  public readonly quality = input.required<number>();
  public readonly scale = input.required<number>();
  public readonly estimatedSize = input.required<string>();
  public readonly isProcessing = input.required<boolean>();
  public readonly buttonText = input.required<string>();
  public readonly batchWarning = input.required<string | null>();

  public readonly formatChange = output<ExportFormat>();
  public readonly qualityChange = output<number>();
  public readonly scaleChange = output<number>();
  public readonly download = output<void>();
  public readonly back = output<void>();
}
