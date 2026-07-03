'use client';

// Sticky order summary rail — visible on every step so the total is never a
// mystery. Recaps logistics once they're picked.
import {CalendarDays, Clock, Lock, ShieldCheck, Truck} from 'lucide-react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SkeletonImage from '@/shared/components/common/SkeletonImage';

import {BODY, DISPLAY, GOLD, MONO, RcColors, TAX_RATE, money} from './tokens';
import type {CheckoutLine, ScheduleState} from './types';

const fmtDay = (d: Date) =>
  d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});

function Row({
  label,
  value,
  colors: C,
  strong = false,
}: {
  label: string;
  value: string;
  colors: RcColors;
  strong?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: strong ? 14 : 13.5,
        color: strong ? C.text : C.text2,
      }}
    >
      <Box component="span" sx={{fontWeight: strong ? 600 : 500}}>
        {label}
      </Box>
      <Box
        component="span"
        sx={{
          // Money ladder: subtotal/tax read as clean tabular display numerals
          // (not the awkwardly-spaced mono commas), grand total dominates.
          fontFamily: DISPLAY,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: strong ? 900 : 700,
          fontSize: strong ? 27 : 16,
          letterSpacing: strong ? '-0.03em' : '-0.01em',
          color: strong ? GOLD : C.text,
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export default function OrderSummary({
  lines,
  schedule,
  colors: C,
}: {
  lines: CheckoutLine[];
  schedule: ScheduleState;
  colors: RcColors;
}) {
  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  return (
    <Box
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: 3,
        bgcolor: C.panel,
        overflow: 'hidden',
      }}
    >
      <Box sx={{px: {xs: 2.5, md: 3}, pt: 2.5, pb: 2}}>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: C.text3,
          }}
        >
          Order summary
        </Typography>

        {/* item mini-list */}
        <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 1.75}}>
          {lines.map((l) => (
            <Box key={l.item.id} sx={{display: 'flex', gap: 1.5, alignItems: 'center'}}>
              <Box
                sx={{
                  position: 'relative',
                  width: 52,
                  height: 40,
                  borderRadius: 1.25,
                  overflow: 'hidden',
                  border: `1px solid ${C.border}`,
                  flexShrink: 0,
                }}
              >
                <SkeletonImage
                  src={l.eq.image}
                  alt={l.eq.name}
                  sx={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
              </Box>
              <Box sx={{minWidth: 0, flex: 1}}>
                <Typography
                  noWrap
                  sx={{fontFamily: BODY, fontSize: 14, fontWeight: 700, color: C.text}}
                >
                  {l.eq.name}
                  {l.item.qty > 1 && (
                    <Box component="span" sx={{color: C.text3, fontWeight: 400}}>
                      {' '}
                      × {l.item.qty}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{fontFamily: MONO, fontSize: 10.5, color: C.text3, mt: 0.35}}
                >
                  {fmtDay(l.from)} → {fmtDay(l.to)} · {l.days}d
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
                  flexShrink: 0,
                }}
              >
                {money(l.lineTotal)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* logistics recap (appears once picked) */}
        {(schedule.city || schedule.dropOff || schedule.pickup) && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px dashed ${C.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
            }}
          >
            {schedule.city && (
              <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: 12.5, color: C.text2}}>
                <Truck size={13} color={GOLD} style={{marginTop: 2, flexShrink: 0}} />
                <Box component="span">
                  Deliver to{' '}
                  <Box component="span" sx={{color: C.text}}>
                    {[schedule.city, schedule.region].filter(Boolean).join(', ')}
                  </Box>
                </Box>
              </Box>
            )}
            {schedule.dropOff && (
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1, fontSize: 12.5, color: C.text2}}>
                <CalendarDays size={13} color={GOLD} />
                Drop-off · <Box component="span" sx={{fontFamily: MONO, color: C.text}}>{schedule.dropOff}</Box>
              </Box>
            )}
            {schedule.pickup && (
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1, fontSize: 12.5, color: C.text2}}>
                <Clock size={13} color={GOLD} />
                Pickup · <Box component="span" sx={{fontFamily: MONO, color: C.text}}>{schedule.pickup}</Box>
              </Box>
            )}
          </Box>
        )}

        {/* totals */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Row label="Subtotal" value={money(subtotal)} colors={C} />
          <Row label="Tax (8.5%)" value={money(tax)} colors={C} />
        </Box>
        <Box sx={{mt: 1.75, pt: 1.75, borderTop: `1px solid ${C.border}`}}>
          <Row label="Grand total" value={money(total)} colors={C} strong />
        </Box>
      </Box>

      {/* trust strip */}
      <Box
        sx={{
          px: {xs: 2.5, md: 3},
          py: 1.75,
          bgcolor: C.amberBg,
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.9,
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, fontSize: 12, color: C.amberText}}>
          <ShieldCheck size={13} /> No charge until the contract is signed
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, fontSize: 12, color: C.amberText}}>
          <Lock size={13} /> Your details stay private &amp; encrypted
        </Box>
      </Box>
    </Box>
  );
}
