import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ExportFormat } from '../../interfaces/export.interface';

@Component({
  selector: 'app-export-controls',
  imports: [],
  templateUrl: './export-controls.html',
  styleUrl: './export-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportControls {
  public readonly selectedFormat = input.required<ExportFormat>();
  public readonly isProcessing = input<boolean>(false);

  public readonly formatChange = output<ExportFormat>();
  public readonly download = output<void>();
  public readonly back = output<void>();

  public readonly formats: { label: string; value: ExportFormat }[] = [
    { label: 'PNG (Lossless)', value: 'image/png' },
    { label: 'JPEG (High)', value: 'image/jpeg' },
    { label: 'WEBP (Optimized)', value: 'image/webp' },
  ];
}
