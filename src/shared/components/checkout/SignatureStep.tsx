'use client';

// Step 5 — DocuSign-style signature: draw on canvas or type with a cursive
// preview, plus a recap of everything being signed. Frontend-only.
import {useCallback, useEffect, useRef, useState} from 'react';
import {Eraser, Eye, PenLine, Type, X} from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  BODY,
  DISPLAY,
  GOLD,
  MONO,
  RcColors,
  SCRIPT,
  ghostBtn,
  inputSx,
  money,
  rise,
} from './tokens';
import {NavRow, StepHeader} from './ui';
import type {CheckoutLine, ScheduleState} from './types';

const fmtDay = (d: Date) =>
  d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

// Keep both signing methods the SAME total height so the Back/Continue row and
// everything below never jump when switching Type ↔ Draw. Type mode stacks a
// name-field block above its preview; the Draw pad is taller by that amount so
// the two columns end at the same y.
const TYPE_PREVIEW_H = 150;
const NAME_BLOCK_H = 95; // name field + helper + gap above the type preview
const SURFACE_H = TYPE_PREVIEW_H + NAME_BLOCK_H; // draw-pad height

// ── canvas pad ───────────────────────────────────────────────────────────────
function SignaturePad({
  colors: C,
  isDark,
  onInkChange,
}: {
  colors: RcColors;
  isDark: boolean;
  onInkChange: (hasInk: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{x: number; y: number} | null>(null);
  const [hasInk, setHasInk] = useState(false);

  // Size the canvas to its box (retina-sharp), preserving nothing on resize —
  // acceptable for a demo pad.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top};
  };

  const stroke = isDark ? '#F5F5F5' : '#141210';

  const down = (e: React.PointerEvent) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = pos(e);
    // midpoint smoothing — curves instead of jagged polylines
    const mid = {x: (last.current.x + p.x) / 2, y: (last.current.y + p.y) / 2};
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.quadraticCurveTo(last.current.x, last.current.y, mid.x, mid.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!hasInk) {
      setHasInk(true);
      onInkChange(true);
    }
  };

  const up = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onInkChange(false);
  }, [onInkChange]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: SURFACE_H,
        border: `1.5px solid ${C.border}`,
        borderRadius: 2.5,
        bgcolor: C.panel,
        overflow: 'hidden',
        '&:hover': {borderColor: `${GOLD}88`},
        transition: 'border-color 160ms ease',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Signature pad — draw your signature"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'none',
          cursor: 'crosshair',
        }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      />
      {/* baseline + hint */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 44,
          borderBottom: `1.5px dashed ${C.border}`,
          pointerEvents: 'none',
        }}
      />
      {!hasInk && (
        <Typography
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.text3,
            pointerEvents: 'none',
          }}
        >
          Sign here with mouse or touch
        </Typography>
      )}
      <Typography
        sx={{
          position: 'absolute',
          left: 24,
          bottom: 20,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.text3,
          pointerEvents: 'none',
        }}
      >
        × Signature
      </Typography>
      {/* clear — pinned top-right so it never adds a row below the pad */}
      <Button
        onClick={clear}
        disabled={!hasInk}
        startIcon={<Eraser size={13} />}
        sx={{
          ...ghostBtn(C),
          position: 'absolute',
          top: 10,
          right: 10,
          px: 1.5,
          py: 0.5,
          fontSize: 12,
          bgcolor: C.panel,
          '&.Mui-disabled': {opacity: 0, pointerEvents: 'none'},
        }}
      >
        Clear
      </Button>
    </Box>
  );
}

