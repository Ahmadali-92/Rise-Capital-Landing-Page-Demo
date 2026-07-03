'use client';

import Link from 'next/link';
import {FileSignature, Mail, Phone} from 'lucide-react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {ROOT_ROUTE} from '@/shared/constants/paths';

const DISPLAY = 'var(--font-rc-display)';
const MONO = 'var(--font-rc-mono)';
const GOLD = '#D9A428';
const INK = '#0B0B0C';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

// Shared dark footer used to bookend the public landing + equipment pages.
// Mirrors the original 4-column layout (brand · fleet · company) — refined with
// the premium type system, gold accents, grain texture and hover states.
const FLEET = ['Drilling Rigs', 'Workover & Support Rigs', 'Machinery Equipment', 'View all units'];
const COMPANY = ['About', 'Operators', 'Insurance', 'Contact'];

// Non-clickable footer label — keeps the hover accent (colour + gold dash) but
// does not navigate anywhere (demo has no sub-pages).
function FooterLink({label}: {label: string}) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        fontSize: 14,
        color: 'rgba(255,255,255,0.62)',
        width: 'fit-content',
        cursor: 'default',
        transition: 'color 160ms ease, gap 160ms ease',
        '& .rc-dash': {width: 0, height: '1px', bgcolor: GOLD, transition: 'width 180ms ease'},
        '&:hover': {color: '#fff', gap: 1.25},
        '&:hover .rc-dash': {width: 12},
      }}
    >
      <Box component="span" className="rc-dash" />
      {label}
    </Box>
  );
}

export default function PremiumFooter() {
  const year = new Date().getFullYear();
  return (
    <Box
      component="footer"
      data-cursor-dark
      sx={{
        position: 'relative',
        bgcolor: INK,
        color: '#fff',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN,
          opacity: 0.05,
          pointerEvents: 'none',
        },
      }}
    >
      {/* gold top hairline */}
      <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent 60%)`}} />

      {/* main grid */}
      <Box
        sx={{
          position: 'relative',
          mx: 'auto',
          maxWidth: 1400,
          display: 'grid',
          gap: {xs: 4.5, md: 5},
          px: {xs: 3.5, md: 5, xl: 6},
          py: {xs: 5.5, md: 7},
          gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'},
        }}
      >
        {/* brand block */}
        <Box sx={{gridColumn: {sm: 'span 2'}}}>
          <Box
            component={Link}
            href={ROOT_ROUTE}
            aria-label="Rise Capital — home"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.75,
              width: 'fit-content',
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Rise Capital"
              sx={{height: 60, width: 60, objectFit: 'contain'}}
            />
            <Box>
              <Typography sx={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, letterSpacing: '-0.03em', lineHeight: 1}}>
                RISE<Box component="span" sx={{color: GOLD}}>.</Box>CAPITAL
              </Typography>
              <Typography sx={{fontFamily: MONO, fontSize: 10, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.45)', mt: 0.75}}>
                EQUIPMENT RENTAL
              </Typography>
            </Box>
          </Box>
          <Typography sx={{mt: 2.25, maxWidth: 400, fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.6)'}}>
            Rise Capital equipment rentals are managed through live inventory,
            quote review, signed agreements, and manual invoice tracking — operated
            and dispatched across South Texas.
          </Typography>
          <Box
            sx={{
              mt: 2.75,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2.25,
              fontFamily: MONO,
              fontSize: 12,
              color: 'rgba(255,255,255,0.75)',
              '& > span': {display: 'inline-flex', alignItems: 'center', gap: 1},
            }}
          >
            <span><Phone size={13} color={GOLD} /> +1 (800) 555-RISE</span>
            <span><Mail size={13} color={GOLD} /> rentals@risecapital.co</span>
            <span><FileSignature size={13} color={GOLD} /> Digital agreements</span>
          </Box>
        </Box>

        {/* fleet column */}
        <Box>
          <Typography sx={{mb: 2.25, fontFamily: MONO, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: GOLD}}>
            Fleet
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.4}}>
            {FLEET.map((f) => (
              <FooterLink key={f} label={f} />
            ))}
          </Box>
        </Box>

        {/* company column */}
        <Box>
          <Typography sx={{mb: 2.25, fontFamily: MONO, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: GOLD}}>
            Company
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.4}}>
            {COMPANY.map((c) => (
              <FooterLink key={c} label={c} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* bottom bar */}
      <Box sx={{position: 'relative', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
        <Box
          sx={{
            mx: 'auto',
            maxWidth: 1400,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            px: {xs: 3.5, md: 5, xl: 6},
            py: 2.5,
          }}
        >
          <Typography sx={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)'}}>
            © {year} Rise Capital Equipment Rental. All rights reserved.
          </Typography>
          <Typography sx={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)'}}>
            risecapitalgroup.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
