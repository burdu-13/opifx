import { FilterState } from '../../../shared/interfaces/editor.interface';

export const PRESET_SPEC_DICTIONARY: Partial<Record<keyof FilterState, string>> = {
  brightness: 'Luminance',
  contrast: 'Contrast',
  saturation: 'Color Density',
  grain: 'Film Emulsion',
  chromaticAberration: 'Lens Chroma',
};