// ── the step ─────────────────────────────────────────────────────────────────
export default function SignatureStep({
  colors: C,
  isDark,
  lines,
  schedule,
  defaultName,
  totals,
  onBack,
  onNext,
}: {
  colors: RcColors;
  isDark: boolean;
  lines: CheckoutLine[];
  schedule: ScheduleState;
  defaultName: string;
  totals: {subtotal: number; tax: number; total: number};
  onBack: () => void;
  onNext: (signatureName: string) => void;
}) {
  const [mode, setMode] = useState<'draw' | 'type'>('type');
  const [typed, setTyped] = useState(defaultName);
  const [drawn, setDrawn] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Only one signing method is shown at a time. In Type mode the typed legal
  // name IS the signature (and pre-fills the account next). In Draw mode the
  // customer draws a mark; their name is collected on the account step.
  const signatureName = typed.trim();
  const signed = mode === 'type' ? signatureName.length >= 3 : drawn;

  // Switching method resets the drawn mark — the pad remounts blank, so a stale
  // "drawn" flag must not keep Continue enabled.
  const selectMode = (m: 'draw' | 'type') => {
    setMode(m);
    setDrawn(false);
  };

  const recap = [
    {
      label: 'Equipment',
      value: lines
        .map((l) => `${l.eq.name}${l.item.qty > 1 ? ` × ${l.item.qty}` : ''}`)
        .join(', '),
    },
    {
      label: 'Rental period',
      value: lines.length
        ? `${fmtDay(new Date(Math.min(...lines.map((l) => l.from.getTime()))))} → ${fmtDay(
            new Date(Math.max(...lines.map((l) => l.to.getTime())))
          )}`
        : '—',
    },
    {label: 'Drop-off', value: schedule.dropOff ?? '—'},
    {label: 'Pickup', value: schedule.pickup ?? '—'},
    {label: 'Signer', value: signatureName || '—'},
    {label: 'Grand total', value: money(totals.total), gold: true},
  ];

  const segBtn = (active: boolean) =>
    ({
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0.9,
      px: 2,
      py: 1.1,
      borderRadius: 1.5,
      cursor: 'pointer',
      fontFamily: BODY,
      fontWeight: 700,
      fontSize: 13.5,
      border: `1.5px solid ${active ? GOLD : C.border}`,
      bgcolor: active ? C.amberBg : 'transparent',
      color: active ? C.amberText : C.text2,
      transition: 'all 160ms ease',
      '&:hover': {borderColor: GOLD},
      '&:focus-visible': {outline: `2px solid ${GOLD}`, outlineOffset: 2},
    }) as const;

  return (
    <Box>
      <StepHeader
        kicker="Step 4 — Signature"
        title="Sign the agreement"
        colors={C}
      />

      {/* signature mode toggle — one method at a time */}
      <Box sx={{...rise(180), mt: 4}}>
        <Box sx={{display: 'flex', gap: 1.25, maxWidth: 380}}>
          <Box
            component="button"
            type="button"
            onClick={() => selectMode('type')}
            sx={segBtn(mode === 'type')}
          >
            <Type size={15} /> Type
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => selectMode('draw')}
            sx={segBtn(mode === 'draw')}
          >
            <PenLine size={15} /> Draw
          </Box>
        </Box>

        <Box sx={{mt: 2.5, minHeight: {sm: SURFACE_H}}}>
          {mode === 'type' ? (
            // TYPE — legal name field (captures the signer) + live cursive preview
            <Box>
              <TextField
                fullWidth
                label="Full legal name"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                helperText="This name signs the agreement and pre-fills your account on the next step."
                autoComplete="name"
                sx={{...inputSx(C), maxWidth: 460}}
              />
              <Box
                sx={{
                  mt: 2,
                  height: TYPE_PREVIEW_H,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 2.5,
                  bgcolor: C.panel,
                  px: 3,
                  py: 2,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: `${SCRIPT}, cursive`,
                    fontSize: {xs: 34, md: 44},
                    lineHeight: 1.2,
                    color: typed.trim() ? C.text : C.text3,
                    minHeight: 56,
                  }}
                >
                  {typed.trim() || 'Your signature'}
                </Typography>
                <Box
                  sx={{
                    mx: 'auto',
                    width: '100%',
                    maxWidth: 420,
                    borderBottom: `1.5px dashed ${C.border}`,
                  }}
                />
                <Typography
                  sx={{
                    mt: 1,
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: C.text3,
                  }}
                >
                  × Signature preview
                </Typography>
              </Box>
            </Box>
          ) : (
            // DRAW — canvas pad only (same total height as the type column)
            <SignaturePad colors={C} isDark={isDark} onInkChange={setDrawn} />
          )}
        </Box>

        {/* preview control */}
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Button
            onClick={() => setPreviewOpen(true)}
            disabled={!signed}
            startIcon={<Eye size={14} />}
            sx={{
              ...ghostBtn(C),
              px: 2,
              py: 0.8,
              fontSize: 12.5,
              '&.Mui-disabled': {opacity: 0.45, color: C.text3},
            }}
          >
            Preview agreement
          </Button>
          <Typography sx={{fontSize: 12, color: C.text3}}>
            By signing you agree to the Equipment Rental Agreement reviewed in
            the previous step.
          </Typography>
        </Box>
      </Box>

      <NavRow
        colors={C}
        onBack={onBack}
        onNext={() => onNext(signatureName)}
        nextLabel="Continue to account"
        nextDisabled={!signed}
        nextHint={
          !signed
            ? mode === 'type'
              ? 'Enter your full legal name to sign'
              : 'Draw your signature to continue'
            : undefined
        }
      />

      {/* preview dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="rc-sign-preview-title"
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(6,6,7,0.55)',
            backdropFilter: 'blur(8px)',
          },
          '& .MuiDialog-paper': {
            borderRadius: 3,
            border: `1px solid ${C.border}`,
            bgcolor: isDark ? '#161617' : '#FFFFFF',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{p: {xs: 3, md: 4}, position: 'relative'}}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            aria-label="Close preview"
            sx={{position: 'absolute', top: 10, right: 10, color: C.text3}}
          >
            <X size={18} />
          </IconButton>
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: 10.5,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: C.amberDk,
            }}
          >
            Agreement preview
          </Typography>
          <Typography
            id="rc-sign-preview-title"
            sx={{
              mt: 1,
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: 24,
              letterSpacing: '-0.03em',
              color: C.text,
            }}
          >
            Equipment Rental Agreement
          </Typography>
          <Box sx={{mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1}}>
            {recap.map((r) => (
              <Box
                key={r.label}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  fontSize: 13,
                }}
              >
                <Box component="span" sx={{color: C.text3}}>
                  {r.label}
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: r.gold ? GOLD : C.text,
                    fontWeight: 600,
                    textAlign: 'right',
                  }}
                >
                  {r.value}
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              mt: 3,
              pt: 2.5,
              borderTop: `1px dashed ${C.border}`,
              textAlign: 'center',
            }}
          >
            {mode === 'type' ? (
              <Typography
                sx={{
                  fontFamily: `${SCRIPT}, cursive`,
                  fontSize: 38,
                  color: C.text,
                  lineHeight: 1.2,
                }}
              >
                {typed.trim() || '—'}
              </Typography>
            ) : (
              <Typography sx={{fontFamily: MONO, fontSize: 12, color: C.text2}}>
                ✓ Signature captured on pad
              </Typography>
            )}
            <Typography
              sx={{
                mt: 0.5,
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.text3,
              }}
            >
              {signatureName || 'Lessee'}
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
