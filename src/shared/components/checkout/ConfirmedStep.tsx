'use client';

// Final screen — booking confirmed. Simulated success (frontend-only).
import Link from 'next/link';
import {CalendarDays, Check, ClipboardCheck, Mail, MapPin, Truck} from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {ROOT_ROUTE} from '@/shared/constants/paths';

import {BODY, DISPLAY, GOLD, MONO, RcColors, goldBtn, money, rise} from './tokens';
import type {AccountState, CheckoutLine, ScheduleState} from './types';

const fmtDay = (d: Date) =>
  d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});

const fmtToday = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export default function ConfirmedStep({
  colors: C,
  lines,
  schedule,
  account,
  total,
  bookingRef,
}: {
  colors: RcColors;
  lines: CheckoutLine[];
  schedule: ScheduleState;
  account: AccountState | null;
  total: number;
  bookingRef: string;
}) {
  const siteCity = [schedule.city, schedule.region].filter(Boolean).join(', ');

  const nextSteps = [
    {
      icon: ClipboardCheck,
      title: 'COI verification',
      body: 'Our team reviews your Certificate of Insurance — usually within one business day.',
    },
    {
      icon: Mail,
      title: 'Confirmation email',
      body: account?.email
        ? `A signed copy of your agreement and booking details is on its way to ${account.email}.`
        : 'A signed copy of your rental agreement and booking details is on its way.',
    },
    {
      icon: Truck,
      title: 'Dispatch & delivery',
      body: `Your equipment is staged, inspected and delivered${
        siteCity ? ` to ${siteCity}` : ' to your site'
      } in your chosen window — and collected when your rental ends.`,
    },
  ];

  return (
    <Box sx={{textAlign: 'center', maxWidth: 720, mx: 'auto'}}>
      {/* gold check burst */}
      <Box sx={{...rise(30), display: 'grid', placeItems: 'center'}}>
        <Box
          sx={{
            position: 'relative',
            width: 96,
            height: 96,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* expanding ring */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px solid ${GOLD}`,
              animation: 'rcConfirmRing 1.6s cubic-bezier(0.22,1,0.36,1) 200ms both',
              '@keyframes rcConfirmRing': {
                from: {transform: 'scale(0.6)', opacity: 0.9},
                to: {transform: 'scale(1.45)', opacity: 0},
              },
              '@media (prefers-reduced-motion: reduce)': {animation: 'none', opacity: 0},
            }}
          />
          <Box
            sx={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: GOLD,
              color: '#0B0B0C',
              animation: 'rcConfirmPop 620ms cubic-bezier(0.34,1.56,0.64,1) both',
              '@keyframes rcConfirmPop': {
                from: {transform: 'scale(0.4)', opacity: 0},
                to: {transform: 'scale(1)', opacity: 1},
              },
              '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
            }}
          >
            <Check size={40} strokeWidth={3} />
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          ...rise(140),
          mt: 3,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: {xs: 34, md: 46},
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: C.text,
        }}
      >
        Booking Confirmed!
      </Typography>
      <Typography sx={{...rise(200), mt: 1.75, fontSize: {xs: 14, md: 15.5}, lineHeight: 1.7, color: C.text2, maxWidth: 520, mx: 'auto'}}>
        {account ? `Thanks, ${account.firstName} — your` : 'Your'} rental agreement
        is signed and your equipment is reserved. We&apos;ll take it from here.
      </Typography>

      <Typography
        sx={{
          ...rise(240),
          mt: 2.5,
          display: 'inline-flex',
          px: 2,
          py: 0.8,
          borderRadius: '20px',
          border: `1px solid ${GOLD}66`,
          bgcolor: C.amberBg,
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: '0.12em',
          color: C.amberText,
        }}
      >
        BOOKING REF · {bookingRef}
      </Typography>

      <Typography sx={{...rise(260), mt: 1.5, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.text3}}>
        Signed &amp; confirmed · {fmtToday()}
      </Typography>

      {/* booking recap */}
      <Box
        sx={{
          ...rise(300),
          mt: 4,
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          bgcolor: C.panel,
          overflow: 'hidden',
          textAlign: 'left',
        }}
      >
        {lines.map((l) => (
          <Box
            key={l.item.id}
            sx={{
              px: {xs: 2.5, md: 3},
              py: 2,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography sx={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: C.text}}>
                {l.eq.name}
                {l.item.qty > 1 ? ` × ${l.item.qty}` : ''}
              </Typography>
              <Typography sx={{fontFamily: MONO, fontSize: 11, color: C.text3, mt: 0.25}}>
                {fmtDay(l.from)} → {fmtDay(l.to)} · {l.days} day{l.days === 1 ? '' : 's'}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: DISPLAY,
                fontVariantNumeric: 'tabular-nums',
                fontSize: 16.5,
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: C.text,
              }}
            >
              {money(l.lineTotal)}
            </Typography>
          </Box>
        ))}
        <Box
          sx={{
            px: {xs: 2.5, md: 3},
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{display: 'flex', gap: 2.5, flexWrap: 'wrap', fontSize: 12.5, color: C.text2}}>
            {siteCity && (
              <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.75}}>
                <MapPin size={13} color={GOLD} /> Deliver to {siteCity}
              </Box>
            )}
            {schedule.dropOff && (
              <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.75}}>
                <CalendarDays size={13} color={GOLD} /> Drop-off {schedule.dropOff}
              </Box>
            )}
            {schedule.pickup && (
              <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.75}}>
                <Truck size={13} color={GOLD} /> Pickup {schedule.pickup}
              </Box>
            )}
          </Box>
          <Typography sx={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 22, letterSpacing: '-0.02em', color: GOLD}}>
            {money(total)}
          </Typography>
        </Box>
      </Box>

      {/* what happens next */}
      <Box
        sx={{
          ...rise(360),
          mt: 3,
          display: 'grid',
          gridTemplateColumns: {xs: '1fr', sm: 'repeat(3, 1fr)'},
          gap: 1.5,
          textAlign: 'left',
        }}
      >
        {nextSteps.map((s) => (
          <Box
            key={s.title}
            sx={{border: `1px dashed ${C.border}`, borderRadius: 2.5, p: 2}}
          >
            <Box sx={{color: C.amberDk, display: 'flex'}}>
              <s.icon size={17} />
            </Box>
            <Typography sx={{mt: 1.25, fontFamily: BODY, fontSize: 13.5, fontWeight: 700, color: C.text}}>
              {s.title}
            </Typography>
            <Typography sx={{mt: 0.5, fontSize: 12, lineHeight: 1.6, color: C.text2}}>
              {s.body}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{...rise(420), mt: 4}}>
        <Button component={Link} href={ROOT_ROUTE} sx={{...goldBtn, px: 4, py: 1.4, fontSize: 15}}>
          Back to the fleet
        </Button>
      </Box>
    </Box>
  );
}
