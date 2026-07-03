// Shared visual tokens for the checkout flow — an exact mirror of the
// industrial-editorial palette used by EquipmentDetail, kept in its own module
// so the existing landing/detail pages stay untouched.

export const DISPLAY = 'var(--font-rc-display)';
export const BODY = 'var(--font-rc-body)';
export const MONO = 'var(--font-rc-mono)';
export const SCRIPT = 'var(--font-rc-script)';
export const GOLD = '#D9A428';
export const GOLD_HOVER = '#bd8a1e';
export const INK = '#0B0B0C';

export type RcColors = {
  bg: string;
  panel: string;
  text: string;
  text2: string;
  text3: string;
  border: string;
  grid: string;
  amber: string;
  amberDk: string;
  amberBg: string;
  amberText: string;
  danger: string;
  dangerBg: string;
  success: string;
  successBg: string;
};

export const createRcColors = (isDark: boolean): RcColors => ({
  bg: isDark ? '#0E0E0F' : '#FBFAF7',
  panel: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
  text: isDark ? '#F5F5F5' : '#141210',
  text2: isDark ? 'rgba(255,255,255,0.72)' : '#6B6560',
  text3: isDark ? 'rgba(255,255,255,0.5)' : '#A8A39C',
  border: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
  grid: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.04)',
  amber: GOLD,
  amberDk: isDark ? '#E0B84A' : '#A07820',
  amberBg: isDark ? 'rgba(217,164,40,0.12)' : '#FBF3DE',
  amberText: isDark ? '#E0B84A' : '#7A5A10',
  danger: isDark ? '#F28B82' : '#C0392B',
  dangerBg: isDark ? 'rgba(192,57,43,0.18)' : 'rgba(192,57,43,0.08)',
  success: isDark ? '#34D399' : '#2E7D57',
  successBg: isDark ? 'rgba(46,125,87,0.18)' : '#E8F5EE',
});

// Gold pill CTA — same treatment as the detail page ("Check availability").
export const goldBtn = {
  fontFamily: BODY,
  fontWeight: 700,
  letterSpacing: '0.03em',
  bgcolor: GOLD,
  color: INK,
  border: `1px solid ${GOLD}`,
  borderRadius: 1.5,
  boxShadow: 'none',
  textTransform: 'none',
  '&:hover': {bgcolor: GOLD_HOVER, color: INK, boxShadow: 'none'},
} as const;

// Quiet secondary button — bordered, flips to gold border on hover.
export const ghostBtn = (C: RcColors) =>
  ({
    fontFamily: BODY,
    fontWeight: 700,
    letterSpacing: '0.03em',
    bgcolor: 'transparent',
    color: C.text2,
    border: `1px solid ${C.border}`,
    borderRadius: 1.5,
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover': {borderColor: GOLD, color: C.amberDk, bgcolor: C.amberBg},
  }) as const;

// Staggered entrance used across the premium pages.
export const rise = (delayMs: number) => ({
  opacity: 0,
  transform: 'translateY(16px)',
  animation: `rcCheckoutRise 680ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms forwards`,
  '@keyframes rcCheckoutRise': {to: {opacity: 1, transform: 'translateY(0)'}},
  '@media (prefers-reduced-motion: reduce)': {
    opacity: 1,
    transform: 'none',
    animation: 'none',
  },
});

// Consistent text-field styling (floating labels come from MUI's outlined
// variant; this recolors them into the checkout palette).
export const inputSx = (C: RcColors) => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: BODY,
    fontSize: 15,
    borderRadius: 1.5,
    bgcolor: C.panel,
    '& fieldset': {borderColor: C.border, transition: 'border-color 160ms ease'},
    '&:hover fieldset': {borderColor: `${GOLD}88`},
    '&.Mui-focused fieldset': {borderColor: GOLD, borderWidth: '1.5px'},
    '&.Mui-error fieldset': {borderColor: C.danger},
  },
  '& .MuiInputLabel-root': {
    fontFamily: BODY,
    color: C.text3,
    '&.Mui-focused': {color: C.amberDk},
    '&.Mui-error': {color: C.danger},
  },
  '& .MuiFormHelperText-root': {
    fontFamily: BODY,
    mx: 0.5,
    '&.Mui-error': {color: C.danger},
  },
  '& input': {color: C.text},
});

// Money formatting — whole dollars stay clean, tax lines keep cents.
export const money = (n: number) =>
  `$${n.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

export const TAX_RATE = 0.085;
