import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FilterState, NEUTRAL_FILTERS } from '../../../../../shared/interfaces/editor.interface';
import { PreviewImage } from '../components/preview-image/preview-image';
import { EditControls } from '../components/edit-controls/edit-controls';
import { PRESETS } from '../../../../../shared/config/presets.config';
import { LibButton } from '../../../../../shared/components/lib-button/lib-button';
import { PresetBar } from '../../preset-bar/preset-bar';
import { Editor } from '../../../../../core/services/editor';
import { FILTER_CONTROLS } from '../../../config/filter.config';

@Component({
  selector: 'app-edit-step',
  imports: [PreviewImage, EditControls, PresetBar, LibButton],
  templateUrl: './edit-step.html',
  styleUrl: './edit-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStep implements OnInit {
  public readonly srv = inject(Editor);
  private readonly router = inject(Router);

  public readonly image = this.srv.sourceImage;
  public readonly filters = this.srv.filters;

  public readonly presets = PRESETS;
  public readonly activePresetId = signal<string | null>(null);

  public readonly isPresetGalleryOpen = signal<boolean>(false);

  public readonly zoom = signal<number>(1);
  public readonly position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  public readonly showBefore = signal<boolean>(false);
  public readonly activeFilters = computed(() =>
    this.showBefore() ? NEUTRAL_FILTERS : this.filters(),
  );

  public readonly activePresetDetails = computed(() => {
    const id = this.activePresetId();
    if (!id) return null;
    return this.presets.find((p) => p.id === id) || null;
  });

  public readonly activeSpecs = computed(() => {
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

  public readonly standardControls = computed(() =>
    FILTER_CONTROLS.filter((c: any) => c.group === 'Standard').map((c: any) => ({
      ...c,
      currentValue: this.filters()[c.key as keyof FilterState],
    })),
  );

  public readonly aestheticControls = computed(() =>
    FILTER_CONTROLS.filter((c: any) => c.group === 'Aesthetic').map((c: any) => ({
      ...c,
      currentValue: this.filters()[c.key as keyof FilterState],
    })),
  );

  public ngOnInit() {
    if (!this.image()) {
      this.router.navigate(['/']);
    }
  }

  public handlePresetSelection(id: string | null): void {
    if (!id) return;
    if (this.activePresetId() === id) {
      this.activePresetId.set(null);
      this.isPresetGalleryOpen.set(false);
      this.srv.updateFilter({ ...NEUTRAL_FILTERS });
    } else {
      this.activePresetId.set(id);
      const selectedPreset = this.presets.find((p) => p.id === id);
      if (selectedPreset && selectedPreset.state) {
        this.srv.updateFilter({ ...NEUTRAL_FILTERS, ...selectedPreset.state } as FilterState);
      }
    }
  }

  public handleReset(): void {
    this.activePresetId.set(null);
    this.srv.updateFilter(NEUTRAL_FILTERS);
  }

  public handleManualChange(update: Partial<FilterState>): void {
    this.activePresetId.set(null);
    this.srv.updateFilter(update);
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

  public proceedToExport(): void {
    this.router.navigate(['/export']);
  }
}
