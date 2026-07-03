'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import type {SxProps, Theme} from '@mui/material/styles';

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
  loading?: 'lazy' | 'eager';
  /** Raise to cover sibling overlays (badges, buttons) while loading. */
  skeletonZIndex?: number;
  /** Applied to the <img>. If it sets `transition`, include `opacity` in it. */
  sx?: SxProps<Theme>;
}

// An <img> that hides behind a shimmer skeleton until fully loaded, then fades
// in — photos load progressively (top-down) and look broken half-rendered.
// The parent must be position: relative + overflow: hidden (the skeleton fills
// it edge to edge).
export default function SkeletonImage({
  src,
  alt,
  className,
  draggable,
  loading,
  skeletonZIndex = 1,
  sx,
}: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: skeletonZIndex,
            overflow: 'hidden',
            bgcolor: 'rgba(0,0,0,0.1)',
            'html.dark &': {bgcolor: 'rgba(255,255,255,0.08)'},
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              transform: 'translateX(-100%)',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)',
              animation: 'rcImgShimmer 1.2s ease-in-out infinite',
            },
            'html.dark &::after': {
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            },
            '@keyframes rcImgShimmer': {to: {transform: 'translateX(100%)'}},
            '@media (prefers-reduced-motion: reduce)': {
              '&::after': {animation: 'none'},
            },
          }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        className={className}
        draggable={draggable}
        loading={loading}
        // cached images can be complete before React attaches onLoad
        ref={(el: HTMLImageElement | null) => {
          if (el?.complete) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        sx={[
          {transition: 'opacity 420ms ease'},
          ...(Array.isArray(sx) ? sx : [sx]).filter(Boolean),
          {opacity: loaded ? 1 : 0},
        ]}
      />
    </>
  );
}
