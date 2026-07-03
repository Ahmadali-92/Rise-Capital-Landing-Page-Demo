'use client';

// Step 3 — rental agreement viewer + three acknowledgements + COI upload.
// The contract's equipment, duration and total are wired to the real cart
// (see equipmentLabel / periodDays / totals below); the signer is referred to
// as "the undersigned Lessee" and identified by the signature on the next step.
// The four policy SECTIONS are fixed boilerplate demo copy.
import {useCallback, useRef, useState} from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Wrench,
} from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import {
  BODY,
  DISPLAY,
  GOLD,
  MONO,
  RcColors,
  ghostBtn,
  goldBtn,
  money,
  rise,
} from './tokens';
import {NavRow, StepHeader} from './ui';
import type {CheckoutLine, ScheduleState} from './types';

// ── agreement copy (exact demo text) ────────────────────────────────────────
const SECTIONS = [
  {
    icon: Clock,
    title: 'Late Return Penalties',
    body: 'Any equipment not returned by the agreed-upon end date will incur a late fee of 1.5% of the rental amount per day after a 5-day grace period. Overdue invoices are escalated to accounting after 30 days.',
  },
  {
    icon: ShieldCheck,
    title: 'Insurance Requirements',
    body: 'Lessee must maintain a current Certificate of Insurance (COI) listing Rise Capital as additional insured with General Liability ≥ $2,000,000 and Auto Liability ≥ $1,000,000 for the entire rental period.',
  },
  {
    icon: Wrench,
    title: 'Damage & Loss Terms',
    body: 'Lessee is responsible for damage beyond ordinary wear and tear. Repairs are billed at cost + 15%. Total loss results in charge of the full replacement value. Before/after condition photos are binding.',
  },
  {
    icon: Ban,
    title: 'Use Restrictions',
    body: "Equipment may only be operated by trained personnel within the manufacturer's parameters. Off-site use, sub-leasing, or transport across state lines without written approval is prohibited.",
  },
] as const;

const ACKS = [
  {
    key: 'delayed',
    detail:
      'Returns after 6:00 PM on the end date will be billed at 1.5× the daily rate per additional day.',
    label: 'I acknowledge the delayed pick-up terms.',
  },
  {
    key: 'damage',
    detail:
      'Repairs are billed at cost + 15%. Total loss equals full replacement value. Before/after photos are binding.',
    label: 'I acknowledge the damage and loss policy.',
  },
  {
    key: 'full',
    detail:
      'A valid COI with the coverage above must be on file prior to dispatch.',
    label: 'I have read and agree to the full Rental Agreement.',
  },
] as const;

type AckKey = (typeof ACKS)[number]['key'];

// ── COI upload (drag & drop, PDF-only, simulated progress) ──────────────────
type CoiState =
  | {phase: 'idle'}
  | {phase: 'uploading'; name: string; size: number; progress: number}
  | {phase: 'done'; name: string; size: number};

