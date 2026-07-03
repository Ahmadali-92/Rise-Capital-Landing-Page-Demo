'use client';

import {NodeChildrenProps} from '@/shared/types/common';

import MUIProvider from './MUIProvider';

// Frontend-only demo: the single provider is MUI (theme + Emotion SSR cache +
// colour-scheme). No Redux, no API, no auth — the pages read hardcoded data.
const Providers = ({children}: NodeChildrenProps) => (
  <MUIProvider>{children}</MUIProvider>
);

export default Providers;
