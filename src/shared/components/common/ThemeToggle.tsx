'use client';

import {Moon, Sun} from 'lucide-react';

import IconButton from '@mui/material/IconButton';
import type {SxProps, Theme} from '@mui/material/styles';
import {useColorScheme} from '@mui/material/styles';

// Simple light/dark switch driven by MUI's colour-scheme system (persisted in
// localStorage). No "system" mode — the app defaults to light and this just
// flips between light and dark.
export default function ThemeToggle({sx}: {sx?: SxProps<Theme>}) {
  const {mode, setMode} = useColorScheme();

  // Before mount `mode` is undefined — render a same-size, inert placeholder so
  // server and client markup match (no hydration mismatch).
  if (!mode) {
    return (
      <IconButton disabled aria-label="Toggle theme" sx={sx}>
        <Moon size={20} />
      </IconButton>
    );
  }

  const isDark = mode === 'dark';

  return (
    <IconButton
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      sx={sx}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </IconButton>
  );
}
