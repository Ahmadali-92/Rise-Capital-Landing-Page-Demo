'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight, LogIn, MapPin, Search, SearchX, ShoppingCart} from 'lucide-react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

import PremiumFooter from '@/shared/components/landing/PremiumFooter';
import SkeletonImage from '@/shared/components/common/SkeletonImage';
import ThemeToggle from '@/shared/components/common/ThemeToggle';
import {CHECKOUT_ROUTE, EQUIPMENT_ROUTES, ROOT_ROUTE} from '@/shared/constants/paths';
import {useCart} from '@/shared/hooks/useCart';
import {CATALOG} from '@/shared/data/catalog';
import type {Equipment} from '@/shared/types/rental';

const DISPLAY = 'var(--font-rc-display)';
const BODY = 'var(--font-rc-body)';
const MONO = 'var(--font-rc-mono)';
const GOLD = '#D9A428';
const INK = '#0B0B0C';
const HEADER_H = 75; // consistent header height across every screen

// Subtle film-grain texture for the dark hero band.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

const rise = (delayMs: number) => ({
  opacity: 0,
  transform: 'translateY(18px)',
  animation: `rcRise 720ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms forwards`,
  '@keyframes rcRise': {to: {opacity: 1, transform: 'translateY(0)'}},
  '@media (prefers-reduced-motion: reduce)': {
    opacity: 1,
    transform: 'none',
    animation: 'none',
  },
});

