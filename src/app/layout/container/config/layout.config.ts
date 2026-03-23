export interface HeroContent {
  label: string;
  title: string;
  description: string;
}

export const HERO_CONTENT: Record<'STUDIO' | 'BATCH', HeroContent> = {
  STUDIO: {
    label: 'Aesthetic Ingest',
    title: 'Industrial Image Engine.',
    description: 'Curate high-contrast, atmospheric visuals with absolute precision.',
  },
  BATCH: {
    label: 'Batch Studio',
    title: 'Professional batch processing.',
    description: 'Consistent atmospheres across your entire library simultaneously.',
  },
};
