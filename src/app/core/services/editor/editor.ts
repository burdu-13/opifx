import { computed, inject, Injectable } from '@angular/core';
import {
  EditorStep,
  FilterState,
  NEUTRAL_FILTERS,
  Preset,
} from '../../../shared/interfaces/editor.interface';
import { ImageStore } from '../../../store/image.store';

@Injectable({
  providedIn: 'root',
})
export class Editor {
  private readonly store = inject(ImageStore);

  public readonly step = this.store.step;
  public readonly imagesList = this.store.imagesList;
  public readonly isBatchMode = this.store.isBatchMode;
  public readonly activeImage = this.store.activeImage;
  public readonly activeId = this.store.activeId;

  public readonly activeImageObj = this.store.activeImage;
  public readonly sourceImage = computed(() => this.activeImage()?.url ?? null);
  public readonly filters = computed(() => this.activeImage()?.filters ?? NEUTRAL_FILTERS);
  public readonly activePresetId = computed(() => this.activeImage()?.activePresetId ?? null);

  public readonly cropRect = computed(() => this.activeImage()?.cropRect ?? null);
  public readonly aspectRatio = computed(() => this.activeImage()?.aspectRatio ?? null);
  public readonly isCropActive = computed(() => this.activeImage()?.isCropActive ?? false);

  public setStep(newStep: EditorStep): void {
    this.store.setStep(newStep);
  }

  public setActiveImage(id: string | null): void {
    this.store.setActiveImage(id);
  }

  public addImages(files: { id: string; name: string; url: string }[]): void {
    this.store.addImages(files);
  }

  public setImage(base64: string): void {
    this.store.addImages([{ id: 'single', name: 'image', url: base64 }]);
  }

  public updateFilter(update: Partial<FilterState>): void {
    this.store.updateActiveFilters(update);
  }

  public updateActivePresetId(id: string | null): void {
    this.store.updateActivePresetId(id);
  }

  public applyPreset(preset: Preset): void {
    this.store.updateActiveFilters({ ...NEUTRAL_FILTERS, ...preset.state });
    this.store.updateActivePresetId(preset.id);
  }

  public updateCropConfig(config: any): void {
    this.store.updateActiveCrop(config);
  }

  public applyFiltersToAll(): void {
    this.store.applyFiltersToAll();
  }

  public applyCropToAll(): void {
    this.store.applyCropToAll();
  }

  public resetActive(): void {
    this.store.resetActive();
  }

  public resetAll(): void {
    this.store.resetAll();
  }

  public reset(): void {
    this.resetAll();
  }
}
