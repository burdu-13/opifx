import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FilterState, Preset } from '../../../../../../shared/interfaces/editor.interface';
import { LibSlider } from '../../../../../../shared/components/lib-slider/lib-slider';
import { FILTER_CONTROLS } from '../../../../config/filter.config';
import { PRESETS } from '../../../../../../shared/config/presets.config';

@Component({
  selector: 'app-edit-controls',
  imports: [LibSlider],
  templateUrl: './edit-controls.html',
  styleUrl: './edit-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditControls {
  public readonly filters = input.required<FilterState>();
  public readonly activePresetId = input<string | null>(null);

  public readonly change = output<Partial<FilterState>>();
  public readonly presetSelected = output<string>();
  public readonly proceed = output<void>();

  public readonly presets = signal<Preset[]>(PRESETS);
  public readonly controls = FILTER_CONTROLS;
  public readonly standardGroup = this.controls.filter((c) => c.group === 'Standard');
  public readonly aestheticGroup = this.controls.filter((c) => c.group === 'Aesthetic');

  public update(key: keyof FilterState, val: number): void {
    this.change.emit({ [key]: val });
  }

  public selectPreset(preset: Preset): void {
    this.presetSelected.emit(preset.id);
  }
}
