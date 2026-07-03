'use client';

// Step 1 — cart review. Per-item cards with dates, duration, qty and pricing;
// nothing about the money is ever ambiguous.
import Link from 'next/link';
import {
  CalendarDays,
  Minus,
  MapPin,
  PackageOpen,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import SkeletonImage from '@/shared/components/common/SkeletonImage';
import {EQUIPMENT_ROUTES, ROOT_ROUTE} from '@/shared/constants/paths';

import {BODY, DISPLAY, GOLD, MONO, RcColors, ghostBtn, goldBtn, money, rise} from './tokens';
import {NavRow, StepHeader} from './ui';
import type {CheckoutLine} from './types';

const fmtDay = (d: Date) =>
  d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});

function AvailabilityChip({status, colors: C}: {status: string; colors: RcColors}) {
  const good = status === 'Available';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.7,
        px: 1.25,
        py: 0.4,
        borderRadius: '20px',
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        bgcolor: good ? C.successBg : C.amberBg,
        color: good ? C.success : C.amberText,
      }}
    >
      <Box sx={{width: 6, height: 6, borderRadius: '50%', bgcolor: good ? C.success : C.amber}} />
      {status}
    </Box>
  );
}

export default function CartStep({
  lines,
  colors: C,
  onQty,
  onRemove,
  onNext,
}: {
  lines: CheckoutLine[];
  colors: RcColors;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onNext: () => void;
}) {
  if (lines.length === 0) {
    return (
      <Box sx={{...rise(30), textAlign: 'center', py: {xs: 6, md: 10}}}>
        <Box
          sx={{
            mx: 'auto',
            width: 74,
            height: 74,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: C.amberBg,
            color: C.amberDk,
          }}
        >
          <PackageOpen size={32} />
        </Box>
        <Typography
          sx={{
            mt: 3,
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: {xs: 26, md: 32},
            letterSpacing: '-0.03em',
            color: C.text,
          }}
        >
          Your cart is empty
        </Typography>
        <Typography sx={{mt: 1.25, fontSize: 14.5, color: C.text2, maxWidth: 420, mx: 'auto'}}>
          Browse the fleet, pick your rental dates on any asset, and it will show
          up here ready for checkout.
        </Typography>
        <Button
          component={Link}
          href={ROOT_ROUTE}
          sx={{...goldBtn, mt: 3.5, px: 3.5, py: 1.3, fontSize: 15}}
        >
          Browse the fleet
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <StepHeader
        kicker="Step 1 — Cart"
        title="Your rental cart"
        sub="Double-check dates, quantities and rates. You can still change anything before the agreement is signed."
        colors={C}
      />

      <Box sx={{mt: 3.5, display: 'flex', flexDirection: 'column', gap: 2}}>
        {lines.map((l, i) => (
          <Box
            key={l.item.id}
            sx={{
              ...rise(90 + i * 70),
              border: `1px solid ${C.border}`,
              borderRadius: 3,
              bgcolor: C.panel,
              overflow: 'hidden',
              transition: 'border-color 180ms ease, box-shadow 180ms ease',
              '&:hover': {borderColor: `${GOLD}66`},
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', sm: '180px 1fr'},
                gap: {xs: 0, sm: 2.5},
              }}
            >
              {/* photo */}
              <Box
                sx={{
                  position: 'relative',
                  minHeight: {xs: 150, sm: '100%'},
                  borderRight: {sm: `1px solid ${C.border}`},
                  borderBottom: {xs: `1px solid ${C.border}`, sm: 'none'},
                }}
              >
                <SkeletonImage
                  src={l.eq.image}
                  alt={l.eq.name}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* details */}
              <Box sx={{p: {xs: 2, md: 2.5}, minWidth: 0}}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{minWidth: 0}}>
                    <Typography
                      sx={{
                        fontFamily: DISPLAY,
                        fontWeight: 800,
                        fontSize: {xs: 19, md: 22},
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        color: C.text,
                      }}
                    >
                      {l.eq.name}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.75,
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        fontFamily: MONO,
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: C.text3,
                      }}
                    >
                      <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.6}}>
                        <MapPin size={12} /> {l.eq.depot}
                      </Box>
                      <AvailabilityChip status={l.eq.availability} colors={C} />
                    </Box>
                  </Box>
                  <IconButton
                    aria-label={`Remove ${l.eq.name} from cart`}
                    onClick={() => onRemove(l.item.id)}
                    size="small"
                    sx={{
                      color: C.text3,
                      flexShrink: 0,
                      '&:hover': {color: C.danger, bgcolor: C.dangerBg},
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>

                {/* dates + qty + price row */}
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px dashed ${C.border}`,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    rowGap: 1.5,
                    columnGap: 3,
                  }}
                >
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <CalendarDays size={15} color={GOLD} />
                    <Box>
                      <Typography sx={{fontFamily: BODY, fontSize: 13, fontWeight: 600, color: C.text}}>
                        {fmtDay(l.from)} → {fmtDay(l.to)}
                      </Typography>
                      <Typography sx={{fontFamily: MONO, fontSize: 10.5, color: C.text3}}>
                        {l.days} day{l.days === 1 ? '' : 's'} · {money(l.eq.dailyRate)}/day
                      </Typography>
                    </Box>
                  </Box>

                  {/* qty stepper */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: `1px solid ${C.border}`,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                    }}
                  >
                    <IconButton
                      aria-label="Decrease quantity"
                      size="small"
                      disabled={l.item.qty <= 1}
                      onClick={() => onQty(l.item.id, l.item.qty - 1)}
                      sx={{borderRadius: 0, color: C.text2, '&.Mui-disabled': {color: C.text3, opacity: 0.4}}}
                    >
                      <Minus size={14} />
                    </IconButton>
                    <Typography
                      sx={{
                        px: 1.5,
                        fontFamily: MONO,
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.text,
                        minWidth: 34,
                        textAlign: 'center',
                      }}
                    >
                      {l.item.qty}
                    </Typography>
                    <IconButton
                      aria-label="Increase quantity"
                      size="small"
                      disabled={l.item.qty >= 5}
                      onClick={() => onQty(l.item.id, l.item.qty + 1)}
                      sx={{borderRadius: 0, color: C.text2, '&.Mui-disabled': {color: C.text3, opacity: 0.4}}}
                    >
                      <Plus size={14} />
                    </IconButton>
                  </Box>

                  {/* line subtotal */}
                  <Box sx={{ml: 'auto', textAlign: 'right'}}>
                    <Typography sx={{fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.text3}}>
                      Subtotal
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: DISPLAY,
                        fontWeight: 900,
                        fontSize: 22,
                        letterSpacing: '-0.02em',
                        color: GOLD,
                        lineHeight: 1.1,
                      }}
                    >
                      {money(l.lineTotal)}
                    </Typography>
                  </Box>
                </Box>

                {/* update rental link */}
                <Box sx={{mt: 1.75}}>
                  <Box
                    component={Link}
                    href={EQUIPMENT_ROUTES.detail({id: l.eq.id})}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      fontFamily: MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: C.amberDk,
                      '&:hover': {textDecoration: 'underline'},
                    }}
                  >
                    <Pencil size={12} /> Update rental
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* secondary actions */}
      <Box sx={{...rise(260), mt: 2.5, display: 'flex', gap: 1.5, flexWrap: 'wrap'}}>
        <Button
          component={Link}
          href={ROOT_ROUTE}
          startIcon={<Plus size={15} />}
          sx={{...ghostBtn(C), px: 2.5, py: 1.1, fontSize: 13.5}}
        >
          Add more equipment
        </Button>
        <Button
          component={Link}
          href={ROOT_ROUTE}
          sx={{...ghostBtn(C), px: 2.5, py: 1.1, fontSize: 13.5}}
        >
          Return to browse
        </Button>
      </Box>

      <NavRow colors={C} onNext={onNext} nextLabel="Continue checkout" />
    </Box>
  );
}