const fmtSize = (bytes: number) =>
  bytes >= 1_048_576
    ? `${(bytes / 1_048_576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function CoiUpload({
  colors: C,
  coi,
  setCoi,
}: {
  colors: RcColors;
  coi: CoiState;
  setCoi: (s: CoiState) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const accept = useCallback(
    (file: File | undefined) => {
      setDragOver(false);
      if (!file) return;
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        setError(
          'PDF only — please export your Certificate of Insurance as a PDF and try again.'
        );
        return;
      }
      setError('');
      stopTimer();
      // Simulated upload — frontend-only demo.
      let progress = 0;
      setCoi({phase: 'uploading', name: file.name, size: file.size, progress});
      timerRef.current = setInterval(() => {
        progress = Math.min(100, progress + 7 + Math.random() * 16);
        if (progress >= 100) {
          stopTimer();
          setCoi({phase: 'done', name: file.name, size: file.size});
        } else {
          setCoi({
            phase: 'uploading',
            name: file.name,
            size: file.size,
            progress,
          });
        }
      }, 110);
    },
    [setCoi]
  );

  const clearFile = () => {
    stopTimer();
    setCoi({phase: 'idle'});
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => accept(e.target.files?.[0])}
      />

      {coi.phase === 'idle' && (
        <Box
          role="button"
          tabIndex={0}
          aria-label="Upload Certificate of Insurance (PDF)"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            accept(e.dataTransfer.files?.[0]);
          }}
          sx={{
            border: `1.5px dashed ${dragOver ? GOLD : error ? C.danger : C.border}`,
            borderRadius: 2.5,
            bgcolor: dragOver ? C.amberBg : C.panel,
            px: 3,
            py: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition:
              'border-color 160ms ease, background-color 160ms ease, transform 160ms ease',
            '&:hover': {borderColor: GOLD, bgcolor: C.amberBg},
            '&:focus-visible': {outline: `2px solid ${GOLD}`, outlineOffset: 2},
          }}
        >
          <Box
            sx={{
              mx: 'auto',
              width: 52,
              height: 52,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: C.amberBg,
              color: C.amberDk,
              transform: dragOver ? 'translateY(-3px) scale(1.06)' : 'none',
              transition: 'transform 200ms ease',
            }}
          >
            <UploadCloud size={24} />
          </Box>
          <Typography
            sx={{
              mt: 1.75,
              fontFamily: BODY,
              fontSize: 15,
              fontWeight: 700,
              color: C.text,
            }}
          >
            Drag &amp; drop your COI here
          </Typography>
          <Typography sx={{mt: 0.5, fontSize: 12.5, color: C.text3}}>
            PDF only · max 10 MB
          </Typography>
        </Box>
      )}

      {coi.phase === 'uploading' && (
        <Box
          sx={{
            border: `1px solid ${C.border}`,
            borderRadius: 2.5,
            bgcolor: C.panel,
            p: 2.5,
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 1.5,
                display: 'grid',
                placeItems: 'center',
                bgcolor: C.amberBg,
                color: C.amberDk,
                flexShrink: 0,
              }}
            >
              <FileText size={20} />
            </Box>
            <Box sx={{minWidth: 0, flex: 1}}>
              <Typography
                noWrap
                sx={{fontSize: 13.5, fontWeight: 700, color: C.text}}
              >
                {coi.name}
              </Typography>
              <Typography
                sx={{fontFamily: MONO, fontSize: 10.5, color: C.text3}}
              >
                Uploading… {Math.round(coi.progress)}%
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 1.75,
              height: 5,
              borderRadius: 999,
              bgcolor: C.border,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${coi.progress}%`,
                bgcolor: GOLD,
                borderRadius: 999,
                transition: 'width 140ms linear',
              }}
            />
          </Box>
        </Box>
      )}

      {coi.phase === 'done' && (
        <Box
          sx={{
            border: `1px solid ${C.success}66`,
            borderRadius: 2.5,
            bgcolor: C.successBg,
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 1.5,
              display: 'grid',
              placeItems: 'center',
              bgcolor: C.panel,
              color: C.success,
              flexShrink: 0,
            }}
          >
            <FileText size={20} />
          </Box>
          <Box sx={{minWidth: 0, flex: 1}}>
            <Typography
              noWrap
              sx={{fontSize: 13.5, fontWeight: 700, color: C.text}}
            >
              {coi.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: 10.5,
                color: C.success,
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                mt: 0.25,
              }}
            >
              <CheckCircle2 size={12} /> Uploaded · {fmtSize(coi.size)}
            </Typography>
          </Box>
          <Box sx={{display: 'flex', gap: 1}}>
            <Button
              onClick={() => inputRef.current?.click()}
              startIcon={<RefreshCw size={13} />}
              sx={{...ghostBtn(C), px: 1.75, py: 0.7, fontSize: 12}}
            >
              Replace
            </Button>
            <Button
              onClick={clearFile}
              startIcon={<Trash2 size={13} />}
              sx={{
                ...ghostBtn(C),
                px: 1.75,
                py: 0.7,
                fontSize: 12,
                '&:hover': {
                  borderColor: C.danger,
                  color: C.danger,
                  bgcolor: C.dangerBg,
                },
              }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      )}

      {error && (
        <Box
          role="alert"
          sx={{
            mt: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            borderRadius: 2,
            bgcolor: C.dangerBg,
            p: 1.5,
            fontSize: 12.5,
            color: C.danger,
          }}
        >
          <AlertTriangle size={15} style={{marginTop: 2, flexShrink: 0}} />
          {error}
        </Box>
      )}
    </Box>
  );
}

