import { FilterState } from '../interfaces/editor.interface';

export interface Preset {
  id: string;
  name: string;
  description: string;
  state: Partial<FilterState>;
}

export const PRESETS: Preset[] = [
  {
    id: 'ovo-summer',
    name: 'OVO_SUMMER',
    description: 'Warm Toronto summer evening tones with soft highlights and cool shadows.',
    state: {
      brightness: 112,
      contrast: 95,
      saturation: 105,
      hueRotate: 210,
      grain: 18,
      blur: 0.35,
      vignette: 22,
    },
  },
  {
    id: 'drake-take-care',
    name: 'TAKE_CARE',
    description: 'Moody cinematic blues with subdued saturation and atmospheric grain.',
    state: {
      brightness: 92,
      contrast: 115,
      saturation: 70,
      hueRotate: 215,
      grain: 28,
      vignette: 45,
      blur: 0.5,
    },
  },
  {
    id: 'summer-sixteen',
    name: 'SUMMER16',
    description: 'Bright golden sunlight with vibrant skin tones and soft DSLR bloom.',
    state: {
      brightness: 135,
      contrast: 110,
      saturation: 135,
      sepia: 8,
      grain: 16,
      blur: 0.25,
      vignette: 18,
    },
  },
  {
    id: 'cactus-jack-tour',
    name: 'CACTUS_TOUR',
    description: 'Stage lighting warmth with heavy grain and aggressive contrast.',
    state: {
      brightness: 118,
      contrast: 170,
      saturation: 140,
      grain: 48,
      chromaticAberration: 8,
      vignette: 38,
    },
  },
  {
    id: 'rodeo-film',
    name: 'RODEO_FILM',
    description: 'Dusty Texas desert tones with warm highlights and faded blacks.',
    state: {
      brightness: 108,
      contrast: 95,
      saturation: 125,
      sepia: 18,
      grain: 34,
      blur: 0.4,
      vignette: 26,
    },
  },
  {
    id: 'astro-night',
    name: 'ASTRO_NIGHT',
    description: 'Neon club lighting with saturated colors and chromatic lens artifacts.',
    state: {
      brightness: 120,
      contrast: 145,
      saturation: 160,
      hueRotate: 190,
      chromaticAberration: 12,
      grain: 30,
      blur: 0.3,
    },
  },
  {
    id: 'young-thug-slime',
    name: 'SLIME_SEASON',
    description: 'Bright Atlanta sunlight with hyper-saturated greens and soft shadows.',
    state: {
      brightness: 130,
      contrast: 105,
      saturation: 175,
      hueRotate: 85,
      grain: 20,
      blur: 0.2,
      vignette: 14,
    },
  },
  {
    id: 'atlanta-summer',
    name: 'ATL_SUMMER',
    description: 'Hot summer daylight with blown highlights and vivid color processing.',
    state: {
      brightness: 142,
      contrast: 120,
      saturation: 155,
      grain: 24,
      sharpness: 18,
      vignette: 16,
    },
  },
  {
    id: 'miami-vice-rap',
    name: 'VICE_RAP',
    description: 'Pastel neon nightlife palette inspired by luxury rap visuals.',
    state: {
      brightness: 118,
      contrast: 108,
      saturation: 150,
      hueRotate: 180,
      chromaticAberration: 10,
      grain: 18,
      blur: 0.35,
    },
  },
  {
    id: 'luxury-rap',
    name: 'RICH_FOREVER',
    description: 'Clean luxury aesthetic with glossy highlights and controlled contrast.',
    state: {
      brightness: 110,
      contrast: 125,
      saturation: 120,
      sharpness: 20,
      grain: 10,
      vignette: 12,
    },
  },
  {
    id: '2014-dslr',
    name: 'DSLR_2014',
    description: 'Classic mid-2010s DSLR color science with crisp detail and warm highlights.',
    state: {
      brightness: 122,
      contrast: 130,
      saturation: 135,
      sharpness: 24,
      grain: 12,
      vignette: 14,
    },
  },
  {
    id: 'tour-bus-night',
    name: 'TOUR_BUS',
    description: 'Low-light tour footage with sensor noise and cool shadows.',
    state: {
      brightness: 98,
      contrast: 135,
      saturation: 90,
      grain: 52,
      hueRotate: 205,
      blur: 0.45,
      vignette: 40,
    },
  },
];
