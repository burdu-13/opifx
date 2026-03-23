export interface HeroContent {
  label: string;
  title: string;
  description: string;
}

export const HERO_CONTENT: Record<'STUDIO' | 'BATCH', HeroContent> = {
  STUDIO: {
    label: 'Image Editor',
    title: 'presets to suit your vibe.',
    description: 'Upload your image and choose your style.',
  },
  BATCH: {
    label: 'Batch Editor',
    title: 'presets to suit your vibe.',
    description: 'Upload your images for bulk processing',
  },
};
