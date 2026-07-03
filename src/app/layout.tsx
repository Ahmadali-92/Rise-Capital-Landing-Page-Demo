import type {Metadata} from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import Providers from '@/shared/providers';
import {NodeChildrenProps} from '@/shared/types/common';

import './globals.css';

export const metadata: Metadata = {
  title: 'Rise Capital · Equipment Rental',
  description: 'Heavy machinery, on demand — drilling rigs, workover units and field machinery.',
};

export default function RootLayout({children}: NodeChildrenProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="light" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
