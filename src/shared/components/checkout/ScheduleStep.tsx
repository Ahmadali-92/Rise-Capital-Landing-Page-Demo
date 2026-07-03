'use client';

// Step 2 — drop-off / pickup scheduling. Visual 2-hour slot grid (7 AM–7 PM),
// never a plain <select>.
import {Check, MapPin, Moon, Sun, Sunrise, Sunset, Truck} from 'lucide-react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {BODY, DISPLAY, GOLD, MONO, RcColors, inputSx, rise} from './tokens';
import {InfoCallout, NavRow, StepHeader} from './ui';
import type {CheckoutLine, ScheduleState} from './types';

const SLOTS = [
  {label: '7:00 – 9:00 AM', icon: Sunrise},
  {label: '9:00 – 11:00 AM', icon: Sun},
  {label: '11:00 AM – 1:00 PM', icon: Sun},
  {label: '1:00 – 3:00 PM', icon: Sun},
  {label: '3:00 – 5:00 PM', icon: Sunset},
  {label: '5:00 – 7:00 PM', icon: Moon},
] as const;

const fmtDay = (d: Date) =>
  d.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});

function SlotGrid({
  colors: C,
  value,
  onPick,
  groupLabel,
}: {
  colors: RcColors;
  value?: string;
  onPick: (slot: string) => void;
  groupLabel: string;
}) {
  return (
    <Box
      role="radiogroup"
      aria-label={groupLabel}
      sx={{
        display: 'grid',
        gridTemplateColumns: {xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'},
        gap: 1.25,
      }}
    >
      {SLOTS.map((slot) => {
        const selected = value === slot.label;
        const Icon = slot.icon;
        return (
          <Box
            key={slot.label}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onPick(slot.label)}
            sx={{
              position: 'relative',
              textAlign: 'left',
              px: 1.75,
              py: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              bgcolor: selected ? C.amberBg : C.panel,
              border: `1.5px solid ${selected ? GOLD : C.border}`,
              transition: 'border-color 160ms ease, background-color 160ms ease, transform 160ms ease',
              '&:hover': {borderColor: GOLD, transform: 'translateY(-1px)'},
              '&:focus-visible': {outline: `2px solid ${GOLD}`, outlineOffset: 2},
            }}
          >
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Box sx={{color: selected ? C.amberDk : C.text3, display: 'flex'}}>
                <Icon size={15} />
              </Box>
              {selected && (
                <Box
                  sx={{
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    bgcolor: GOLD,
                    color: '#0B0B0C',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Check size={11} strokeWidth={3} />
                </Box>
              )}
            </Box>
            <Typography
              sx={{
                mt: 1,
                fontFamily: MONO,
                fontSize: {xs: 11.5, md: 12.5},
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: selected ? C.amberText : C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {slot.label}
            </Typography>
            <Typography sx={{fontFamily: BODY, fontSize: 10.5, color: C.text3, mt: 0.25}}>
              Available
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function ScheduleStep({
  lines,
  colors: C,
  value,
  onChange,
  onBack,
  onNext,
}: {
  lines: CheckoutLine[];
  colors: RcColors;
  value: ScheduleState;
  onChange: (s: ScheduleState) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  // Order-level windows anchored to the earliest start / latest end date.
  const startDate = lines.length
    ? new Date(Math.min(...lines.map((l) => l.from.getTime())))
    : undefined;
  const endDate = lines.length
    ? new Date(Math.max(...lines.map((l) => l.to.getTime())))
    : undefined;

  // We always deliver to — and collect from — the customer's site, so the site
  // address is always required (no yard-pickup option).
  const addressOk = Boolean(
    value.address?.trim() &&
      value.city?.trim() &&
      value.region?.trim() &&
      value.zip?.trim()
  );
  const ready = Boolean(value.dropOff && value.pickup && addressOk);

  const setField = (key: keyof ScheduleState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({...value, [key]: e.target.value});

  return (
    <Box>
      <StepHeader
        kicker="Step 2 — Logistics"
        title="Delivery & collection"
        sub="We deliver the equipment to your site and collect it when you're done. Give us the site address, then pick a two-hour window for each."
        colors={C}
      />

      <Box sx={{...rise(120), mt: 3}}>
        <InfoCallout colors={C} icon={<Truck size={17} />} title="Why we schedule this">
          Your windows tell our yard crew exactly when to stage, fuel and inspect
          your equipment — so it's loaded and rolling to your site on time, and
          collected the moment your rental ends. No waiting around.
        </InfoCallout>
      </Box>

      {/* site address — always required (we deliver + collect here) */}
      <Box sx={{...rise(150), mt: 4}}>
        <Typography sx={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 19, letterSpacing: '-0.01em', color: C.text}}>
          Where should we deliver?
        </Typography>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: C.text3,
            mt: 0.5,
            mb: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          <MapPin size={13} color={GOLD} /> Job site address
        </Typography>
        <Box sx={{display: 'grid', gap: 2}}>
          <TextField
            label="Street address"
            value={value.address ?? ''}
            onChange={setField('address')}
            autoComplete="address-line1"
            sx={inputSx(C)}
          />
          <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '2fr 1fr 1fr'}, gap: 2}}>
            <TextField
              label="City"
              value={value.city ?? ''}
              onChange={setField('city')}
              autoComplete="address-level2"
              sx={inputSx(C)}
            />
            <TextField
              label="State"
              value={value.region ?? ''}
              onChange={setField('region')}
              autoComplete="address-level1"
              sx={inputSx(C)}
            />
            <TextField
              label="ZIP"
              value={value.zip ?? ''}
              onChange={setField('zip')}
              autoComplete="postal-code"
              sx={inputSx(C)}
            />
          </Box>
        </Box>
      </Box>

      {/* drop-off — when WE deliver to the site */}
      <Box sx={{...rise(180), mt: 4}}>
        <Typography
          sx={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 19,
            letterSpacing: '-0.01em',
            color: C.text,
          }}
        >
          Drop-off window
        </Typography>
        <Typography sx={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.text3, mt: 0.5, mb: 1.75}}>
          {startDate ? fmtDay(startDate) : '—'} · when we deliver
        </Typography>
        <SlotGrid
          colors={C}
          value={value.dropOff}
          onPick={(slot) => onChange({...value, dropOff: slot})}
          groupLabel="Drop-off time window"
        />
      </Box>

      {/* pickup — when WE collect from the site */}
      <Box sx={{...rise(240), mt: 4}}>
        <Typography
          sx={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 19,
            letterSpacing: '-0.01em',
            color: C.text,
          }}
        >
          Pickup window
        </Typography>
        <Typography sx={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.text3, mt: 0.5, mb: 1.75}}>
          {endDate ? fmtDay(endDate) : '—'} · when we collect
        </Typography>
        <SlotGrid
          colors={C}
          value={value.pickup}
          onPick={(slot) => onChange({...value, pickup: slot})}
          groupLabel="Pickup time window"
        />
      </Box>

      <NavRow
        colors={C}
        onBack={onBack}
        onNext={onNext}
        nextLabel="Continue"
        nextDisabled={!ready}
        nextHint={
          !ready
            ? !addressOk
              ? 'Enter your job site address to continue'
              : 'Select a drop-off and a pickup window to continue'
            : undefined
        }
      />
    </Box>
  );
}
