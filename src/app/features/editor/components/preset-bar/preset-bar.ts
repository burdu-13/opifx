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

  public readonly presetSelected = output<string>();
  public readonly expandedChange = output<boolean>();

  public readonly isExpanded = signal<boolean>(false);

  public readonly activePresetDetails = computed(() => {
    const id = this.activePresetId();
    return this.presets().find((p) => p.id === id) || null;
  });

  public handlePresetClick(id: string): void {
    this.presetSelected.emit(id);
  }

  public toggleExpand(): void {
    this.isExpanded.update((v) => !v);
    this.expandedChange.emit(this.isExpanded());
  }

  public formatSpecs(
    filters: Partial<FilterState> | undefined,
  ): { label: string; val: string | number }[] {
    if (!filters) return [];

    const dictionary: Partial<Record<keyof FilterState, string>> = {
      brightness: 'Luminance',
      contrast: 'Contrast',
      saturation: 'Color Density',
      grain: 'Film Emulsion',
      chromaticAberration: 'Lens Chroma',
    };

    return Object.entries(filters).map(([key, val]) => {
      const filterKey = key as keyof FilterState;
      return {
        label: dictionary[filterKey] || key,
        val: val as string | number,
      };
    });
  }
}
