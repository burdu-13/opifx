import { computed, Injectable } from '@angular/core';
import {
  EditorStep,
  FilterState,
  ImageState,
  NEUTRAL_FILTERS,
} from '../shared/interfaces/editor.interface';
import { SignalStore } from '../core/services/signal-store/signal-store';

interface ImageStoreState {
  images: Record<string, ImageState>;
  activeId: string | null;
  step: EditorStep;
}

@Injectable({ providedIn: 'root' })
export class ImageStore extends SignalStore<ImageStoreState> {
  public readonly step = this.select((s) => s.step);
  public readonly activeId = this.select((s) => s.activeId);
  public readonly imagesList = this.select((s) => Object.values(s.images));

  public readonly activeImage = computed(() => {
    const s = this.stateSignal();
    return s.activeId ? s.images[s.activeId] : null;
  });

  public readonly isBatchMode = this.select((s) => Object.keys(s.images).length > 1);

  constructor() {
    super({ images: {}, activeId: null, step: 'UPLOAD' });
  }

  public setStep(step: EditorStep): void {
    this.patch({ step });
  }

  public setActiveImage(id: string | null): void {
    this.patch({ activeId: id });
  }

  public addImages(files: { id: string; name: string; url: string }[]): void {
    this.patch((state) => {
      const newImages = { ...state.images };
      files.forEach((file) => {
        newImages[file.id] = {
          ...file,
          filters: { ...NEUTRAL_FILTERS },
          cropRect: null,
          aspectRatio: null,
          isCropActive: false,
          activePresetId: null,
        };
      });

      return {
        images: newImages,
        activeId: state.activeId || files[0].id,
        step: 'EDIT',
      };
    });
  }

  public updateActiveFilters(update: Partial<FilterState>): void {
    this.patch((state) => {
      if (!state.activeId) return state;
      const active = state.images[state.activeId];
      return {
        images: {
          ...state.images,
          [state.activeId]: {
            ...active,
            filters: { ...active.filters, ...update },
          },
        },
      };
    });
  }

  public applyActiveToAll(): void {
    const active = this.activeImage();
    if (!active) return;

    this.patch((state) => {
      const updated = { ...state.images };
      Object.keys(updated).forEach((id) => {
        updated[id] = {
          ...updated[id],
          filters: { ...active.filters },
          activePresetId: active.activePresetId,
        };
      });
      return { images: updated };
    });
  }

  public reset(): void {
    this.patch({ images: {}, activeId: null, step: 'UPLOAD' });
  }
}
