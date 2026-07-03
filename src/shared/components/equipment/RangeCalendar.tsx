'use client';

import {useMemo, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export interface DateRange {
  from?: Date;
  to?: Date;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Lightweight range calendar (no external date library). Disabled days come
// from the `disabled` predicate (e.g. past dates + rented/maintenance windows).
export default function RangeCalendar({
  value,
  onChange,
  disabled,
  unavailable,
  months = 1,
  onDark = false,
}: {
  value: DateRange | undefined;
  onChange: (r: DateRange | undefined) => void;
  // Non-selectable for neutral reasons (e.g. past dates) — shown dimmed.
  disabled?: (date: Date) => boolean;
  // Booked / maintenance dates — shown clearly as "taken" (red tint).
  unavailable?: (date: Date) => boolean;
  months?: number;
  // Render light-on-dark so the calendar reads well on a black panel.
  onDark?: boolean;
}) {
  const palette = onDark
    ? {
        weekday: 'rgba(255,255,255,0.5)',
        day: 'rgba(255,255,255,0.92)',
        disabled: 'rgba(255,255,255,0.32)',
        unavailBg: 'rgba(192,57,43,0.32)',
        unavailFg: 'rgba(255,228,225,0.92)',
        unavailBorder: 'rgba(242,139,130,0.55)',
        hover: 'rgba(255,255,255,0.08)',
        within: 'rgba(217,164,40,0.22)',
        nav: 'rgba(255,255,255,0.85)',
      }
    : {
        weekday: 'text.secondary',
        day: 'text.primary',
        disabled: 'text.disabled',
        unavailBg: 'rgba(192,57,43,0.10)',
        unavailFg: '#b0392f',
        unavailBorder: 'rgba(192,57,43,0.35)',
        hover: 'action.hover',
        within: 'rgba(217,164,40,0.15)',
        nav: 'inherit',
      };
  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const shift = (n: number) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1));

  const handlePick = (day: Date) => {
    if (disabled?.(day) || unavailable?.(day)) return;
    const {from, to} = value ?? {};
    if (!from || (from && to)) {
      onChange({from: day, to: undefined});
    } else if (day < from) {
      onChange({from: day, to: undefined});
    } else {
      onChange({from, to: day});
    }
  };

  const inRange = (day: Date) =>
    value?.from && value?.to && day >= value.from && day <= value.to;
  const isEdge = (day: Date) =>
    (value?.from && sameDay(day, value.from)) || (value?.to && sameDay(day, value.to));

  const renderMonth = (base: Date, idx: number) => {
    const year = base.getFullYear();
    const month = base.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    return (
      <Box key={idx} sx={{flex: 1, minWidth: 240}}>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
          {idx === 0 ? (
            <IconButton size="small" onClick={() => shift(-1)} aria-label="Previous month" sx={{color: palette.nav}}>
              <ChevronLeft size={16} />
            </IconButton>
          ) : (
            <Box sx={{width: 30}} />
          )}
          <Typography sx={{fontSize: 14, fontWeight: 600}}>{MONTHS[month]} {year}</Typography>
          {idx === months - 1 ? (
            <IconButton size="small" onClick={() => shift(1)} aria-label="Next month" sx={{color: palette.nav}}>
              <ChevronRight size={16} />
            </IconButton>
          ) : (
            <Box sx={{width: 30}} />
          )}
        </Box>
        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25}}>
          {WEEKDAYS.map((w) => (
            <Box key={w} sx={{textAlign: 'center', fontSize: 11, color: palette.weekday, py: 0.5}}>{w}</Box>
          ))}
          {cells.map((day, i) => {
            if (!day) return <Box key={i} />;
            const isUnavailable = unavailable?.(day) ?? false;
            const isPast = (disabled?.(day) ?? false) && !isUnavailable;
            const isDisabled = isPast || isUnavailable;
            const selected = isEdge(day);
            const within = inRange(day) && !selected;
            return (
              <Box
                key={i}
                component="button"
                type="button"
                disabled={isDisabled}
                onClick={() => handlePick(day)}
                aria-label={isUnavailable ? `${day.getDate()} — unavailable` : undefined}
                title={isUnavailable ? 'Unavailable' : undefined}
                sx={{
                  border: 0,
                  borderRadius: 1,
                  aspectRatio: '1 / 1',
                  fontSize: 13,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  color: selected
                    ? 'brand.black'
                    : isUnavailable
                      ? palette.unavailFg
                      : isPast
                        ? palette.disabled
                        : palette.day,
                  bgcolor: selected
                    ? 'brand.gold'
                    : within
                      ? palette.within
                      : isUnavailable
                        ? palette.unavailBg
                        : 'transparent',
                  // Inset ring keeps the grid alignment intact (no layout shift).
                  boxShadow: isUnavailable ? `inset 0 0 0 1px ${palette.unavailBorder}` : 'none',
                  textDecoration: isUnavailable ? 'line-through' : 'none',
                  // Past dates fade back; unavailable stays clearly legible.
                  opacity: isPast ? 0.5 : 1,
                  fontWeight: selected ? 700 : 400,
                  '&:hover': {
                    bgcolor: isPast
                      ? 'transparent'
                      : isUnavailable
                        ? palette.unavailBg
                        : selected
                          ? 'brand.gold'
                          : palette.hover,
                  },
                }}
              >
                {day.getDate()}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
      {Array.from({length: months}).map((_, i) =>
        renderMonth(new Date(cursor.getFullYear(), cursor.getMonth() + i, 1), i),
      )}
    </Box>
  );
}

// Shared helpers used by the detail + checkout flows.
export const daysBetween = (range: DateRange | undefined): number => {
  if (!range?.from || !range?.to) return 0;
  return Math.max(1, Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1);
};

export interface BlockedRange {
  from: Date;
  to: Date;
  reason: 'rented' | 'maintenance';
}

// Deterministic blocked windows from an id + availability (mirrors the design
// source). Lets the calendar reflect rented/maintenance periods without a backend.
export const buildBlockedRanges = (id: string, availability: string): BlockedRange[] => {
  const today = startOfDay(new Date());
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const ranges: BlockedRange[] = [];
  if (availability === 'Rented') {
    const a = new Date(today);
    a.setDate(today.getDate() + (seed % 4));
    const b = new Date(a);
    b.setDate(a.getDate() + 10 + (seed % 5));
    ranges.push({from: a, to: b, reason: 'rented'});
  }
  const c = new Date(today);
  c.setDate(today.getDate() + 22 + (seed % 6));
  const d = new Date(c);
  d.setDate(c.getDate() + 4 + (seed % 3));
  ranges.push({from: c, to: d, reason: 'rented'});
  const m = new Date(today);
  m.setDate(today.getDate() + 14 + (seed % 5));
  const m2 = new Date(m);
  m2.setDate(m.getDate() + 2);
  ranges.push({from: m, to: m2, reason: 'maintenance'});
  return ranges;
};

export const rangeOverlapsBlocked = (
  range: DateRange | undefined,
  blocked: {from: Date; to: Date}[],
): boolean => {
  if (!range?.from || !range?.to) return false;
  return blocked.some((b) => range.from! <= b.to && range.to! >= b.from);
};

export const isDayBlocked = (day: Date, blocked: {from: Date; to: Date}[]): boolean =>
  blocked.some((b) => day >= startOfDay(b.from) && day <= startOfDay(b.to));
