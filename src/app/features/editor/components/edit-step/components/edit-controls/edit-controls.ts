import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FilterState } from '../../../../../../shared/interfaces/editor.interface';
import { LibSlider } from "../../../../../../shared/components/lib-slider/lib-slider";

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

  public update(key: keyof FilterState, val: number): void {
    this.change.emit({ [key]: val });
  }
}
