import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Preset } from '../../../../shared/interfaces/editor.interface';

@Component({
  selector: 'app-preset-bar',
  imports: [],
  templateUrl: './preset-bar.html',
  styleUrl: './preset-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetBar {
  public readonly presets = input.required<Preset[]>();
  public readonly activePresetId = input<string | null>(null);

  public readonly presetSelected = output<string>();

  public readonly isExpanded = signal<boolean>(false);
  public readonly expandedPresetId = signal<string | null>(null);

  public selectPreset(id: string): void {
    this.presetSelected.emit(id);
  }

  public toggleExpand(): void {
    this.isExpanded.update((v) => !v);

    if (!this.isExpanded()) {
      this.expandedPresetId.set(null);
    }
  }

  public togglePresetDetails(id: string, event: Event): void {
    event.stopPropagation();
    this.expandedPresetId.update((current) => (current === id ? null : id));
  }
}
