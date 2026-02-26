// ─── App Constants ────────────────────────────────────────────────────────────

export const ALLOWED_DOMAIN =
  process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || 'hbplus.fit';

export const ADMIN_EMAILS: string[] = (
  process.env.EXPO_PUBLIC_ADMIN_EMAILS || 'admin@hbplus.fit'
)
  .split(',')
  .map((e) => e.trim().toLowerCase());

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// ─── Design System ────────────────────────────────────────────────────────────

export const COLORS = {
  // Backgrounds
  black: '#0a0a0a',
  blackSoft: '#111111',
  blackCard: '#161616',
  blackElevated: '#1c1c1c',
  blackBorder: '#242424',
  blackHover: '#1e1e1e',

  // Text
  white: '#ffffff',
  whiteSoft: '#f0f0f0',
  whiteMuted: '#9a9a9a',
  whiteSubtle: '#5a5a5a',

  // Gold accent — HB+ brand
  gold: '#c9a84c',
  goldLight: '#e2c97e',
  goldDim: '#a07830',
  goldGlow: 'rgba(201, 168, 76, 0.15)',
  goldGlowSoft: 'rgba(201, 168, 76, 0.06)',

  // Status
  error: '#ff4444',
  errorBg: 'rgba(255, 68, 68, 0.08)',
  errorBorder: 'rgba(255, 68, 68, 0.25)',
  success: '#3ddc84',
  successBg: 'rgba(61, 220, 132, 0.08)',
  successBorder: 'rgba(61, 220, 132, 0.25)',
  warning: '#ffb347',
};

export const FONT_WEIGHT = {
  thin: '100' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 72,
};
