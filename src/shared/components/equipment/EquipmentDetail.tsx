'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Wrench,
  X,
} from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {useColorScheme} from '@mui/material/styles';

import PremiumFooter from '@/shared/components/landing/PremiumFooter';
import SkeletonImage from '@/shared/components/common/SkeletonImage';
import ThemeToggle from '@/shared/components/common/ThemeToggle';
import {ROOT_ROUTE} from '@/shared/constants/paths';
import {getEquipmentById} from '@/shared/data/catalog';

import RangeCalendar, {
  daysBetween,
  DateRange,
  isDayBlocked,
  rangeOverlapsBlocked,
} from './RangeCalendar';
import EquipmentImageViewer from './EquipmentImageViewer';

const DISPLAY = 'var(--font-rc-display)';
const BODY = 'var(--font-rc-body)';
const MONO = 'var(--font-rc-mono)';
const GOLD = '#D9A428';
const INK = '#0B0B0C';

type DetailColors = {
  bg: string;
  panel: string;
  text: string;
  text2: string;
  text3: string;
  border: string;
  grid: string;
  amber: string;
  amberDk: string;
  amberBg: string;
  amberText: string;
  danger: string;
  dangerBg: string;
  success: string;
  successBg: string;
  skuBg: string;
};

const createDetailColors = (isDark: boolean): DetailColors => ({
  bg: isDark ? '#0E0E0F' : '#FBFAF7',
  panel: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
  text: isDark ? '#F5F5F5' : '#141210',
  text2: isDark ? 'rgba(255,255,255,0.72)' : '#6B6560',
  text3: isDark ? 'rgba(255,255,255,0.5)' : '#A8A39C',
  border: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
  grid: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.04)',
  amber: GOLD,
  amberDk: isDark ? '#E0B84A' : '#A07820',
  amberBg: isDark ? 'rgba(217,164,40,0.12)' : '#FBF3DE',
  amberText: isDark ? '#E0B84A' : '#7A5A10',
  danger: isDark ? '#F28B82' : '#C0392B',
  dangerBg: isDark ? 'rgba(192,57,43,0.18)' : 'rgba(192,57,43,0.08)',
  success: isDark ? '#34D399' : '#2E7D57',
  successBg: isDark ? 'rgba(46,125,87,0.18)' : '#E8F5EE',
  skuBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)',
});

const rise = (delayMs: number) => ({
  opacity: 0,
  transform: 'translateY(16px)',
  animation: `rcDetailRise 680ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms forwards`,
  '@keyframes rcDetailRise': {to: {opacity: 1, transform: 'translateY(0)'}},
  '@media (prefers-reduced-motion: reduce)': {
    opacity: 1,
    transform: 'none',
    animation: 'none',
  },
});

const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const CART_STORAGE_KEY = 'por_cart_items';

function readStoredRange(assetId: string): DateRange | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    const items = raw
      ? (JSON.parse(raw) as {id?: string; from?: string; to?: string}[])
      : [];
    const match = Array.isArray(items)
      ? [...items].reverse().find((item) => item.id === assetId)
      : undefined;
    return match?.from && match?.to
      ? {from: new Date(match.from), to: new Date(match.to)}
      : undefined;
  } catch {
    return undefined;
  }
}

const goldBtn = {
  fontFamily: BODY,
  fontWeight: 700,
  letterSpacing: '0.03em',
  bgcolor: GOLD,
  color: '#0B0B0C',
  border: `1px solid ${GOLD}`,
  borderRadius: 1.5,
  boxShadow: 'none',
  '&:hover': {bgcolor: 'transparent', color: GOLD, boxShadow: 'none'},
};

function NotFound({colors}: {colors: DetailColors}) {
  return (
    <Box
      sx={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        bgcolor: colors.bg,
        p: 3,
        textAlign: 'center',
        fontFamily: BODY,
      }}
    >
      <Box>
        <Typography sx={{fontSize: 14, color: colors.text2}}>
          We couldn&apos;t find that asset.
        </Typography>
        <Button
          component={Link}
          href={ROOT_ROUTE}
          sx={{mt: 2, ...goldBtn, textTransform: 'none'}}
        >
          Back to catalog
        </Button>
      </Box>
    </Box>
  );
}

