import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ExportFormat } from '../../interfaces/export.interface';
import { LibButton } from '../../../../../../shared/components/lib-button/lib-button';
import { LibPill } from '../../../../../../shared/components/lib-pill/lib-pill';
import { LibSlider } from '../../../../../../shared/components/lib-slider/lib-slider';

@Component({
  selector: 'app-export-controls',
  imports: [LibButton, LibPill, LibSlider],
  templateUrl: './export-controls.html',
  styleUrl: './export-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportControls {
  public readonly selectedFormat = input.required<ExportFormat>();
  public readonly formats = input.required<{ label: string; value: ExportFormat }[]>();
  public readonly quality = input.required<number>();
  public readonly scale = input.required<number>();
  public readonly estimatedSize = input.required<string>();
  public readonly isProcessing = input<boolean>(false);

  public readonly formatChange = output<ExportFormat>();
  public readonly qualityChange = output<number>();
  public readonly scaleChange = output<number>();
  public readonly download = output<void>();
  public readonly back = output<void>();
}
