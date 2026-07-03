'use client';

import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v16-appRouter';

import {NodeChildrenProps} from '@/shared/types/common';
import theme from '@/shared/theme';

// Wires Emotion's SSR cache (App Router) + the MUI theme. App defaults to light;
// the toggle switches to dark (persisted by MUI in localStorage).
const MUIProvider = ({children}: NodeChildrenProps) => (
  <AppRouterCacheProvider options={{key: 'mui'}}>
    <ThemeProvider theme={theme} defaultMode="light">
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default MUIProvider;
