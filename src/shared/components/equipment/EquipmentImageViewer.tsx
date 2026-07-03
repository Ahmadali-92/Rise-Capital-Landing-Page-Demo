'use client';

import {ReactNode, useCallback, useRef, useState} from 'react';
import {Expand, X, ZoomIn} from 'lucide-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import type {SxProps, Theme} from '@mui/material/styles';

import SkeletonImage from '@/shared/components/common/SkeletonImage';

const ZOOM = 2.25;
const LENS_SIZE = 150;

type LensState = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function zoomBackground(src: string, lens: LensState, paneSize: number) {
  return {
    backgroundImage: `url(${src})`,
    backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
    backgroundPosition: `${-lens.x * ZOOM + paneSize / 2}px ${-lens.y * ZOOM + paneSize / 2}px`,
    backgroundRepeat: 'no-repeat',
  };
}

interface EquipmentImageViewerProps {
  src: string;
  alt: string;
  containerSx?: SxProps<Theme>;
  children?: ReactNode;
}

export default function EquipmentImageViewer({
  src,
  alt,
  containerSx,
  children,
}: EquipmentImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<LensState | null>(null);
  const [fullOpen, setFullOpen] = useState(false);

  const openFull = useCallback(() => setFullOpen(true), []);
  const closeFull = useCallback(() => setFullOpen(false), []);

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setLens({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    });
  }, []);

  const handleLeave = useCallback(() => setLens(null), []);

  const lensLeft = lens
    ? Math.max(0, Math.min(lens.x - LENS_SIZE / 2, lens.w - LENS_SIZE))
    : 0;
  const lensTop = lens
    ? Math.max(0, Math.min(lens.y - LENS_SIZE / 2, lens.h - LENS_SIZE))
    : 0;

  return (
    <>
      <Box
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={() => {
          if (typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches) {
            openFull();
          }
        }}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          cursor: {xs: 'pointer', md: lens ? 'none' : 'zoom-in'},
          ...containerSx,
        }}
      >
        {/* zIndex 7 — the skeleton covers every overlay (badges, buttons)
            so the whole plate reads as one loading block */}
        <SkeletonImage
          src={src}
          alt={alt}
          draggable={false}
          skeletonZIndex={7}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: 3,
            display: 'block',
            userSelect: 'none',
          }}
        />

        {children}

        {lens ? (
          <Box
            sx={{
              display: {xs: 'none', md: 'block'},
              position: 'absolute',
              left: lensLeft,
              top: lensTop,
              width: LENS_SIZE,
              height: LENS_SIZE,
              borderRadius: 2,
              border: '2px solid #fff',
              boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
              pointerEvents: 'none',
              overflow: 'hidden',
              zIndex: 4,
              ...zoomBackground(src, lens, LENS_SIZE),
            }}
          />
        ) : null}

        <Button
          type="button"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            openFull();
          }}
          startIcon={<Expand size={15} />}
          sx={{
            position: 'absolute',
            bottom: 14,
            left: 16,
            zIndex: 6,
            bgcolor: 'rgba(0,0,0,0.62)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'none',
            px: 1.5,
            py: 0.75,
            borderRadius: 1.5,
            backdropFilter: 'blur(6px)',
            '&:hover': {bgcolor: 'rgba(0,0,0,0.78)'},
          }}
        >
          View full image
        </Button>

        {!lens ? (
          <Box
            sx={{
              display: {xs: 'none', md: 'flex'},
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 3,
              alignItems: 'center',
              gap: 0.5,
              px: 1.25,
              py: 0.5,
              borderRadius: 1.5,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }}
          >
            <ZoomIn size={13} />
            Hover to magnify
          </Box>
        ) : null}
      </Box>

      <Dialog
        open={fullOpen}
        onClose={closeFull}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              m: {xs: 1, sm: 2},
              maxWidth: 'min(96vw, 1400px)',
              width: '100%',
              bgcolor: 'background.default',
              borderRadius: 2,
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.25,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box component="span" sx={{fontSize: 14, fontWeight: 600, pr: 2}}>
            {alt}
          </Box>
          <IconButton onClick={closeFull} aria-label="Close full image" size="small">
            <X size={18} />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: {xs: 1.5, sm: 2.5},
            bgcolor: 'action.hover',
            minHeight: {xs: 280, sm: 400},
          }}
        >
          <Box
            component="img"
            src={src}
            alt={alt}
            sx={{
              maxWidth: '100%',
              maxHeight: {xs: '70vh', sm: '82vh'},
              objectFit: 'contain',
              borderRadius: 2,
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
