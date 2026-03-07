import { FilterControlConfig } from '../../../shared/interfaces/editor.interface';

export const FILTER_CONTROLS: readonly FilterControlConfig[] = [
  {
    key: 'brightness',
    label: 'Brightness',
    min: 0,
    max: 200,
    step: 1,
    unit: '%',
    group: 'Standard',
  },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, unit: '%', group: 'Standard' },
  {
    key: 'saturation',
    label: 'Saturation',
    min: 0,
    max: 200,
    step: 1,
    unit: '%',
    group: 'Standard',
  },
  { key: 'grain', label: 'Grain', min: 0, max: 100, step: 1, unit: '%', group: 'Aesthetic' },
  {
    key: 'chromaticAberration',
    label: 'Chroma Shift',
    min: 0,
    max: 20,
    step: 1,
    unit: 'px',
    group: 'Aesthetic',
  },
];