export default function PremiumLanding() {
  // Frontend-only demo — hardcoded catalog, no API.
  const equipment = CATALOG;
  const ready = true;
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  // Live cart count for the header badge (sessionStorage-backed demo cart).
  const {items: cartItems, hydrated: cartHydrated} = useCart();
  const cartCount = cartHydrated ? cartItems.length : 0;

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(equipment.map((e) => e.category)))],
    [equipment]
  );

  const filtered = useMemo(
    () =>
      equipment.filter((e) => {
        if (activeCat !== 'All' && e.category !== activeCat) return false;
        if (
          query.trim() &&
          !`${e.name} ${e.category} ${e.depot}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [equipment, activeCat, query]
  );

  // Diagonal gold bloom behind the dark hero band.
  const heroGlow = (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: `radial-gradient(38% 130% at 20% 42%, ${GOLD}22 0%, transparent 70%), radial-gradient(44% 140% at 72% 60%, ${GOLD}24 0%, ${GOLD}10 42%, transparent 74%)`,
      }}
    />
  );

  // Moving gold glow that travels down through the fleet/content section.
  const fleetGlow = (
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
          width: {xs: 380, md: 560},
          height: {xs: 380, md: 560},
          borderRadius: '50%',
          top: '1%',
          left: '6%',
          background: `radial-gradient(circle, ${GOLD}26 0%, transparent 66%)`,
          filter: 'blur(90px)',
          willChange: 'transform',
          animation: 'rcFleetA 26s ease-in-out infinite',
          '@keyframes rcFleetA': {
            '0%,100%': {transform: 'translate3d(0,0,0) scale(1)'},
            '35%': {transform: 'translate3d(45%,65%,0) scale(1.16)'},
            '70%': {transform: 'translate3d(80%,150%,0) scale(0.95)'},
          },
          '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: {xs: 340, md: 520},
          height: {xs: 340, md: 520},
          borderRadius: '50%',
          top: '38%',
          right: '4%',
          background: `radial-gradient(circle, ${GOLD}22 0%, transparent 66%)`,
          filter: 'blur(100px)',
          willChange: 'transform',
          animation: 'rcFleetB 32s ease-in-out infinite',
          '@keyframes rcFleetB': {
            '0%,100%': {transform: 'translate3d(0,0,0) scale(1)'},
            '40%': {transform: 'translate3d(-45%,55%,0) scale(1.12)'},
            '75%': {transform: 'translate3d(-25%,-35%,0) scale(0.94)'},
          },
          '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
        }}
      />
      {/* static glow near the bottom — no animation, cheap on the GPU */}
      <Box
        sx={{
          position: 'absolute',
          width: {xs: 360, md: 540},
          height: {xs: 360, md: 540},
          borderRadius: '50%',
          bottom: '3%',
          left: '32%',
          background: `radial-gradient(circle, ${GOLD}24 0%, transparent 66%)`,
          filter: 'blur(96px)',
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FBFAF7',
        fontFamily: BODY,
        'html.dark &': {bgcolor: '#0E0E0F'},
      }}
    >
      {/* ── HEADER — full-width, sticky ───────────────────────────────── */}
      <Box
        component="header"
        data-cursor-hide
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: {xs: 2.5, md: 5, xl: 6},
          height: HEADER_H,
          minHeight: HEADER_H,
          flexShrink: 0,
          borderBottom: 1,
          borderColor: 'rgba(0,0,0,0.06)',
          bgcolor: 'rgba(251,250,247,0.85)',
          backdropFilter: 'blur(14px)',
          'html.dark &': {
            bgcolor: 'rgba(14,14,15,0.85)',
            borderColor: 'rgba(255,255,255,0.08)',
          },
        }}
      >
        {/* brand — clickable, returns to the landing page */}
        <Box
          component={Link}
          href={ROOT_ROUTE}
          aria-label="Rise Capital — home"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Rise Capital"
            sx={{height: 36, width: 36, objectFit: 'contain'}}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: '-0.01em',
                lineHeight: 1,
                color: 'text.primary',
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
                color: 'text.secondary',
                mt: 0.4,
              }}
            >
              EQUIPMENT RENTAL
            </Typography>
          </Box>
        </Box>

        {/* actions — always pinned right */}
        <Box
          sx={{
            ml: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: {xs: 1, md: 1.75},
            flexShrink: 0,
          }}
        >
          {/* cart — shows a live count once something is reserved */}
          {cartCount > 0 && (
            <Box
              component={Link}
              href={CHECKOUT_ROUTE}
              aria-label={`Cart — ${cartCount} item${cartCount === 1 ? '' : 's'}`}
              sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: 1.5,
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 160ms ease',
                '&:hover': {borderColor: GOLD, color: GOLD},
                '&:focus-visible': {outline: `2px solid ${GOLD}`, outlineOffset: 2},
              }}
            >
              <ShoppingCart size={18} />
              <Box
                sx={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  minWidth: 18,
                  height: 18,
                  px: 0.5,
                  borderRadius: '9px',
                  bgcolor: GOLD,
                  color: INK,
                  fontFamily: MONO,
                  fontSize: 10.5,
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {cartCount}
              </Box>
            </Box>
          )}

          <Box
            component="button"
            type="button"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              cursor: 'pointer',
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: {xs: 12.5, md: 13},
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              px: {xs: 2.25, md: 3},
              py: {xs: 1.1, md: 1.3},
              borderRadius: 1.5,
              bgcolor: GOLD,
              color: INK,
              textDecoration: 'none',
              border: `1px solid ${GOLD}`,
              transition: 'all 160ms ease',
              // subtle darker-gold on hover (a touch of black), not a full flip
              '&:hover': {
                bgcolor: '#bd8a1e',
                color: INK,
                borderColor: '#bd8a1e',
              },
              '&:focus-visible': {outline: `2px solid ${INK}`, outlineOffset: 2},
            }}
          >
            <LogIn size={15} /> Sign in
          </Box>
          <ThemeToggle sx={{color: 'text.primary'}} />
        </Box>
      </Box>

      {/* ── HERO BAND — full-width dark hero (was the left rail) ───────── */}
      <Box
        component="section"
        data-cursor-dark
        sx={{
          position: 'relative',
          flexShrink: 0,
          bgcolor: INK,
          color: '#fff',
          overflow: 'hidden',
          px: {xs: 3, md: 5, xl: 6},
          py: {xs: 6, md: 8, lg: 9},
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: GRAIN,
            opacity: 0.06,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)`,
          },
        }}
      >
        {heroGlow}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: {xs: 'column', lg: 'row'},
            alignItems: {lg: 'flex-end'},
            gap: {xs: 5, lg: 8},
          }}
        >
          {/* headline column */}
          <Box sx={{flex: {lg: '1 1 56%'}, minWidth: 0}}>
            <Typography
              sx={{
                ...rise(160),
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: {xs: 46, md: 62, lg: 68, xl: 76},
                lineHeight: 0.97,
                letterSpacing: '-0.04em',
                mt: 2,
              }}
            >
              Heavy machinery,
              <br />
              <Box component="span" sx={{color: GOLD}}>
                on demand.
              </Box>
            </Typography>
            <Typography
              sx={{
                ...rise(240),
                mt: 2.5,
                fontSize: {xs: 15, md: 16},
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.62)',
                maxWidth: 520,
              }}
            >
              Drilling rigs, workover units and field machinery — live
              inventory, transparent day rates, crew &amp; operations included.
            </Typography>
          </Box>

          {/* controls column — search, filters, stats */}
          <Box
            sx={{
              ...rise(320),
              flex: {lg: '1 1 44%'},
              width: '100%',
              maxWidth: {lg: 520},
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {/* search */}
            <Box
              data-cursor-hide
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                border: 1,
                borderColor: 'rgba(255,255,255,0.16)',
                borderRadius: 2,
                px: 2,
                py: 1.5,
                transition: 'border-color 160ms ease',
                '&:focus-within': {borderColor: GOLD},
              }}
            >
              <Search size={16} color={GOLD} />
              <InputBase
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the fleet…"
                inputProps={{'aria-label': 'Search the fleet'}}
                sx={{
                  flex: 1,
                  color: '#fff',
                  fontFamily: BODY,
                  fontSize: 14,
                  '& input::placeholder': {
                    color: 'rgba(255,255,255,0.4)',
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* category filter */}
            <Box>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: 11.5,
                  letterSpacing: '0.24em',
                  color: 'rgba(255,255,255,0.5)',
                  mb: 1.5,
                }}
              >
                FILTER BY CATEGORY
              </Typography>
              <Box
                data-cursor-hide
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                {categories.map((cat) => {
                  const on = activeCat === cat;
                  return (
                    <Box
                      key={cat}
                      component="button"
                      onClick={() => setActiveCat(cat)}
                      aria-pressed={on}
                      sx={{
                        cursor: 'pointer',
                        border: 1,
                        borderColor: on ? GOLD : 'rgba(255,255,255,0.16)',
                        bgcolor: on ? GOLD : 'transparent',
                        color: on ? INK : 'rgba(255,255,255,0.75)',
                        fontFamily: BODY,
                        fontWeight: on ? 700 : 500,
                        fontSize: 12.5,
                        px: 1.75,
                        py: 0.85,
                        borderRadius: 999,
                        transition: 'all 160ms ease',
                        '&:hover': {
                          borderColor: GOLD,
                          color: on ? INK : '#fff',
                        },
                      }}
                    >
                      {cat}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* trust strip */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                width: '100%',
                pt: 0.5,
              }}
            >
              {[
                {n: `${ready ? equipment.length : '—'}`, l: 'Units in fleet'},
                {n: 'TX', l: 'South Texas'},
                {n: '24/7', l: 'Field support'},
              ].map((s) => (
                <Box key={s.l} sx={{textAlign: 'center'}}>
                  <Typography
                    sx={{
                      fontFamily: DISPLAY,
                      fontWeight: 800,
                      fontSize: 24,
                      color: GOLD,
                      lineHeight: 1,
                    }}
                  >
                    {s.n}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      color: 'rgba(255,255,255,0.55)',
                      mt: 0.75,
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.l}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── FLEET header + grid (grows so footer sits at the bottom) ───── */}
      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          flexShrink: 0,
          px: {xs: 3, md: 5, xl: 6},
          py: {xs: 4, md: 6},
        }}
      >
        {fleetGlow}
        <Box sx={{position: 'relative', zIndex: 1}}>
          <Box
            sx={{
              mb: {xs: 4, md: 5},
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: 13,
                  letterSpacing: '0.2em',
                  color: 'text.secondary',
                }}
              >
                {ready
                  ? `FLEET — ${filtered.length} UNIT${filtered.length === 1 ? '' : 'S'}`
                  : 'FLEET — LOADING…'}
              </Typography>
              <Typography
                sx={{
                  fontFamily: DISPLAY,
                  fontWeight: 900,
                  fontSize: {xs: 40, md: 52},
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  mt: 1,
                  color: 'text.primary',
                }}
              >
                {activeCat === 'All' ? 'Available now' : activeCat}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              },
              columnGap: {xs: 3, md: 3.5},
              rowGap: {xs: 4, md: 5},
            }}
          >
            {ready
              ? filtered.map((item, i) => (
                  <FleetCard key={item.id} item={item} index={i} />
                ))
              : Array.from({length: 6}).map((_, i) => <CardSkeleton key={i} />)}
          </Box>

          {ready && filtered.length === 0 && (
            <Box
              sx={{
                ...rise(120),
                textAlign: 'center',
                py: {xs: 8, md: 11},
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  color: GOLD,
                  bgcolor: 'rgba(217,164,40,0.1)',
                  border: `1px solid ${GOLD}44`,
                }}
              >
                <SearchX size={32} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: DISPLAY,
                    fontWeight: 800,
                    fontSize: {xs: 22, md: 27},
                    letterSpacing: '-0.02em',
                    color: 'text.primary',
                  }}
                >
                  No units found
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    color: 'text.secondary',
                    maxWidth: 400,
                    mx: 'auto',
                  }}
                >
                  {query.trim() ? (
                    <>
                      Nothing matches “
                      <Box
                        component="span"
                        sx={{color: 'text.primary', fontWeight: 600}}
                      >
                        {query}
                      </Box>
                      ”. Try a different search or category.
                    </>
                  ) : (
                    'Try selecting a different category.'
                  )}
                </Typography>
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => {
                  setActiveCat('All');
                  setQuery('');
                }}
                sx={{
                  mt: 1,
                  cursor: 'pointer',
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  px: 3,
                  py: 1.2,
                  borderRadius: 1.5,
                  bgcolor: GOLD,
                  color: INK,
                  border: `1px solid ${GOLD}`,
                  transition: 'all 160ms ease',
                  '&:hover': {bgcolor: '#bd8a1e', borderColor: '#bd8a1e'},
                }}
              >
                Clear filters
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── FOOTER (dark band, bookends the page) ─────────────────────── */}
      <Box sx={{flexShrink: 0}}>
        <PremiumFooter />
      </Box>
    </Box>
  );
}

