export type EditorStep = 'UPLOAD' | 'EDIT' | 'EXPORT';

export interface FilterState {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  hueRotate: number;
  blur: number;
  grayscale: number;
  grain: number;
  vignette: number;
  chromaticAberration: number;
  sharpness: number;
  bloom: number;
  halation: number;
  toneCurve: number;
  pixelation: number;
  vhsOverlay: number;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  state: Partial<FilterState>;
}

export const NEUTRAL_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  grain: 0,
  vignette: 0,
  chromaticAberration: 0,
  sharpness: 0,
  bloom: 0,
  halation: 0,
  toneCurve: 0,
  pixelation: 0,
  vhsOverlay: 0,
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
