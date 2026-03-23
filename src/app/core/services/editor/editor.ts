import { computed, Injectable, signal } from '@angular/core';
import {
  EditorStep,
  FilterState,
  ImageState,
  NEUTRAL_FILTERS,
  Preset,
} from '../../../shared/interfaces/editor.interface';

@Injectable({
  providedIn: 'root',
})
export class Editor {
  private readonly stepSignal = signal<EditorStep>('UPLOAD');
  
  private readonly stateSignal = signal<{
    images: Record<string, ImageState>;
    activeId: string | null;
    isBatchMode: boolean;
  }>({
    images: {},
    activeId: null,
    isBatchMode: false
  });

  public readonly step = this.stepSignal.asReadonly();
  
  public readonly activeImageObj = computed(() => {
    const st = this.stateSignal();
    return st.activeId ? st.images[st.activeId] : null;
  });

  public readonly sourceImage = computed(() => this.activeImageObj()?.url || null);
  public readonly filters = computed(() => this.activeImageObj()?.filters || NEUTRAL_FILTERS);
  
  public readonly cropRect = computed(() => this.activeImageObj()?.cropRect || null);
  public readonly aspectRatio = computed(() => this.activeImageObj()?.aspectRatio || null);
  public readonly isCropActive = computed(() => this.activeImageObj()?.isCropActive || false);
  public readonly activePresetId = computed(() => this.activeImageObj()?.activePresetId || null);
  
  public readonly isBatchMode = computed(() => this.stateSignal().isBatchMode);
  public readonly imagesList = computed(() => Object.values(this.stateSignal().images));

  public readonly filterString = computed(() => {
    const f = this.filters();
    return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg) blur(${f.blur}px) grayscale(${f.grayscale}%)`.trim();
  });

  public setStep(newStep: EditorStep): void {
    this.stepSignal.set(newStep);
  }

  public setActiveImage(id: string | null): void {
    this.stateSignal.update(s => ({ ...s, activeId: id }));
  }

  public addImages(files: { id: string; name: string; url: string }[]): void {
    this.stateSignal.update(s => {
      const newImages = { ...s.images };
      for (const file of files) {
        newImages[file.id] = {
          ...file,
          filters: { ...NEUTRAL_FILTERS },
          cropRect: null,
          aspectRatio: null,
          isCropActive: false,
          activePresetId: null
        };
      }
      return {
        ...s,
        images: newImages,
        activeId: s.activeId || files[0].id,
        isBatchMode: Object.keys(newImages).length > 1
      };
    });
    this.stepSignal.set('EDIT');
  }

  public applyPreset(preset: Preset): void {
    this.updateFilter({ ...NEUTRAL_FILTERS, ...preset.state } as FilterState);
  }

  public setImage(base64: string): void {
    this.addImages([{ id: 'single', name: 'image', url: base64 }]);
  }

  public updateFilter(update: Partial<FilterState>): void {
    this.stateSignal.update(s => {
      if (!s.activeId || !s.images[s.activeId]) return s;
      const img = s.images[s.activeId];
      return {
        ...s,
        images: {
          ...s.images,
          [s.activeId]: {
            ...img,
            filters: { ...img.filters, ...update }
          }
        }
      };
    });
  }

  public updateActivePresetId(id: string | null): void {
    this.stateSignal.update(s => {
      if (!s.activeId || !s.images[s.activeId]) return s;
      const img = s.images[s.activeId];
      return {
        ...s,
        images: {
          ...s.images,
          [s.activeId]: { ...img, activePresetId: id }
        }
      };
    });
  }

  public updateCropConfig(config: Partial<Pick<ImageState, 'cropRect' | 'aspectRatio' | 'isCropActive'>>): void {
    this.stateSignal.update(s => {
      if (!s.activeId || !s.images[s.activeId]) return s;
      const img = s.images[s.activeId];
      return {
        ...s,
        images: {
          ...s.images,
          [s.activeId]: { ...img, ...config }
        }
      };
    });
  }

  public applyFiltersToAll(): void {
    const active = this.activeImageObj();
    if (!active) return;
    
    this.stateSignal.update(s => {
      const updated = { ...s.images };
      for (const key in updated) {
        updated[key] = { 
          ...updated[key], 
          filters: { ...active.filters },
          activePresetId: active.activePresetId
        };
      }
      return { ...s, images: updated };
    });
  }
  
  public applyCropToAll(): void {
    const active = this.activeImageObj();
    if (!active) return;
    
    this.stateSignal.update(s => {
      const updated = { ...s.images };
      for (const key in updated) {
        updated[key] = { 
          ...updated[key], 
          cropRect: active.cropRect ? { ...active.cropRect } : null,
          aspectRatio: active.aspectRatio
        };
      }
      return { ...s, images: updated };
    });
  }

  public resetActive(): void {
    this.stateSignal.update(s => {
      if (!s.activeId || !s.images[s.activeId]) return s;
      const img = s.images[s.activeId];
      return {
        ...s,
        images: {
          ...s.images,
          [s.activeId]: {
            ...img,
            filters: { ...NEUTRAL_FILTERS },
            cropRect: null,
            aspectRatio: null,
            isCropActive: false,
            activePresetId: null
          }
        }
      };
    });
  }

  public resetAll(): void {
    this.stateSignal.set({ images: {}, activeId: null, isBatchMode: false });
    this.stepSignal.set('UPLOAD');
  }

  public reset(): void {
    this.resetAll();
  }
}