// ── the step ─────────────────────────────────────────────────────────────────
export default function AgreementStep({
  colors: C,
  isDark,
  lines,
  schedule,
  totals,
  onBack,
  onNext,
}: {
  colors: RcColors;
  isDark: boolean;
  lines: CheckoutLine[];
  schedule: ScheduleState;
  totals: {subtotal: number; tax: number; total: number};
  onBack: () => void;
  onNext: () => void;
}) {
  const [acks, setAcks] = useState<Record<AckKey, boolean>>({
    delayed: false,
    damage: false,
    full: false,
  });
  const [coi, setCoi] = useState<CoiState>({phase: 'idle'});

  const allAcked = ACKS.every((a) => acks[a.key]);
  const ready = allAcked && coi.phase === 'done';

  // Contract terms come straight from the cart — never hardcoded.
  const equipmentLabel =
    lines.length > 0
      ? lines
          .map(
            (l) => `${l.eq.name}${l.item.qty > 1 ? ` (× ${l.item.qty})` : ''}`
          )
          .join(', ')
      : '—';
  const periodDays = lines.length ? Math.max(...lines.map((l) => l.days)) : 0;
  const deliveryLine = schedule.city
    ? `delivered to ${[schedule.city, schedule.region].filter(Boolean).join(', ')}`
    : 'delivered to the Lessee’s job site';

  return (
    <Box>
      <StepHeader
        kicker="Step 3 — Agreement"
        title="Rental agreement & insurance"
        sub="Review the terms, acknowledge the key policies, and attach your Certificate of Insurance. Your signature comes next."
        colors={C}
      />

      {/* document viewer */}
      <Box
        sx={{
          ...rise(120),
          mt: 3.5,
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          bgcolor: C.panel,
          overflow: 'hidden',
        }}
      >
        {/* document header */}
        <Box
          sx={{
            px: {xs: 2.5, md: 3.5},
            py: 2,
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <Box sx={{color: C.amberDk, display: 'flex'}}>
            <ScrollText size={18} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 16,
                color: C.text,
              }}
            >
              Equipment Rental Agreement
            </Typography>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.text3,
              }}
            >
              Document RC-ERA-001 · Demo copy
            </Typography>
          </Box>
        </Box>

        {/* scrollable body */}
        <Box
          tabIndex={0}
          sx={{
            maxHeight: 420,
            overflowY: 'auto',
            px: {xs: 2.5, md: 3.5},
            py: 3,
            '&::-webkit-scrollbar': {width: 8},
            '&::-webkit-scrollbar-thumb': {
              bgcolor: C.border,
              borderRadius: 999,
              '&:hover': {bgcolor: `${GOLD}88`},
            },
          }}
        >
          <Typography sx={{fontSize: 14.5, lineHeight: 1.8, color: C.text2}}>
            This Agreement is entered into between{' '}
            <Box component="strong" sx={{color: C.text}}>
              Rise Capital
            </Box>{' '}
            (the &ldquo;Lessor&rdquo;) and{' '}
            <Box component="strong" sx={{color: C.text}}>
              the undersigned Lessee
            </Box>{' '}
            (identified by signature on the following step) for the rental of{' '}
            <Box component="strong" sx={{color: C.text}}>
              {equipmentLabel}
            </Box>
            , {deliveryLine}, for a period of{' '}
            <Box component="strong" sx={{color: C.text}}>
              {periodDays} day{periodDays === 1 ? '' : 's'}
            </Box>
            , for a total contract value of{' '}
            <Box component="strong" sx={{color: GOLD}}>
              {money(totals.total)}
            </Box>{' '}
            (inclusive of tax).
          </Typography>

          <Box sx={{mt: 3, display: 'flex', flexDirection: 'column', gap: 2}}>
            {SECTIONS.map((s, i) => (
              <Box
                key={s.title}
                sx={{
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${GOLD}`,
                  borderRadius: 2,
                  p: {xs: 2, md: 2.5},
                }}
              >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.25}}>
                  <Box sx={{color: C.amberDk, display: 'flex', flexShrink: 0}}>
                    <s.icon size={16} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: C.text,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')} · {s.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    mt: 1.25,
                    fontSize: 13.5,
                    lineHeight: 1.75,
                    color: C.text2,
                  }}
                >
                  {s.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* acknowledgements */}
      <Box sx={{...rise(200), mt: 4}}>
        <Typography
          sx={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 19,
            color: C.text,
          }}
        >
          Acknowledgements
        </Typography>
        <Box
          sx={{mt: 1.75, display: 'flex', flexDirection: 'column', gap: 1.5}}
        >
          {ACKS.map((a) => {
            const checked = acks[a.key];
            return (
              <Box
                key={a.key}
                sx={{
                  // Card stays neutral whether or not it's checked — only the
                  // checkbox itself turns gold. No full-card highlight.
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 2.5,
                  bgcolor: C.panel,
                  px: {xs: 2, md: 2.5},
                  py: 1.75,
                }}
              >
                <Typography
                  sx={{fontSize: 13, lineHeight: 1.65, color: C.text2}}
                >
                  {a.detail}
                </Typography>
                <FormControlLabel
                  sx={{
                    mt: 0.75,
                    ml: -1.25,
                    '& .MuiFormControlLabel-label': {fontFamily: BODY},
                  }}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) =>
                        setAcks((prev) => ({
                          ...prev,
                          [a.key]: e.target.checked,
                        }))
                      }
                      sx={{
                        color: C.text3,
                        '&.Mui-checked': {color: GOLD},
                        '&:hover': {bgcolor: C.amberBg},
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{fontSize: 14, fontWeight: 700, color: C.text}}
                    >
                      {a.label}
                    </Typography>
                  }
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* COI upload */}
      <Box sx={{...rise(260), mt: 4}}>
        <Typography
          sx={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 19,
            color: C.text,
          }}
        >
          Certificate of Insurance
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            mb: 1.75,
            fontSize: 13.5,
            lineHeight: 1.65,
            color: C.text2,
            maxWidth: 560,
          }}
        >
          Attach a current COI listing Rise Capital as additional insured
          (General Liability ≥ $2,000,000 · Auto Liability ≥ $1,000,000). We
          verify it before dispatch.
        </Typography>
        <CoiUpload colors={C} coi={coi} setCoi={setCoi} />
      </Box>

      <NavRow
        colors={C}
        onBack={onBack}
        onNext={onNext}
        nextLabel="Continue to signature"
        nextDisabled={!ready}
        nextHint={
          !ready
            ? !allAcked
              ? 'Check all three acknowledgements to continue'
              : 'Upload your COI (PDF) to continue'
            : undefined
        }
      />
    </Box>
  );
}
