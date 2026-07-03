'use client';

// Checkout orchestrator — glassy header, progress stepper, animated step
// transitions and a sticky order-summary rail. Frontend-only click-through.
import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {Check, CheckCircle2, Headset, Lock} from 'lucide-react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import {useColorScheme} from '@mui/material/styles';

import ThemeToggle from '@/shared/components/common/ThemeToggle';
import {ROOT_ROUTE} from '@/shared/constants/paths';
import {getEquipmentById} from '@/shared/data/catalog';
import {daysBetween} from '@/shared/components/equipment/RangeCalendar';
import {useCart} from '@/shared/hooks/useCart';

import {BODY, DISPLAY, GOLD, INK, MONO, TAX_RATE, createRcColors, rise} from './tokens';
import type {AccountState, CheckoutLine, ScheduleState, StepId} from './types';
import CartStep from './CartStep';
import ScheduleStep from './ScheduleStep';
import AccountStep from './AccountStep';
import AgreementStep from './AgreementStep';
import SignatureStep from './SignatureStep';
import ConfirmedStep from './ConfirmedStep';
import OrderSummary from './OrderSummary';

const STEPS: {id: StepId; label: string}[] = [
  {id: 'cart', label: 'Cart'},
  {id: 'schedule', label: 'Logistics'},
  {id: 'agreement', label: 'Agreement'},
  {id: 'sign', label: 'Sign'},
  {id: 'account', label: 'Account'},
];

