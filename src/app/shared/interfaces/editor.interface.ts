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
  sepia: number;
  hueRotate: number;
  blur: number;
  grayscale: number;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  state: Partial<FilterState>;
}

export const INITIAL_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grain: 0,
  vignette: 0,
  chromaticAberration: 0,
  sharpness: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  isGrayscale: false,
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
export interface FilterControlConfig {
  key: keyof FilterState;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  group: 'Standard' | 'Aesthetic';
}