// ── Premium fleet card ──────────────────────────────────────────────────
function FleetCard({item, index}: {item: Equipment; index: number}) {
  const available = item.availability === 'Available';
  return (
    <Box
      component={Link}
      href={EQUIPMENT_ROUTES.detail({id: item.id})}
      sx={{
        ...rise(120 + index * 70),
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        '&:hover .rc-img': {transform: 'scale(1.06)'},
        '&:hover .rc-frame': {
          borderColor: GOLD,
        },
        '&:hover .rc-cta': {gap: '10px', color: GOLD},
        '&:hover .rc-arrow': {transform: 'translate(3px,-3px)'},
      }}
    >
      <Box
        className="rc-frame"
        data-cursor-hide
        sx={{
          position: 'relative',
          aspectRatio: '4 / 3',
          borderRadius: '15px',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
          bgcolor: 'rgba(0,0,0,0.03)',
          transition: 'border-color 300ms ease',
          'html.dark &': {borderColor: 'rgba(255,255,255,0.1)'},
        }}
      >
        <SkeletonImage
          className="rc-img"
          src={item.image}
          alt={item.name}
          loading="lazy"
          skeletonZIndex={3}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transition:
              'transform 620ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease',
          }}
        />
        {/* bottom gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.42), transparent 42%)',
          }}
        />
        {/* availability */}
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.1em',
            color: '#fff',
            textTransform: 'uppercase',
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: available ? '#34D399' : GOLD,
            }}
          />
          {item.availability}
        </Box>
        {/* price tag */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            display: 'flex',
            alignItems: 'baseline',
            gap: 0.4,
          }}
        >
          <Typography
            sx={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 22,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            ${item.dailyRate.toLocaleString()}
          </Typography>
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: 11,
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            /day
          </Typography>
        </Box>
      </Box>

      {/* meta */}
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: 11.5,
          letterSpacing: '0.22em',
          // darker gold on the light background for WCAG-passing contrast;
          // the true brand gold works fine on dark
          color: '#A07820',
          'html.dark &': {color: GOLD},
          textTransform: 'uppercase',
          mt: 2,
        }}
      >
        {item.category}
      </Typography>
      <Typography
        sx={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: '-0.02em',
          mt: 0.5,
          color: 'text.primary',
          lineHeight: 1.1,
        }}
      >
        {item.name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.6,
          mt: 0.75,
          color: 'text.secondary',
          fontSize: 13,
        }}
      >
        <MapPin size={13} />
        {item.depot}
      </Box>
      <Box
        className="rc-cta"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          mt: 1.5,
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'text.primary',
          transition: 'gap 220ms ease, color 220ms ease',
        }}
      >
        More Info
        <ArrowUpRight
          size={16}
          className="rc-arrow"
          style={{transition: 'transform 220ms ease'}}
        />
      </Box>
    </Box>
  );
}

function CardSkeleton() {
  return (
    <Box>
      <Box
        sx={{
          aspectRatio: '4 / 3',
          borderRadius: 3,
          bgcolor: 'rgba(0,0,0,0.06)',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            transform: 'translateX(-100%)',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            animation: 'rcShimmer 1.2s ease-in-out infinite',
          },
          '@keyframes rcShimmer': {to: {transform: 'translateX(100%)'}},
        }}
      />
      <Box
        sx={{
          height: 10,
          width: '35%',
          bgcolor: 'rgba(0,0,0,0.07)',
          mt: 2,
          borderRadius: 1,
        }}
      />
      <Box
        sx={{
          height: 22,
          width: '65%',
          bgcolor: 'rgba(0,0,0,0.07)',
          mt: 1.5,
          borderRadius: 1,
        }}
      />
      <Box
        sx={{
          height: 14,
          width: '45%',
          bgcolor: 'rgba(0,0,0,0.07)',
          mt: 1,
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
