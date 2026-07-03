'use client';

import { createTheme } from '@mui/material/styles';

export const brandColors = {
  gold: '#D9A428',
  black: '#000000',
  white: '#FFFFFF',
  whiteMuted: 'rgba(255, 255, 255, 0.6)',
  whiteFaint: 'rgba(255, 255, 255, 0.1)',
  darkBg: '#121212',
  darkCanvas: '#242424',
  darkPaper: '#1A1A1A',
} as const;

const fontFamily = '"Plus Jakarta Sans", "Inter", "Segoe UI", Roboto, Arial, sans-serif';

// Make `palette.brand.*` known to TypeScript and the sx prop.
declare module '@mui/material/styles' {
  interface Palette {
    brand: typeof brandColors;
  }
  interface PaletteOptions {
    brand?: typeof brandColors;
  }
}

// App-wide theme with light + dark colour schemes. `cssVariables` emits CSS
// custom properties under a `.light` / `.dark` class on <html> (toggled by
// InitColorSchemeScript), so dark mode works on first paint with no flicker.
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: brandColors.gold, contrastText: brandColors.black },
        background: { default: brandColors.white, paper: brandColors.white },
        text: { primary: brandColors.black },
        brand: brandColors,
      },
    },
    dark: {
      palette: {
        primary: { main: brandColors.gold, contrastText: brandColors.black },
        background: { default: brandColors.darkBg, paper: brandColors.darkPaper },
        text: { primary: brandColors.white },
        brand: brandColors,
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily,
    fontWeightRegular: 400,
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: '0.02em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily,
          lineHeight: 1.6,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        button: {
          fontFamily: 'inherit',
        },
        input: {
          fontFamily: 'inherit',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    // NOTE: a former `MuiButton.styleOverrides.containedPrimary` block was removed
    // here — MUI v9 has no `containedPrimary` slot, so it was dead code (never
    // applied). Removing it fixes the type error without changing any styling.
    // Gold contained buttons are driven by palette.primary (gold bg / black text).
  },
});

export default theme;
