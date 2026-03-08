import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
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
  public readonly change = output<Partial<FilterState>>();
  public readonly proceed = output<void>();

  public readonly standardControls = computed(() =>
    FILTER_CONTROLS.filter((c) => c.group === 'Standard').map((c) => ({
      ...c,
      currentValue: this.filters()[c.key],
    })),
  );

  public readonly aestheticControls = computed(() =>
    FILTER_CONTROLS.filter((c) => c.group === 'Aesthetic').map((c) => ({
      ...c,
      currentValue: this.filters()[c.key],
    })),
  );

  public update(key: keyof FilterState, val: number): void {
    this.change.emit({ [key]: val });
  }
}
