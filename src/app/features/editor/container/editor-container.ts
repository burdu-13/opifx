import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Editor } from '../../../core/services/editor/editor';
import { Crop } from '../../../core/services/crop/crop';
import { UploadStep } from '../components/upload-step/upload-step';
import { EditStep } from '../components/edit-step/container/edit-step';
import { LibraryGrid } from '../components/library-grid/library-grid';
import {
  ActiveFilterControl,
  CropRect,
  FilterControlConfig,
  FilterState,
  NEUTRAL_FILTERS,
  ASPECT_RATIO_OPTIONS,
  PresetSpec,
  Preset,
  AspectRatioOption,
} from '../../../shared/interfaces/editor.interface';
import { PRESETS } from '../../../shared/config/presets.config';
import { FILTER_CONTROLS } from '../config/filter.config';
import { PRESET_SPEC_DICTIONARY } from '../config/preset-specs.config';

@Component({
  selector: 'app-editor-container',
  imports: [UploadStep, EditStep, LibraryGrid],
  templateUrl: './editor-container.html',
  styleUrl: './editor-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContainer {
  public readonly srv = inject(Editor);
  public readonly cropSrv = inject(Crop);
  private readonly router = inject(Router);

  public readonly presets = PRESETS as Preset[];
  public readonly aspectRatioOptions = ASPECT_RATIO_OPTIONS as AspectRatioOption[];

  public readonly zoom = signal<number>(1);
  public readonly position = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  public readonly isPresetGalleryOpen = signal<boolean>(false);
  public readonly showBefore = signal<boolean>(false);
  public readonly sourceWidth = signal<number>(0);
  public readonly sourceHeight = signal<number>(0);

  public readonly zoomLabel = computed(() => {
    const z = this.zoom();
    return z === 1 ? 'Fit' : `${Math.round(z * 100)}%`;
  });

  public readonly activeFilters = computed(() =>
    this.showBefore() ? NEUTRAL_FILTERS : this.srv.filters(),
  );

  public readonly activePresetDetails = computed<Preset | null>(() => {
    const id = this.srv.activePresetId();
    if (!id) return null;
    return this.presets.find((p) => p.id === id) ?? null;
  });

  public readonly activeSpecs = computed<PresetSpec[]>(() => {
    const details = this.activePresetDetails();
    if (!details?.state) return [];

    return Object.entries(details.state).map(([key, val]) => ({
      label: PRESET_SPEC_DICTIONARY[key as keyof FilterState] ?? key,
      val: val as number,
    })) as PresetSpec[];
  });

  public readonly standardControls = computed<ActiveFilterControl[]>(
    () =>
      FILTER_CONTROLS.filter((c: FilterControlConfig) => c.group === 'Standard').map(
        (c: FilterControlConfig) => ({
          ...c,
          currentValue: this.srv.filters()[c.key],
        }),
      ) as ActiveFilterControl[],
  );

  public readonly aestheticControls = computed<ActiveFilterControl[]>(
    () =>
      FILTER_CONTROLS.filter((c: FilterControlConfig) => c.group === 'Aesthetic').map(
        (c: FilterControlConfig) => ({
          ...c,
          currentValue: this.srv.filters()[c.key],
        }),
      ) as ActiveFilterControl[],
  );

  public readonly imageAspect = computed(() => {
    const w = this.sourceWidth();
    const h = this.sourceHeight();
    return h > 0 ? w / h : 1;
  });

  public readonly appliedCropRect = computed<CropRect | null>(() => {
    if (this.cropSrv.isCropActive()) return null;
    return this.cropSrv.cropRect();
  });

  public handleCanvasDimensions(dims: { width: number; height: number }): void {
    if (!this.appliedCropRect()) {
      this.sourceWidth.set(dims.width);
      this.sourceHeight.set(dims.height);
    }
  }

  public handlePresetSelection(id: string | null): void {
    if (!id) return;
    if (this.srv.activePresetId() === id) {
      this.srv.updateActivePresetId(null);
      this.isPresetGalleryOpen.set(false);
      this.srv.updateFilter({ ...NEUTRAL_FILTERS });
    } else {
      this.srv.updateActivePresetId(id);
      const selectedPreset = this.presets.find((p) => p.id === id);
      if (selectedPreset?.state) {
        this.srv.updateFilter({ ...NEUTRAL_FILTERS, ...selectedPreset.state } as FilterState);
      }
    }
  }

  public handleReset(): void {
    this.srv.updateActivePresetId(null);
    this.srv.updateFilter(NEUTRAL_FILTERS);
  }

  public handleManualChange(update: Partial<FilterState>): void {
    this.srv.updateActivePresetId(null);
    this.srv.updateFilter(update);
  }

  public updateZoom(delta: number): void {
    this.zoom.update((z) => Math.min(Math.max(z + delta, 0.2), 5));
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

  public backToBatch(): void {
    this.srv.setActiveImage(null);
    this.router.navigate(['/batch']);
  }

  public applyToAll(): void {
    this.srv.applyFiltersToAll();
    this.srv.applyCropToAll();
  }

  public handleToggleCrop(): void {
    if (this.cropSrv.isCropActive()) {
      this.cropSrv.deactivateCropMode();
    } else {
      this.cropSrv.activateCropMode();
    }
  }

  public handleCropChange(rect: CropRect): void {
    this.cropSrv.setCropRect(rect);
  }

  public handleAspectRatioChange(ratio: number | null): void {
    this.cropSrv.setAspectRatio(ratio);
    if (ratio !== null) {
      this.cropSrv.constrainToAspectRatio(ratio, this.imageAspect());
    }
  }

  public handleCropApply(): void {
    this.cropSrv.applyCrop();
  }

  public handleCropReset(): void {
    this.cropSrv.resetCrop();
  }

  public handleCustomResolution(res: { width: number; height: number }): void {
    const sw = this.sourceWidth();
    const sh = this.sourceHeight();
    if (sw <= 0 || sh <= 0) return;

    const normalizedW = Math.min(res.width / sw, 1);
    const normalizedH = Math.min(res.height / sh, 1);
    const x = Math.max(0, (1 - normalizedW) / 2);
    const y = Math.max(0, (1 - normalizedH) / 2);

    this.cropSrv.setCropRect({ x, y, width: normalizedW, height: normalizedH });
    this.cropSrv.setAspectRatio(res.width / res.height);
  }
}
