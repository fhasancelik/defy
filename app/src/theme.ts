export const colors = {
  bg: '#0A0E1A',
  surface: '#131A2E',
  surfaceAlt: '#1B2440',
  border: '#27314F',
  text: '#F4F6FF',
  textDim: '#8A93B5',
  textFaint: '#5A6284',
  accent: '#4ADE80',
  accentDark: '#16A34A',
  accentSoft: 'rgba(74,222,128,0.12)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239,68,68,0.14)',
  warning: '#FBBF24',
};

export const gradients = {
  accent: ['#4ADE80', '#22C55E'] as const,
  panic: ['#F87171', '#DC2626'] as const,
  card: ['#1B2440', '#131A2E'] as const,
};

export const spacing = (n: number) => n * 4;

export const radius = { md: 14, lg: 20, xl: 28, full: 999 };

export const font = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  huge: 44,
  giant: 64,
};
