export const colors = {
  background: '#f6f7fb',
  surface: '#ffffff',
  surfaceMuted: '#f1f3f9',
  border: '#e6e8f0',
  text: '#0f1222',
  textMuted: '#6b7085',
  textSubtle: '#9aa0b4',
  primary: '#5b5bd6',
  primarySoft: '#eeeefd',
  ink: '#14162b',
  inkMuted: '#a5a8c4',
  onPrimary: '#ffffff',
  success: '#12b886',
  danger: '#e5484d',
} as const;

/** Accent colors the user can pick in Settings; drive the tab bar tint. */
export const accents = [
  { name: 'Indigo', color: '#5b5bd6', soft: '#eeeefd' },
  { name: 'Teal', color: '#0d9488', soft: '#e3f6f3' },
  { name: 'Rose', color: '#e11d74', soft: '#fde7f1' },
  { name: 'Amber', color: '#d97706', soft: '#fdf1df' },
] as const;

export type Accent = (typeof accents)[number];

/** Soft tint + strong color pairs for icon badges and avatars. */
export const tones = {
  indigo: { bg: '#eeeefd', fg: '#5b5bd6' },
  teal: { bg: '#e3f6f3', fg: '#0d9488' },
  rose: { bg: '#fde7f1', fg: '#e11d74' },
  amber: { bg: '#fdf1df', fg: '#d97706' },
  sky: { bg: '#e4f2fd', fg: '#0284c7' },
  violet: { bg: '#f1e9fe', fg: '#7c3aed' },
} as const;

export type Tone = keyof typeof tones;
