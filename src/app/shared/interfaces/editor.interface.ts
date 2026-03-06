export type EditorStep = 'UPLOAD' | 'EDIT' | 'EXPORT';

export interface FilterState {
  brightness: number;
  contrast: number;
  saturation: number;
  grain: number;
  vignette: number;
  chromaticAberration: number;
  sharpness: number;
  isGrayscale: boolean;
}

export const INITIAL_FILTERS: FilterState = {
  brightness: 100,
  contrast: 120,
  saturation: 0,
  grain: 25,
  vignette: 40,
  chromaticAberration: 3,
  sharpness: 10,
  isGrayscale: true,
};

export const OPI_PRESETS = {
  GRAINY_90S: {
    brightness: 95,
    contrast: 140,
    saturation: 10,
    grain: 45,
    vignette: 50,
    chromaticAberration: 5,
    isGrayscale: false,
  },
  OBSIDIAN: {
    brightness: 80,
    contrast: 160,
    saturation: 0,
    grain: 20,
    vignette: 70,
    chromaticAberration: 2,
    isGrayscale: true,
  },
};
