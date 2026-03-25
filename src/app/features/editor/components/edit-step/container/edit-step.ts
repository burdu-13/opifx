import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ActiveFilterControl,
  CropRect,
  FilterControlConfig,
  FilterState,
  NEUTRAL_FILTERS,
  ASPECT_RATIO_OPTIONS,
  PresetSpec,
  Preset,
} from '../../../../../shared/interfaces/editor.interface';
import { PreviewImage } from '../../../../../shared/components/preview-image/preview-image';
import { EditControls } from '../../../../../shared/components/edit-controls/edit-controls';
import { CropOverlay } from '../../../../../shared/components/crop-overlay/crop-overlay';
import { PRESETS } from '../../../../../shared/config/presets.config';
import { LibButton } from '../../../../../shared/components/lib-button/lib-button';
import { PresetBar } from '../../../../../shared/components/preset-bar/preset-bar';
import { Editor } from '../../../../../core/services/editor/editor';
import { FILTER_CONTROLS } from '../../../config/filter.config';
import { Crop } from '../../../../../core/services/crop/crop';

@Component({
  selector: 'app-edit-step',
  imports: [PreviewImage, EditControls, PresetBar, LibButton, CropOverlay],
  templateUrl: './edit-step.html',
  styleUrl: './edit-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStep implements OnInit {
  public readonly srv = inject(Editor);
  public readonly cropSrv = inject(Crop);
  private readonly router = inject(Router);

  public readonly image = this.srv.sourceImage;
  public readonly filters = this.srv.filters;
  public readonly isBatchMode = this.srv.isBatchMode;

  public readonly presets = PRESETS;
  public readonly activePresetId = this.srv.activePresetId;

  public readonly isPresetGalleryOpen = signal<boolean>(false);

  public readonly zoom = signal<number>(1);
  public readonly position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  public readonly zoomLabel = computed(() => `${Math.round(this.zoom() * 100)}%`);

  public readonly showBefore = signal<boolean>(false);
  public readonly activeFilters = computed(() =>
    this.showBefore() ? NEUTRAL_FILTERS : this.filters(),
  );

  public readonly activePresetDetails = computed<Preset | null>(() => {
    const id = this.activePresetId();
    if (!id) return null;
    return this.presets.find((p) => p.id === id) ?? null;
  });

  public readonly activeSpecs = computed<PresetSpec[]>(() => {
    const details = this.activePresetDetails();
    if (!details?.state) return [];

    const dictionary: Partial<Record<keyof FilterState, string>> = {
      brightness: 'Luminance',
      contrast: 'Contrast',
      saturation: 'Color Density',
      grain: 'Film Emulsion',
      chromaticAberration: 'Lens Chroma',
    };

    return Object.entries(details.state).map(([key, val]) => ({
      label: dictionary[key as keyof FilterState] ?? key,
      val: val as number,
    }));
  });

  public readonly standardControls = computed<ActiveFilterControl[]>(() =>
    FILTER_CONTROLS.filter((c: FilterControlConfig) => c.group === 'Standard').map(
      (c: FilterControlConfig) => ({
        ...c,
        currentValue: this.filters()[c.key],
      }),
    ),
  );

  public readonly aestheticControls = computed<ActiveFilterControl[]>(() =>
    FILTER_CONTROLS.filter((c: FilterControlConfig) => c.group === 'Aesthetic').map(
      (c: FilterControlConfig) => ({
        ...c,
        currentValue: this.filters()[c.key],
      }),
    ),
  );

  public readonly isCropActive = this.cropSrv.isCropActive;
  public readonly cropRect = this.cropSrv.cropRect;
  public readonly aspectRatio = this.cropSrv.aspectRatio;
  public readonly aspectRatioOptions = ASPECT_RATIO_OPTIONS;

  public readonly sourceWidth = signal<number>(0);
  public readonly sourceHeight = signal<number>(0);

  public readonly imageAspect = computed(() => {
    const w = this.sourceWidth();
    const h = this.sourceHeight();
    return h > 0 ? w / h : 1;
  });

  public readonly appliedCropRect = computed<CropRect | null>(() => {
    if (this.isCropActive()) return null;
    return this.cropRect();
  });

  public ngOnInit(): void {
    if (!this.image()) {
      this.router.navigate(['/']);
    }
  }

  public handlePresetSelection(id: string | null): void {
    if (!id) return;
    if (this.activePresetId() === id) {
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

  public handleCanvasDimensions(dims: { width: number; height: number }): void {
    if (!this.appliedCropRect()) {
      this.sourceWidth.set(dims.width);
      this.sourceHeight.set(dims.height);

      if (this.zoom() === 1 && this.position().x === 0 && this.position().y === 0) {
        this.applyFitToViewport();
      }
    }
  }

  public applyFitToViewport(): void {
    const sw = this.sourceWidth();
    const sh = this.sourceHeight();
    if (sw <= 0 || sh <= 0) return;

    const viewportW = window.innerWidth * 0.75;
    const viewportH = window.innerHeight - 64;

    const scale = Math.min((viewportW - 80) / sw, (viewportH - 80) / sh, 1);

    this.zoom.set(scale);
    this.position.set({ x: 0, y: 0 });
  }
}
