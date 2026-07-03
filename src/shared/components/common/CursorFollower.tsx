'use client';

import {useEffect, useRef} from 'react';

import Box from '@mui/material/Box';

const GOLD = '#D9A428';
const INK = '#0B0B0C';

// A small dot that smoothly trails the mouse cursor. It turns gold over dark
// surfaces (any ancestor tagged `data-cursor-dark`) and black over light ones.
// Purely decorative — pointer-events disabled, hidden on touch/coarse pointers.
export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef({x: -100, y: -100}); // rendered position (lerped)
  const target = useRef({x: -100, y: -100}); // latest mouse position
  const raf = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only for devices with a precise pointer (skip touch).
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let shown = false;
    let lastHidden = false;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;

      // Over a "hide zone" (header, search, filter chips, card images) the dot
      // slips behind the content — so it never covers what the user is reading.
      if (el?.closest('[data-cursor-hide]')) {
        dot.style.opacity = '0';
        lastHidden = true;
        return;
      }

      // Seed position on first show — and again whenever it reappears from a
      // hide zone — so it never streaks across the screen.
      if (!shown || lastHidden) {
        shown = true;
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
      }
      lastHidden = false;
      dot.style.opacity = '1';

      const dark = !!el?.closest('[data-cursor-dark]');
      dot.style.backgroundColor = dark ? GOLD : INK;
    };

    const onLeave = () => {
      shown = false;
      dot.style.opacity = '0';
    };

    const onDown = () => {
      dot.style.transform += ' scale(0.6)';
    };

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, {passive: true});
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown, {passive: true});

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
    };
  }, []);

  return (
    <Box
      ref={dotRef}
      aria-hidden
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: INK,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        willChange: 'transform',
        transition: 'opacity 220ms ease, background-color 220ms ease',
        // keep it out of the way on touch devices
        '@media (pointer: coarse)': {display: 'none'},
      }}
    />
  );
}
