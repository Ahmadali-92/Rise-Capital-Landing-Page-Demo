'use client';

// Small shared building blocks for the checkout steps — kicker headlines,
// back/continue nav row, info callouts. Same editorial voice as the detail page.
import type {ReactNode} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {BODY, DISPLAY, GOLD, GOLD_HOVER, INK, MONO, RcColors, goldBtn, ghostBtn, rise} from './tokens';

export function StepHeader({
  kicker,
  title,
  sub,
  colors: C,
}: {
  kicker: string;
  title: string;
  sub?: string;
  colors: RcColors;
}) {
  return (
    <Box sx={rise(30)}>
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: C.amberDk,
        }}
      >
        {kicker}
      </Typography>
      <Typography
        component="h1"
        sx={{
          mt: 1,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: {xs: 30, md: 40},
          letterSpacing: '-0.035em',
          lineHeight: 1.02,
          color: C.text,
        }}
      >
        {title}
      </Typography>
      {sub && (
        <Typography
          sx={{
            mt: 1.5,
            fontFamily: BODY,
            fontSize: {xs: 14, md: 15},
            lineHeight: 1.7,
            color: C.text2,
            maxWidth: 560,
          }}
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
}

export function NavRow({
  colors: C,
  onBack,
  backLabel = 'Back',
  onNext,
  nextLabel,
  nextDisabled = false,
  nextHint,
}: {
  colors: RcColors;
  onBack?: () => void;
  backLabel?: string;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  nextHint?: ReactNode;
}) {
  return (
    <Box sx={{mt: 4}}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: onBack ? 'space-between' : 'flex-end',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {onBack && (
          <Button
            onClick={onBack}
            startIcon={<ArrowLeft size={16} />}
            sx={{...ghostBtn(C), px: 2.5, py: 1.2, fontSize: 14}}
          >
            {backLabel}
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          endIcon={<ArrowRight size={17} />}
          sx={{
            ...goldBtn,
            px: 3.5,
            py: 1.3,
            fontSize: 15,
            '&:hover': {bgcolor: GOLD_HOVER, color: INK, boxShadow: 'none'},
            '&.Mui-disabled': {
              bgcolor: C.border,
              color: C.text3,
              border: '1px solid transparent',
            },
          }}
        >
          {nextLabel}
        </Button>
      </Box>
      {nextHint && (
        <Typography
          sx={{
            mt: 1.25,
            textAlign: 'right',
            fontSize: 12,
            color: C.text3,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 0.6,
          }}
        >
          {nextHint}
        </Typography>
      )}
    </Box>
  );
}

// Amber "why we ask" callout — reassuring, editorial, never transactional.
export function InfoCallout({
  colors: C,
  icon,
  title,
  children,
}: {
  colors: RcColors;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.75,
        alignItems: 'flex-start',
        borderRadius: 2.5,
        border: `1px solid ${GOLD}55`,
        bgcolor: C.amberBg,
        px: {xs: 2, md: 2.5},
        py: {xs: 1.75, md: 2},
      }}
    >
      <Box sx={{color: C.amberDk, mt: 0.3, flexShrink: 0, display: 'flex'}}>{icon}</Box>
      <Box>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.amberText,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{mt: 0.5, fontSize: 13.5, lineHeight: 1.65, color: C.text2}}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
