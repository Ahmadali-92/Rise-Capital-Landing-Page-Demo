// Premium type system for the redesigned public pages (landing + equipment
// detail). Loaded via next/font in the server page components and exposed as CSS
// variables scoped to a wrapper — so the rest of the app keeps its own fonts.
//
// Pairing: Archivo (industrial grotesque display) + Hanken Grotesk (refined body)
// + Space Mono (technical/data kickers).
import {Archivo, Hanken_Grotesk, Space_Mono} from 'next/font/google';

export const rcDisplay = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-rc-display',
  display: 'swap',
});

export const rcBody = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rc-body',
  display: 'swap',
});

export const rcMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-rc-mono',
  display: 'swap',
});

export const rcFontVars = `${rcDisplay.variable} ${rcBody.variable} ${rcMono.variable}`;
