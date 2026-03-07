import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FilterEngine } from '../../utils/filter-engine.utils';
import { FilterState } from '../../../../shared/interfaces/editor.interface';
import { LibSlider } from '../../../../shared/components/lib-slider/lib-slider';
import { PreviewImage } from "./components/preview-image/preview-image";
import { EditControls } from "./components/edit-controls/edit-controls";

@Component({
  selector: 'app-edit-step',
  imports: [LibSlider, PreviewImage, EditControls],
  templateUrl: './edit-step.html',
  styleUrl: './edit-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStep {
  public readonly image = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly filterChange = output<Partial<FilterState>>();
  public readonly proceed = output<void>();

  public readonly zoom = signal<number>(1);
  public readonly position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  public updateZoom(delta: number): void {
    this.zoom.update((z) => Math.min(Math.max(z + delta, 0.5), 3));
  }

  public resetView(): void {
    this.zoom.set(1);
    this.position.set({ x: 0, y: 0 });
  }

  public handlePan(offset: { x: number; y: number }): void {
    this.position.update((pos) => ({
      x: pos.x + offset.x,
      y: pos.y + offset.y,
    }));
  }
}
