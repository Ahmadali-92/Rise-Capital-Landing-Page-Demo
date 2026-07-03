'use client';

// Final step — the customer signs in or creates an account to lock in the
// booking they just signed. Placed last on purpose: identity is captured once
// at the signature, so here we only confirm it and hand over the order.
import {useMemo, useState} from 'react';
import {
  Bookmark,
  CheckCircle2,
  Eye,
  EyeOff,
  History,
  LogIn,
  ShieldCheck,
  UserPlus,
  Zap,
} from 'lucide-react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {BODY, GOLD, MONO, RcColors, inputSx, money, rise} from './tokens';
import {NavRow, StepHeader} from './ui';
import type {AccountState} from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Mode = 'register' | 'login';
type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
type Touched = Partial<Record<keyof Fields, boolean>>;

const validate = (f: Fields, mode: Mode) => ({
  firstName:
    mode === 'login' || f.firstName.trim().length >= 2
      ? ''
      : 'Enter your first name',
  lastName:
    mode === 'login' || f.lastName.trim().length >= 2
      ? ''
      : 'Enter your last name',
  email: EMAIL_RE.test(f.email) ? '' : 'Enter a valid email address',
  password:
    mode === 'login'
      ? f.password.length >= 1
        ? ''
        : 'Enter your password'
      : f.password.length >= 8
        ? ''
        : 'At least 8 characters',
});

const strength = (pw: string) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 3); // 0..3
};

const STRENGTH_LABELS = ['Too short', 'Okay', 'Good', 'Strong'];

const PERKS = [
  {icon: History, text: 'Track this order and your full rental history'},
  {icon: Zap, text: 'Faster checkout the next time you rent'},
  {icon: Bookmark, text: 'Save equipment and depots you use often'},
] as const;