function Legend({color, label}: {color: string; label: string}) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.85,
        px: 1.4,
        py: 0.7,
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.16)',
        bgcolor: 'rgba(255,255,255,0.05)',
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.85)',
        whiteSpace: 'nowrap',
      }}
    >
      <Box sx={{height: 9, width: 9, borderRadius: '50%', bgcolor: color}} />
      {label}
    </Box>
  );
}

function availColor(status: string, colors: DetailColors) {
  if (status === 'Available') return {bg: colors.successBg, fg: colors.success};
  if (status === 'Rented') return {bg: colors.dangerBg, fg: colors.danger};
  return {bg: colors.amberBg, fg: colors.amber};
}

export default function EquipmentDetail({id}: {id: string}) {
  const {mode} = useColorScheme();
  // Frontend-only demo — item comes from the hardcoded catalog, no API.
  const item = getEquipmentById(id);
  const isDark = mode === 'dark';
  const C = useMemo(() => createDetailColors(isDark), [isDark]);

  const [range, setRange] = useState<DateRange | undefined>(() =>
    readStoredRange(id)
  );
  const [activeImg, setActiveImg] = useState<string>('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [thumbStart, setThumbStart] = useState(0); // first visible thumbnail

  const blocked = useMemo(
    () =>
      item?.unavailableRanges?.map((r) => ({
        from: new Date(r.from),
        to: new Date(r.to),
        reason: r.reason,
      })) ?? [],
    [item]
  );

  if (!item || item.id !== id) return <NotFound colors={C} />;

  const itemImages =
    item.images && item.images.length > 0 ? item.images : [item.image];
  const displayImg =
    activeImg && itemImages.includes(activeImg) ? activeImg : itemImages[0];
  const today = startOfDay();
  const days = daysBetween(range);
  const subtotal = days * item.dailyRate;
  const total = subtotal;
  const conflict = rangeOverlapsBlocked(range, blocked);
  const ac = availColor(item.availability, C);
  const canContinue = Boolean(range?.from && range?.to && !conflict);

  // Frontend-only demo — no checkout/backend. The button stays disabled until a
  // valid range is picked; clicking is a no-op (design preserved).
  const handleReserve = () => {};

  // Description text + fixed-length truncation (clean cut on a word boundary,
  // then "Read More"). No line-clamp — avoids mid-letter cuts.
  const descText =
    item.description ??
    `The ${item.name} is a workhorse ${item.category.toLowerCase()} asset stationed at ${item.depot}. Trusted on production pads across South Texas, it pairs reliable uptime (${item.utilization}% utilization YTD) with operator-friendly controls — ideal for both short pilot runs and multi-week field campaigns.`;
  const DESC_LIMIT = 170; // characters shown before truncating
  const descIsLong = descText.length > DESC_LIMIT;
  const descPreview = descIsLong
    ? `${descText.slice(0, DESC_LIMIT).replace(/\s+\S*$/, '')}…`
    : descText;

  // quick-facts data strip (editorial "spec sheet" row) — rates, status + asset specs
  const facts = [
    {
      label: 'Day rate',
      value: `$${item.dailyRate.toLocaleString()}`,
      gold: true,
    },
    {
      label: 'Week rate',
      value: `$${item.weeklyRate.toLocaleString()}`,
      gold: false,
    },
    {label: 'Status', value: item.availability, gold: false},
    ...item.specs.map((s) => ({label: s.label, value: s.value, gold: false})),
  ];

  return (
    <Box sx={{bgcolor: C.bg, color: C.text, fontFamily: BODY}}>
      {/* header + hero nearly fill the viewport, leaving a small strip of the
          footer peeking at the bottom (a "there's more below" cue) */}
      <Box
        sx={{
          minHeight: {lg: 'calc(100dvh - 56px)'},
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      {/* ── TOP BAR (sticky, glassy — matches the landing header) ─────── */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          px: {xs: 2.5, md: 5, xl: 6},
          height: 75,
          bgcolor: isDark ? 'rgba(14,14,15,0.85)' : 'rgba(251,250,247,0.85)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* brand logo → landing page */}
        <Box
          component={Link}
          href={ROOT_ROUTE}
          aria-label="Rise Capital — back to catalog"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Rise Capital"
            sx={{height: 38, width: 38, objectFit: 'contain'}}
          />
          <Box>
            <Typography
              className="rc-wordmark"
              sx={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: '-0.01em',
                lineHeight: 1,
                color: C.text,
                transition: 'color 160ms ease',
              }}
            >
              RISE
              <Box component="span" sx={{color: GOLD}}>
                .
              </Box>
              CAPITAL
            </Typography>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: '0.26em',
                color: C.text3,
                mt: 0.5,
              }}
            >
              EQUIPMENT RENTAL
            </Typography>
          </Box>
        </Box>

        <ThemeToggle sx={{color: C.text2}} />
      </Box>

      {/* ── HERO (blueprint) ────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          // Fill the space below the header. Content is TOP-aligned (not
          // centred) so it grows downward when Read More expands — the image
          // never shifts.
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: '34px 34px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* soft moving gold glow behind the hero (light, ambient) */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: {xs: 440, md: 700},
              height: {xs: 440, md: 700},
              borderRadius: '50%',
              top: '-12%',
              right: '2%',
              background: `radial-gradient(circle, ${GOLD}2e 0%, ${GOLD}12 36%, transparent 66%)`,
              filter: 'blur(90px)',
              willChange: 'transform',
              animation: 'rcHeroGlowA 24s ease-in-out infinite',
              '@keyframes rcHeroGlowA': {
                '0%,100%': {transform: 'translate3d(0,0,0) scale(1)'},
                '35%': {transform: 'translate3d(-22%,28%,0) scale(1.16)'},
                '68%': {transform: 'translate3d(10%,14%,0) scale(0.92)'},
              },
              '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: {xs: 360, md: 580},
              height: {xs: 360, md: 580},
              borderRadius: '50%',
              bottom: '-20%',
              left: '20%',
              background: `radial-gradient(circle, ${GOLD}24 0%, transparent 64%)`,
              filter: 'blur(100px)',
              willChange: 'transform',
              animation: 'rcHeroGlowB 31s ease-in-out infinite',
              '@keyframes rcHeroGlowB': {
                '0%,100%': {transform: 'translate3d(0,0,0) scale(1)'},
                '45%': {transform: 'translate3d(26%,-24%,0) scale(1.1)'},
              },
              '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
            }}
          />
        </Box>

        {/* back to catalog — flush left, directly under the header logo
            (full-width row, same px as the header, NOT the centred 1400 grid) */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            px: {xs: 2.5, md: 5, xl: 6},
            pt: {xs: 2.5, md: 3.5},
            width: '100%',
          }}
        >
          {/* quiet editorial text link — no pill; on hover the arrow nudges
              left and a thin gold underline grows in from the left */}
          <Box
            component={Link}
            href={ROOT_ROUTE}
            sx={{
              ...rise(30),
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              pb: 0.5,
              fontFamily: MONO,
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              color: C.text2,
              transition: 'color 160ms ease',
              '& .rc-back-arrow': {transition: 'transform 200ms ease'},
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: '1px',
                width: 0,
                bgcolor: GOLD,
                transition: 'width 240ms cubic-bezier(0.22,1,0.36,1)',
              },
              '&:hover': {color: C.amberDk},
              '&:hover .rc-back-arrow': {transform: 'translateX(-4px)'},
              '&:hover::after': {width: '100%'},
            }}
          >
            <ArrowLeft size={15} className="rc-back-arrow" />
            Back to fleet
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1400,
            mx: 'auto',
            px: {xs: 2.5, md: 5, xl: 6},
            pt: {xs: 2.5, md: 3.5},
            pb: {xs: 5, md: 8},
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', lg: '1.12fr 1fr'},
            gap: {xs: 3.5, lg: 6},
            // Top-align the two columns to each other (image tracks the editorial
            // top, doesn't recentre when Read More expands/collapses).
            alignItems: 'start',
          }}
        >
          {/* image plate — minWidth 0 so fixed-width children (thumb strip)
              can never stretch the grid past the viewport on mobile */}
          <Box sx={{...rise(60), minWidth: 0}}>
            <EquipmentImageViewer
              src={displayImg}
              alt={item.name}
              containerSx={{
                width: '100%',
                aspectRatio: {xs: '4/3', md: '16/11'},
                borderRadius: 3,
                border: `1px solid ${C.border}`,
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                boxShadow: isDark
                  ? 'none'
                  : '0 30px 60px -34px rgba(0,0,0,0.35)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  bgcolor: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontFamily: MONO,
                  fontSize: 10.5,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: ac.fg,
                  }}
                />
                {item.availability}
              </Box>
            </EquipmentImageViewer>

            {/* thumbnail gallery — a fixed window of thumbs with prev/next
                arrows, so the row width never grows with the image count */}
            {item.images &&
              item.images.length > 1 &&
              (() => {
                const imgs = item.images;
                const VISIBLE = 6;
                const THUMB_W = 88;
                const GAP = 8;
                const STEP = THUMB_W + GAP;
                const paged = imgs.length > VISIBLE;
                const maxStart = Math.max(0, imgs.length - VISIBLE);
                const start = Math.min(thumbStart, maxStart);
                const viewportW = VISIBLE * THUMB_W + (VISIBLE - 1) * GAP;

                const arrowSx = {
                  // arrows are desktop-only; mobile swipes the strip natively
                  display: {xs: 'none', md: 'inline-flex'},
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: GOLD,
                  color: INK,
                  '&:hover': {bgcolor: '#c6941f'},
                  '&.Mui-disabled': {bgcolor: C.border, color: C.text3},
                };

                return (
                  <Box
                    sx={{
                      ...rise(180),
                      mt: 1.5,
                      width: '100%',
                      minWidth: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    {paged && (
                      <IconButton
                        aria-label="Previous images"
                        disabled={start === 0}
                        onClick={() =>
                          setThumbStart((s) => Math.max(0, s - 1))
                        }
                        sx={arrowSx}
                      >
                        <ChevronLeft size={18} />
                      </IconButton>
                    )}

                    <Box
                      sx={{
                        // mobile: full-width, natively swipeable (no fixed
                        // 6-thumb window — that forced the page wider than
                        // the viewport); desktop: fixed window + arrows
                        overflowX: {xs: 'auto', md: 'hidden'},
                        overflowY: 'hidden',
                        width: {xs: '100%', md: paged ? viewportW : 'auto'},
                        minWidth: 0,
                        maxWidth: '100%',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {display: 'none'},
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: `${GAP}px`,
                          width: 'max-content',
                          transform: {
                            xs: 'none',
                            md: `translateX(-${start * STEP}px)`,
                          },
                          transition:
                            'transform 420ms cubic-bezier(0.22,1,0.36,1)',
                          '@media (prefers-reduced-motion: reduce)': {
                            transition: 'none',
                          },
                        }}
                      >
                        {imgs.map((img, idx) => {
                          const active = displayImg === img;
                          return (
                            <Box
                              key={img}
                              component="button"
                              type="button"
                              onClick={() => setActiveImg(img)}
                              aria-label={`View ${item.name} — photo ${idx + 1} of ${imgs.length}`}
                              aria-pressed={active}
                              sx={{
                                position: 'relative', // anchors the skeleton
                                p: 0,
                                flexShrink: 0,
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                border: `2px solid ${active ? GOLD : C.border}`,
                                opacity: active ? 1 : 0.55,
                                cursor: 'pointer',
                                bgcolor: 'transparent',
                                transition: 'opacity 0.2s, border-color 0.2s',
                                '&:hover': {opacity: 1},
                                '&:focus-visible': {
                                  opacity: 1,
                                  outline: `2px solid ${GOLD}`,
                                  outlineOffset: 2,
                                },
                              }}
                            >
                              <SkeletonImage
                                src={img}
                                alt=""
                                sx={{
                                  display: 'block',
                                  height: 62,
                                  width: THUMB_W - 4, // border eats 2px per side
                                  objectFit: 'cover',
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    {paged && (
                      <IconButton
                        aria-label="Next images"
                        disabled={start >= maxStart}
                        onClick={() =>
                          setThumbStart((s) => Math.min(maxStart, s + 1))
                        }
                        sx={arrowSx}
                      >
                        <ChevronRight size={18} />
                      </IconButton>
                    )}
                  </Box>
                );
              })()}
          </Box>

          {/* editorial info */}
          <Box sx={{minWidth: 0}}>
            <Box
              sx={{
                ...rise(120),
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                fontFamily: MONO,
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: C.amberDk,
              }}
            >
              <Box
                component="span"
                sx={{display: 'inline-flex', alignItems: 'center', gap: 0.6}}
              >
                <Wrench size={13} style={{opacity: 0.85}} /> {item.category}
              </Box>
              <Box component="span" sx={{opacity: 0.45}}>
                ·
              </Box>
              <Box
                component="span"
                sx={{display: 'inline-flex', alignItems: 'center', gap: 0.6}}
              >
                <MapPin size={13} style={{opacity: 0.85}} /> {item.depot}
              </Box>
            </Box>
            <Typography
              sx={{
                ...rise(170),
                mt: 1.5,
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: {xs: 40, md: 54, lg: 62},
                letterSpacing: '-0.045em',
                lineHeight: 0.96,
                color: C.text,
              }}
            >
              {item.name}
            </Typography>

            {/* data strip */}
            <Box
              sx={{
                ...rise(280),
                mt: 3.5,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                border: `1px solid ${C.border}`,
                borderRadius: 2.5,
                overflow: 'hidden',
                bgcolor: C.panel,
              }}
            >
              {facts.map((f, i) => (
                <Box
                  key={f.label}
                  sx={{
                    px: {xs: 2, md: 2.5},
                    py: {xs: 1.75, md: 2},
                    borderRight: i % 2 === 0 ? `1px solid ${C.border}` : 'none',
                    borderBottom:
                      i < facts.length - 2 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: C.text3,
                    }}
                  >
                    {f.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: DISPLAY,
                      fontSize: {xs: 22, md: 26},
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: f.gold ? GOLD : C.text,
                      mt: 0.4,
                      lineHeight: 1,
                    }}
                  >
                    {f.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* chips */}
            <Box
              sx={{
                ...rise(330),
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mt: 2.5,
              }}
            >
              {[
                'High uptime',
                'Operator-ready',
                'Multi-week ready',
                'Field-tested',
              ].map((t) => (
                <Box
                  key={t}
                  sx={{
                    fontFamily: MONO,
                    fontSize: 10.5,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    px: 1.5,
                    py: 0.7,
                    borderRadius: '20px',
                    bgcolor: C.amberBg,
                    color: C.amberText,
                    border: `1px solid ${GOLD}80`,
                  }}
                >
                  {t}
                </Box>
              ))}
            </Box>

            {/* description — fixed-length truncation with inline Read More / Less */}
            <Box sx={{...rise(360), mt: 3.5, maxWidth: 560}}>
              <Typography
                sx={{
                  fontSize: {xs: 14.5, md: 15.5},
                  lineHeight: 1.75,
                  color: C.text2,
                }}
              >
                {descExpanded ? descText : descPreview}
                {descIsLong && (
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setDescExpanded((v) => !v)}
                    sx={{
                      display: 'inline',
                      ml: 0.75,
                      p: 0,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: BODY,
                      fontWeight: 700,
                      fontSize: 'inherit',
                      color: C.amberDk,
                      whiteSpace: 'nowrap',
                      '&:hover': {textDecoration: 'underline'},
                    }}
                  >
                    {descExpanded ? 'Read Less' : 'Read More'}
                  </Box>
                )}
              </Typography>
            </Box>

            {/* CTA */}
            <Box
              sx={{
                ...rise(380),
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 3.5,
                flexWrap: 'wrap',
              }}
            >
              <Button
                onClick={() => setBookingOpen(true)}
                size="large"
                endIcon={<ArrowDownRight size={18} />}
                sx={{
                  ...goldBtn,
                  px: 3.5,
                  py: 1.4,
                  fontSize: 15,
                  textTransform: 'none',
                  // hover matches the landing "Sign in": black bg, gold text
                  '&:hover': {
                    bgcolor: '#bd8a1e',
                    color: INK,
                    boxShadow: 'none',
                  },
                }}
              >
                Check availability
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      </Box>

      {/* ── BOOKING MODAL (opens from "Check availability") ──────────── */}
      <Dialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        aria-labelledby="rc-booking-title"
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(6,6,7,0.55)',
            backdropFilter: 'blur(8px)',
          },
          '& .MuiDialog-paper': {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: INK,
            color: '#fff',
            backgroundImage: 'none',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.12)',
            m: {xs: 2, md: 3},
            width: '100%',
            maxHeight: {xs: '92dvh', md: '88dvh'},
          },
        }}
      >
        {/* static gold border highlights — fixed at the top-left and
            bottom-right corners of the frame (no travelling animation) */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            borderRadius: 'inherit',
            overflow: 'hidden',
            pointerEvents: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              transformOrigin: 'center',
              background: `conic-gradient(from 0deg, transparent 0deg 100deg, ${GOLD}22 112deg, ${GOLD} 126deg, #FFF3D2 132deg, ${GOLD} 138deg, ${GOLD}22 152deg, transparent 164deg 280deg, ${GOLD}22 292deg, ${GOLD} 306deg, #FFF3D2 312deg, ${GOLD} 318deg, ${GOLD}22 332deg, transparent 344deg 360deg)`,
            },
            // inner mask — hides the centre, leaving only a thin ring lit
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '2px',
              borderRadius: 'inherit',
              background: INK,
            },
          }}
        />
        {/* close button (top-right) */}
        <IconButton
          onClick={() => setBookingOpen(false)}
          aria-label="Close"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 5,
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.14)',
            bgcolor: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(4px)',
            '&:hover': {color: '#fff', bgcolor: 'rgba(255,255,255,0.1)'},
          }}
        >
          <X size={20} />
        </IconButton>
        {/* animated gold ambient glow — slow drifting light inside the black */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: {xs: 440, md: 700},
              height: {xs: 440, md: 700},
              borderRadius: '50%',
              top: '-22%',
              left: '4%',
              background: `radial-gradient(circle, ${GOLD}3a 0%, ${GOLD}16 34%, transparent 68%)`,
              filter: 'blur(72px)',
              willChange: 'transform',
              animation: 'rcGlowA 20s ease-in-out infinite',
              '@keyframes rcGlowA': {
                '0%,100%': {transform: 'translate3d(0,0,0) scale(1)'},
                '30%': {transform: 'translate3d(30%,36%,0) scale(1.18)'},
                '65%': {transform: 'translate3d(-12%,18%,0) scale(0.92)'},
              },
              '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
            }}
          />
          {/* static bottom glow — keeps the ambient depth without another
              infinite blur animation (cheap on the GPU) */}
          <Box
            sx={{
              position: 'absolute',
              width: {xs: 380, md: 580},
              height: {xs: 380, md: 580},
              borderRadius: '50%',
              bottom: '-28%',
              left: '32%',
              background: `radial-gradient(circle, ${GOLD}2e 0%, transparent 66%)`,
              filter: 'blur(84px)',
            }}
          />
          {/* top-right corner halo */}
          <Box
            sx={{
              position: 'absolute',
              top: '-16%',
              right: '-12%',
              width: {xs: 320, md: 600},
              height: {xs: 320, md: 600},
              borderRadius: '50%',
              background: `radial-gradient(circle, ${GOLD}2b 0%, ${GOLD}12 34%, transparent 64%)`,
              filter: 'blur(84px)',
              willChange: 'opacity, transform',
              animation: 'rcGlowTR 28s ease-in-out infinite',
              '@keyframes rcGlowTR': {
                '0%,100%': {opacity: 0.55, transform: 'scale(1.05)'},
                '50%': {opacity: 0.92, transform: 'scale(0.95)'},
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
                opacity: 0.75,
              },
            }}
          />
        </Box>

        <Box
          data-cursor-dark
          sx={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            px: {xs: 2.5, md: 5},
            py: {xs: 5, md: 6},
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', md: '1.15fr 1fr'},
            gap: {xs: 4, md: 6},
            alignItems: 'start',
          }}
        >
          {/* calendar side */}
          <Box>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.3em',
                color: GOLD,
              }}
            >
              RESERVE
            </Typography>
            <Typography
              id="rc-booking-title"
              sx={{
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: {xs: 30, md: 38},
                letterSpacing: '-0.035em',
                lineHeight: 1.02,
                mt: 1.25,
              }}
            >
              Select your rental dates
            </Typography>

            {/* Always visible — shows the picked dates, or a dash placeholder */}
            <Box sx={{display: 'flex', alignItems: 'center', gap: 3, mt: 3}}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  RENTAL START
                </Typography>
                <Typography
                  sx={{
                    fontFamily: DISPLAY,
                    fontSize: 20,
                    fontWeight: 800,
                    color: range?.from ? GOLD : 'rgba(255,255,255,0.4)',
                    mt: 0.25,
                  }}
                >
                  {range?.from
                    ? range.from.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
                </Typography>
              </Box>
              <ArrowRight size={18} color="rgba(255,255,255,0.35)" />
              <Box>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  RENTAL END
                </Typography>
                <Typography
                  sx={{
                    fontFamily: DISPLAY,
                    fontSize: 20,
                    fontWeight: 800,
                    color: range?.to ? GOLD : 'rgba(255,255,255,0.4)',
                    mt: 0.25,
                  }}
                >
                  {range?.to
                    ? range.to.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{mt: 3, maxWidth: 420}}>
              <RangeCalendar
                value={range}
                onChange={setRange}
                disabled={(day) => day < today}
                unavailable={(day) => isDayBlocked(day, blocked)}
                months={1}
                onDark
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 1.5,
                flexWrap: 'wrap',
                fontFamily: MONO,
                fontSize: 10.5,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <Legend color={GOLD} label="Selected" />
              <Legend color="rgba(242,139,130,0.85)" label="Unavailable" />
              <Legend color="rgba(255,255,255,0.45)" label="Past" />
            </Box>

            {conflict && (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  borderRadius: 2,
                  bgcolor: 'rgba(192,57,43,0.18)',
                  p: 1.5,
                  fontSize: 12.5,
                  color: '#F28B82',
                  maxWidth: 420,
                }}
              >
                <AlertTriangle
                  size={15}
                  style={{marginTop: 2, flexShrink: 0}}
                />
                Your selection overlaps an unavailable window. Pick different
                dates.
              </Box>
            )}
          </Box>

          {/* summary side */}
          <Box>
            <Box
              sx={{
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 3,
                p: {xs: 2.5, md: 3.5},
                bgcolor: 'rgba(255,255,255,0.03)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{display: 'flex', alignItems: 'baseline', gap: '5px'}}>
                  <Typography
                    sx={{
                      fontFamily: DISPLAY,
                      fontSize: 38,
                      fontWeight: 900,
                      letterSpacing: '-0.035em',
                      lineHeight: 1,
                      color: GOLD,
                    }}
                  >
                    ${item.dailyRate.toLocaleString()}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    /day
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: 11.5,
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  ${item.weeklyRate.toLocaleString()} / wk
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 2.5,
                  pt: 2.5,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13.5,
                    color: 'rgba(255,255,255,0.62)',
                  }}
                >
                  <span>
                    ${item.dailyRate.toLocaleString()} × {days || 0} days
                  </span>
                  <Box
                    component="span"
                    sx={{color: '#fff', fontWeight: 600, fontFamily: MONO}}
                  >
                    {days ? `$${subtotal.toLocaleString()}` : '—'}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13.5,
                    color: 'rgba(255,255,255,0.62)',
                  }}
                >
                  <span>Mobilization</span>
                  <Box
                    component="span"
                    sx={{color: '#fff', fontWeight: 600, fontFamily: MONO}}
                  >
                    TBD
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2.5,
                  pt: 2.5,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{fontSize: 14, fontWeight: 600}}>
                  Estimated total
                </Typography>
                <Typography
                  sx={{
                    fontFamily: DISPLAY,
                    fontSize: 30,
                    fontWeight: 900,
                    color: GOLD,
                    letterSpacing: '-0.035em',
                  }}
                >
                  {days ? `$${total.toLocaleString()}` : '—'}
                </Typography>
              </Box>

              <Button
                onClick={handleReserve}
                disabled={!canContinue}
                fullWidth
                size="large"
                sx={{
                  mt: 2.5,
                  py: 1.5,
                  fontSize: 15,
                  ...goldBtn,
                  textTransform: 'none',
                  // subtle darker-gold on hover (not the transparent flip)
                  '&:hover': {
                    bgcolor: '#bd8a1e',
                    color: INK,
                    boxShadow: 'none',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid transparent',
                  },
                }}
              >
                Continue to checkout
              </Button>
              <Typography
                sx={{
                  mt: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  fontSize: 11.5,
                  color: canContinue
                    ? 'rgba(255,255,255,0.55)'
                    : 'rgba(255,255,255,0.72)',
                }}
              >
                {canContinue ? (
                  <>
                    <CheckCircle2 size={12} color="#34D399" /> No charge until
                    contract is signed
                  </>
                ) : (
                  <>
                    <Calendar size={12} color={GOLD} /> Select a start &amp;
                    end date to continue
                  </>
                )}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <ShieldCheck size={14} color="#34D399" /> Crew &amp;
                  operations included
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <Calendar size={14} color={GOLD} /> Daily &amp; weekly billing
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <MapPin size={14} color={GOLD} /> {item.depot}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <PremiumFooter />
    </Box>
  );
}