export default function CheckoutFlow() {
  const {mode} = useColorScheme();
  const isDark = mode === 'dark';
  const C = useMemo(() => createRcColors(isDark), [isDark]);

  const {items, hydrated, setQty, removeItem, clear} = useCart();
  const [step, setStep] = useState<StepId>('cart');
  const [schedule, setSchedule] = useState<ScheduleState>({});
  const [account, setAccount] = useState<AccountState | null>(null);
  // Captured at the signature step (the legal name typed to sign), then reused
  // to pre-fill the final account step so we never ask for the same name twice.
  const [signerName, setSignerName] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  // Cart is cleared on finish; keep the confirmed lines around for the recap.
  const [confirmedLines, setConfirmedLines] = useState<CheckoutLine[]>([]);

  const lines: CheckoutLine[] = useMemo(
    () =>
      items.flatMap((item) => {
        const eq = getEquipmentById(item.id);
        if (!eq) return [];
        const from = new Date(item.from);
        const to = new Date(item.to);
        const days = daysBetween({from, to});
        return [{item, eq, from, to, days, lineTotal: eq.dailyRate * days * item.qty}];
      }),
    [items]
  );

  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  // Each step starts at the top of the page.
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [step]);

  const finish = (/* signatureName */) => {
    setConfirmedLines(lines);
    setBookingRef(
      `RC-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`
    );
    clear();
    setStep('done');
  };

  const done = step === 'done';
  const showSummary = !done && hydrated && lines.length > 0;

  return (
    <Box sx={{bgcolor: C.bg, color: C.text, fontFamily: BODY, minHeight: '100dvh', display: 'flex', flexDirection: 'column'}}>
      {/* ── glassy sticky header (matches landing/detail) ─────────────── */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
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
        <Box
          component={Link}
          href={ROOT_ROUTE}
          aria-label="Rise Capital — back to catalog"
          sx={{display: 'flex', alignItems: 'center', gap: 1.5, color: 'inherit', flexShrink: 0}}
        >
          <Box component="img" src="/logo.png" alt="Rise Capital" sx={{height: 38, width: 38, objectFit: 'contain'}} />
          <Box>
            <Typography sx={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em', lineHeight: 1, color: C.text}}>
              RISE
              <Box component="span" sx={{color: GOLD}}>.</Box>
              CAPITAL
            </Typography>
            <Typography sx={{fontFamily: MONO, fontSize: 9, letterSpacing: '0.26em', color: C.text3, mt: 0.5}}>
              EQUIPMENT RENTAL
            </Typography>
          </Box>
        </Box>

        <Box sx={{display: 'flex', alignItems: 'center', gap: {xs: 1, md: 2}}}>
          <Box
            sx={{
              display: {xs: 'none', sm: 'inline-flex'},
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.65,
              borderRadius: '20px',
              border: `1px solid ${C.border}`,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.text2,
            }}
          >
            <Lock size={11} color={GOLD} /> Secure checkout
          </Box>
          <ThemeToggle sx={{color: C.text2}} />
        </Box>
      </Box>

      {/* ── stepper ───────────────────────────────────────────────────── */}
      {!done && (
        <Box sx={{borderBottom: `1px solid ${C.border}`, bgcolor: C.panel}}>
          <Box sx={{maxWidth: 1200, mx: 'auto', px: {xs: 2.5, md: 5}, py: {xs: 1.75, md: 2.25}}}>
            {/* desktop: full stepper */}
            <Box
              component="ol"
              aria-label="Checkout progress"
              sx={{
                display: {xs: 'none', md: 'flex'},
                alignItems: 'center',
                listStyle: 'none',
                m: 0,
                p: 0,
              }}
            >
              {STEPS.map((s, i) => {
                const isDone = i < stepIndex;
                const isActive = i === stepIndex;
                // Completed steps are clickable to jump back and edit; upcoming
                // steps stay locked so you can't skip ahead.
                const canGoBack = isDone;
                return (
                  <Box
                    key={s.id}
                    component="li"
                    aria-current={isActive ? 'step' : undefined}
                    sx={{display: 'flex', alignItems: 'center', flex: i === STEPS.length - 1 ? '0 0 auto' : 1}}
                  >
                    <Box
                      component={canGoBack ? 'button' : 'div'}
                      type={canGoBack ? 'button' : undefined}
                      onClick={canGoBack ? () => setStep(s.id) : undefined}
                      aria-label={canGoBack ? `Go back to ${s.label}` : undefined}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.1,
                        border: 'none',
                        background: 'none',
                        p: 0,
                        borderRadius: 1,
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: canGoBack ? 'pointer' : 'default',
                        transition: 'opacity 160ms ease',
                        '&:hover': canGoBack ? {opacity: 0.7} : undefined,
                        '&:focus-visible': {outline: `2px solid ${GOLD}`, outlineOffset: 3},
                      }}
                    >
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          fontFamily: MONO,
                          fontSize: 11.5,
                          fontWeight: 700,
                          transition: 'all 240ms ease',
                          ...(isDone
                            ? {bgcolor: GOLD, color: INK}
                            : isActive
                              ? {bgcolor: 'transparent', color: C.amberDk, border: `2px solid ${GOLD}`}
                              : {bgcolor: 'transparent', color: C.text3, border: `1.5px solid ${C.border}`}),
                        }}
                      >
                        {isDone ? <Check size={13} strokeWidth={3} /> : i + 1}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: isActive ? C.text : isDone ? C.amberDk : C.text3,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.label}
                      </Typography>
                    </Box>
                    {i < STEPS.length - 1 && (
                      <Box
                        aria-hidden
                        sx={{
                          flex: 1,
                          height: '1.5px',
                          mx: 2,
                          borderRadius: 999,
                          bgcolor: isDone ? GOLD : C.border,
                          transition: 'background-color 300ms ease',
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* mobile: compact progress */}
            <Box sx={{display: {xs: 'block', md: 'none'}}}>
              <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <Typography sx={{fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.amberDk}}>
                  Step {stepIndex + 1} of {STEPS.length} — {STEPS[stepIndex]?.label}
                </Typography>
                {stepIndex < STEPS.length - 1 && (
                  <Typography sx={{fontFamily: MONO, fontSize: 10, color: C.text3}}>
                    Next: {STEPS[stepIndex + 1].label}
                  </Typography>
                )}
              </Box>
              <Box sx={{mt: 1, height: 3.5, borderRadius: 999, bgcolor: C.border, overflow: 'hidden'}}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
                    bgcolor: GOLD,
                    borderRadius: 999,
                    transition: 'width 420ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* ── body ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: {xs: 2.5, md: 5},
          py: {xs: 3.5, md: 5},
          display: 'grid',
          gridTemplateColumns: {xs: '1fr', lg: showSummary ? '1fr 330px' : '1fr'},
          gap: {xs: 3.5, lg: 5},
          alignItems: 'start',
        }}
      >
        {/* main column — keyed so each step animates in */}
        <Box key={step} sx={{...rise(0), minWidth: 0}}>
          {!hydrated ? (
            // loading skeletons while the cart hydrates from sessionStorage
            <Box>
              <Skeleton variant="text" width={140} height={20} sx={{bgcolor: C.border}} />
              <Skeleton variant="text" width={320} height={52} sx={{bgcolor: C.border}} />
              <Skeleton variant="rounded" height={170} sx={{mt: 3, borderRadius: 3, bgcolor: C.border}} />
              <Skeleton variant="rounded" height={170} sx={{mt: 2, borderRadius: 3, bgcolor: C.border, opacity: 0.6}} />
            </Box>
          ) : done ? (
            <ConfirmedStep
              colors={C}
              lines={confirmedLines}
              schedule={schedule}
              account={account}
              total={
                confirmedLines.reduce((a, l) => a + l.lineTotal, 0) *
                (1 + TAX_RATE)
              }
              bookingRef={bookingRef}
            />
          ) : step === 'cart' ? (
            <CartStep
              lines={lines}
              colors={C}
              onQty={setQty}
              onRemove={removeItem}
              onNext={() => setStep('schedule')}
            />
          ) : step === 'schedule' ? (
            <ScheduleStep
              lines={lines}
              colors={C}
              value={schedule}
              onChange={setSchedule}
              onBack={() => setStep('cart')}
              onNext={() => setStep('agreement')}
            />
          ) : step === 'agreement' ? (
            <AgreementStep
              colors={C}
              isDark={isDark}
              lines={lines}
              schedule={schedule}
              totals={{subtotal, tax, total}}
              onBack={() => setStep('schedule')}
              onNext={() => setStep('sign')}
            />
          ) : step === 'sign' ? (
            <SignatureStep
              colors={C}
              isDark={isDark}
              lines={lines}
              schedule={schedule}
              defaultName={signerName}
              totals={{subtotal, tax, total}}
              onBack={() => setStep('agreement')}
              onNext={(name) => {
                setSignerName(name);
                setStep('account');
              }}
            />
          ) : (
            <AccountStep
              colors={C}
              defaultName={signerName}
              totals={{subtotal, tax, total}}
              onBack={() => setStep('sign')}
              onComplete={(acc) => {
                setAccount(acc);
                finish();
              }}
            />
          )}
        </Box>

        {/* summary rail — sticky beside the content on desktop; on mobile it is
            pulled ABOVE the step (order: -1) so the grand total is always seen
            before the Continue button, never buried under it. */}
        {showSummary && (
          <Box
            sx={{
              ...rise(140),
              order: {xs: -1, lg: 0},
              position: {lg: 'sticky'},
              top: {lg: 99},
              minWidth: 0,
            }}
          >
            <OrderSummary lines={lines} schedule={schedule} colors={C} />
          </Box>
        )}
      </Box>

      {/* ── trust footer — reassurance + a human to call, no navigation ── */}
      <Box
        sx={{
          borderTop: `1px solid ${C.border}`,
          px: {xs: 2.5, md: 5},
          py: {xs: 2.5, md: 3},
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {/* support line — help is a call away */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            fontFamily: BODY,
            fontSize: 13,
            color: C.text2,
            textAlign: 'center',
          }}
        >
          <Headset size={15} color={GOLD} />
          Questions about your rental?
          <Box component="span" sx={{fontWeight: 700, color: C.text}}>
            (800) 555-RISE
          </Box>
          <Box component="span" sx={{color: C.text3}}>· Mon–Fri, 7AM–7PM CT</Box>
        </Box>

        {/* trust badges + copyright */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: {xs: 2, md: 3.5},
            flexWrap: 'wrap',
            fontFamily: MONO,
            fontSize: 10.5,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: C.text3,
          }}
        >
          <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.75}}>
            <Lock size={11} color={GOLD} /> 256-bit encrypted
          </Box>
          <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 0.75}}>
            <CheckCircle2 size={11} color={GOLD} /> No charge until signed
          </Box>
          <Box>© {new Date().getFullYear()} Rise Capital</Box>
        </Box>
      </Box>
    </Box>
  );
}
