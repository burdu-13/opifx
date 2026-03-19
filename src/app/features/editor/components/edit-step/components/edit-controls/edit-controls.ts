import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FilterState } from '../../../../../../shared/interfaces/editor.interface';
import { LibSlider } from '../../../../../../shared/components/lib-slider/lib-slider';

@Component({
  selector: 'app-edit-controls',
  imports: [LibSlider],
  templateUrl: './edit-controls.html',
  styleUrl: './edit-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditControls {
  public readonly standardControls =
    input.required<
      {
        key: keyof FilterState;
        label: string;
        min: number;
        max: number;
        step: number;
        currentValue: number;
        unit?: string;
      }[]
    >();
  public readonly aestheticControls =
    input.required<
      {
        key: keyof FilterState;
        label: string;
        min: number;
        max: number;
        step: number;
        currentValue: number;
        unit?: string;
      }[]
    >();

  public readonly change = output<Partial<FilterState>>();
  public readonly reset = output<void>();

  public update(key: keyof FilterState, val: number): void {
    this.change.emit({ [key]: val });
  }

  public resetAll(): void {
    this.reset.emit();
  }
}
