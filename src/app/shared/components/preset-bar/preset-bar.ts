import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Preset, PresetSpec } from '../../interfaces/editor.interface';

@Component({
  selector: 'app-preset-bar',
  imports: [],
  templateUrl: './preset-bar.html',
  styleUrl: './preset-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetBar {
  public readonly presets = input.required<readonly Preset[]>();
  public readonly activePresetId = input<string | null>(null);
  public readonly presetDetails = input<Preset | null>(null);
  public readonly presetSpecs = input.required<PresetSpec[]>();

  public readonly presetSelected = output<string>();
  public readonly expandedChange = output<boolean>();

  public readonly isExpanded = signal<boolean>(false);

  public handlePresetClick(id: string): void {
    this.presetSelected.emit(id);
  }

  public toggleExpand(): void {
    this.isExpanded.update((v) => !v);
    this.expandedChange.emit(this.isExpanded());
  }
}
