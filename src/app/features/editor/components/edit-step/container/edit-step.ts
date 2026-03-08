import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FilterState, NEUTRAL_FILTERS } from '../../../../../shared/interfaces/editor.interface';
import { PreviewImage } from '../components/preview-image/preview-image';
import { EditControls } from '../components/edit-controls/edit-controls';
import { PRESETS } from '../../../../../shared/config/presets.config';
import { PresetBar } from '../../preset-bar/preset-bar';

@Component({
  selector: 'app-edit-step',
  imports: [PreviewImage, EditControls, PresetBar],
  templateUrl: './edit-step.html',
  styleUrl: './edit-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStep {
  public readonly image = input.required<string | null>();
  public readonly filters = input.required<FilterState>();
  public readonly filterChange = output<FilterState>();
  public readonly proceed = output<void>();

  public readonly presets = PRESETS;
  public readonly activePresetId = signal<string | null>(null);

  public readonly isPresetGalleryOpen = signal<boolean>(false);

  public readonly zoom = signal<number>(1);
  public readonly position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  public handlePresetSelection(id: string | null): void {
    this.activePresetId.set(id);

    if (id) {
      const selectedPreset = this.presets.find((p) => p.id === id);
      if (selectedPreset && selectedPreset.state) {
        this.filterChange.emit({ ...this.filters(), ...selectedPreset.state } as FilterState);
      }
    } else {
      this.filterChange.emit({ ...NEUTRAL_FILTERS });
    }
  }

  public handleManualChange(update: Partial<FilterState>): void {
    this.activePresetId.set(null);
    this.filterChange.emit({ ...this.filters(), ...update });
  }

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