export default function AccountStep({
  colors: C,
  defaultName,
  totals,
  onBack,
  onComplete,
}: {
  colors: RcColors;
  defaultName: string;
  totals: {subtotal: number; tax: number; total: number};
  onBack: () => void;
  onComplete: (account: AccountState) => void;
}) {
  const [mode, setMode] = useState<Mode>('register');

  // The signer's name (captured once at the signature step) pre-fills register.
  const [firstGuess, lastGuess] = useMemo(() => {
    const parts = defaultName.trim().split(/\s+/).filter(Boolean);
    return [parts[0] ?? '', parts.slice(1).join(' ')];
  }, [defaultName]);

  const [fields, setFields] = useState<Fields>({
    firstName: firstGuess,
    lastName: lastGuess,
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState<Touched>({});
  const [showPw, setShowPw] = useState(false);

  const errors = validate(fields, mode);
  const valid = Object.values(errors).every((e) => !e);
  const pwScore = strength(fields.password);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({...f, [key]: e.target.value}));
  const touch = (key: keyof Fields) => () =>
    setTouched((t) => ({...t, [key]: true}));

  const err = (key: keyof Fields) => (touched[key] ? errors[key] : '');
  const ok = (key: keyof Fields) => touched[key] && !errors[key];

  const okAdornment = (key: keyof Fields) =>
    ok(key) ? (
      <InputAdornment position="end">
        <CheckCircle2 size={17} color={C.success} />
      </InputAdornment>
    ) : undefined;

  const switchMode = (next: Mode) => {
    setMode(next);
    setTouched({});
  };

  const submit = () => {
    const nextErrors = validate(fields, mode);
    setTouched({firstName: true, lastName: true, email: true, password: true});
    if (!Object.values(nextErrors).every((e) => !e)) return;
    // On login we don't collect a name, so fall back to the signer's name.
    onComplete({
      firstName:
        (mode === 'login' ? firstGuess : fields.firstName.trim()) || 'Customer',
      lastName: mode === 'login' ? lastGuess : fields.lastName.trim(),
      email: fields.email.trim(),
    });
  };

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

  const isLogin = mode === 'login';

  return (
    <Box>
      <StepHeader
        kicker="Step 5 — Account"
        title={isLogin ? 'Welcome back' : 'One last step'}
        sub={
          isLogin
            ? 'Sign in to attach this booking to your account and confirm it.'
            : "You've signed the agreement — create your account to confirm the booking and manage it anytime."
        }
        colors={C}
      />

      {/* confirming-total banner — makes this feel like the finish line */}
      <Box
        sx={{
          ...rise(90),
          mt: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          border: `1px solid ${GOLD}55`,
          bgcolor: C.amberBg,
          borderRadius: 2.5,
          px: {xs: 2, md: 2.5},
          py: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: C.amberText,
          }}
        >
          <ShieldCheck size={16} />
          <Typography sx={{fontFamily: BODY, fontSize: 13.5, fontWeight: 600}}>
            You&apos;re confirming a booking of
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: 16,
            fontWeight: 700,
            color: C.amberText,
          }}
        >
          {money(totals.total)}
        </Typography>
      </Box>

      {/* login / register toggle */}
      <Box
        sx={{...rise(120), mt: 3, display: 'flex', gap: 1.25, maxWidth: 420}}
      >
        <Box
          component="button"
          type="button"
          onClick={() => switchMode('register')}
          sx={segBtn(!isLogin)}
        >
          <UserPlus size={15} /> Create account
        </Box>
        <Box
          component="button"
          type="button"
          onClick={() => switchMode('login')}
          sx={segBtn(isLogin)}
        >
          <LogIn size={15} /> Sign in
        </Box>
      </Box>

      <Box
        sx={{
          ...rise(160),
          mt: 2.5,
          display: 'grid',
          gridTemplateColumns: {xs: '1fr', md: '1fr 260px'},
          gap: {xs: 3, md: 4},
          alignItems: 'start',
        }}
      >
        {/* form */}
        <Box
          component="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          sx={{
            border: `1px solid ${C.border}`,
            borderRadius: 3,
            bgcolor: C.panel,
            p: {xs: 2.5, md: 3.5},
            display: 'flex',
            flexDirection: 'column',
            gap: 2.25,
          }}
        >
          {!isLogin && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'},
                gap: 2.25,
              }}
            >
              <TextField
                label="First name"
                value={fields.firstName}
                onChange={set('firstName')}
                onBlur={touch('firstName')}
                error={Boolean(err('firstName'))}
                helperText={err('firstName') || ' '}
                autoComplete="given-name"
                slotProps={{input: {endAdornment: okAdornment('firstName')}}}
                sx={inputSx(C)}
              />
              <TextField
                label="Last name"
                value={fields.lastName}
                onChange={set('lastName')}
                onBlur={touch('lastName')}
                error={Boolean(err('lastName'))}
                helperText={err('lastName') || ' '}
                autoComplete="family-name"
                slotProps={{input: {endAdornment: okAdornment('lastName')}}}
                sx={inputSx(C)}
              />
            </Box>
          )}
          <TextField
            label="Email address"
            type="email"
            value={fields.email}
            onChange={set('email')}
            onBlur={touch('email')}
            error={Boolean(err('email'))}
            helperText={err('email')}
            autoComplete="email"
            slotProps={{input: {endAdornment: okAdornment('email')}}}
            sx={inputSx(C)}
          />
          <Box>
            <TextField
              fullWidth
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={fields.password}
              onChange={set('password')}
              onBlur={touch('password')}
              error={Boolean(err('password'))}
              helperText={err('password') || ' '}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPw((v) => !v)}
                        edge="end"
                        sx={{color: C.text3, '&:hover': {color: C.amberDk}}}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={inputSx(C)}
            />
            {/* strength meter — register only */}
            {!isLogin && fields.password.length > 0 && (
              <Box
                sx={{mt: 0.5, display: 'flex', alignItems: 'center', gap: 1.25}}
              >
                <Box sx={{display: 'flex', gap: 0.5, flex: 1, maxWidth: 180}}>
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        height: 4,
                        flex: 1,
                        borderRadius: 999,
                        bgcolor:
                          i < pwScore
                            ? pwScore >= 3
                              ? C.success
                              : GOLD
                            : C.border,
                        transition: 'background-color 240ms ease',
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  sx={{fontFamily: MONO, fontSize: 10.5, color: C.text3}}
                >
                  {STRENGTH_LABELS[pwScore]}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* perks rail */}
        <Box
          sx={{
            border: `1px dashed ${C.border}`,
            borderRadius: 3,
            p: {xs: 2.5, md: 3},
          }}
        >
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.amberDk,
            }}
          >
            Why an account helps
          </Typography>
          <Box
            sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 1.75}}
          >
            {PERKS.map((p) => (
              <Box
                key={p.text}
                sx={{display: 'flex', gap: 1.25, alignItems: 'flex-start'}}
              >
                <Box
                  sx={{
                    color: C.amberDk,
                    mt: 0.25,
                    flexShrink: 0,
                    display: 'flex',
                  }}
                >
                  <p.icon size={15} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: BODY,
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: C.text2,
                  }}
                >
                  {p.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <NavRow
        colors={C}
        onBack={onBack}
        onNext={submit}
        nextLabel={
          isLogin
            ? 'Sign in & confirm booking'
            : 'Create account & confirm booking'
        }
        nextDisabled={
          !valid && Object.keys(touched).length >= (isLogin ? 2 : 4)
        }
      />
    </Box>
  );
}
