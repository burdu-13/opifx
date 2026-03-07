import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FilterState, Preset } from '../../../../shared/interfaces/editor.interface';

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

  public readonly presetSelected = output<string | null>();
  public readonly expandedChange = output<boolean>();

  public readonly isExpanded = signal<boolean>(false);

  public readonly activePresetDetails = computed(() => {
    const id = this.activePresetId();
    return this.presets().find((p) => p.id === id) || null;
  });

  public readonly formattedSpecs = computed(() => {
    const details = this.activePresetDetails();
    if (!details || !details.state) return [];

    const dictionary: Partial<Record<keyof FilterState, string>> = {
      brightness: 'Luminance',
      contrast: 'Contrast',
      saturation: 'Color Density',
      grain: 'Film Emulsion',
      chromaticAberration: 'Lens Chroma',
    };

    return Object.entries(details.state).map(([key, val]) => {
      const filterKey = key as keyof FilterState;
      return {
        label: dictionary[filterKey] || key,
        val: val as string | number,
      };
    });
  });

  public handlePresetClick(id: string): void {
    if (this.activePresetId() === id) {
      this.presetSelected.emit(null);
      if (this.isExpanded()) {
        this.toggleExpand();
      }
    } else {
      this.presetSelected.emit(id);
    }
  }

  public toggleExpand(): void {
    this.isExpanded.update((v) => !v);
    this.expandedChange.emit(this.isExpanded());
  }
}
