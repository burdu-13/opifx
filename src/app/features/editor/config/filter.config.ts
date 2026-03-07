import { FilterControlConfig } from '../../../shared/interfaces/editor.interface';

export const FILTER_CONTROLS: readonly FilterControlConfig[] = [
  { key: 'brightness', label: 'Exposure', min: 0, max: 200, step: 1, unit: '%', group: 'Standard' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, unit: '%', group: 'Standard' },
  { key: 'saturation', label: 'Vibrance', min: 0, max: 200, step: 1, unit: '%', group: 'Standard' },
  {
    key: 'hueRotate',
    label: 'Color Shift',
    min: 0,
    max: 360,
    step: 1,
    unit: '°',
    group: 'Aesthetic',
  },
  { key: 'blur', label: 'Soft Focus', min: 0, max: 10, step: 0.1, unit: 'px', group: 'Aesthetic' },
  { key: 'grain', label: 'Noise', min: 0, max: 100, step: 1, unit: '%', group: 'Aesthetic' },
  {
    key: 'chromaticAberration',
    label: 'Fringe',
    min: 0,
    max: 20,
    step: 1,
    unit: 'px',
    group: 'Aesthetic',
  },
];
