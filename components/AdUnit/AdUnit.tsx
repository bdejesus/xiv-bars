'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

import styles from './AdUnit.module.scss';

type MediaQuery = {
  breakpoint: string,
  width: number
}
const breakpoints = {
  desktop: 1200,
  tablet: 800,
  mobile: 480
};

type FormatProps = {
  width?: number,
  height?: number,
  slot: string
}

type FormatsList = {
  fluid: FormatProps,
  skyscraper: FormatProps,
  mediumRect: FormatProps,
  largeRect: FormatProps,
  leaderboard: FormatProps
}

const desktopFormats:FormatsList = {
  fluid: { width: undefined, height: undefined, slot: '2483095747' },
  skyscraper: { width: 160, height: 600, slot: '8212034761' },
  mediumRect: { width: 300, height: 250, slot: '7299242495' },
  largeRect: { width: 336, height: 280, slot: '9103811582' },
  leaderboard: { width: 728, height: 90, slot: '8931155846' }
};

const tabletFormats:FormatsList = {
  ...desktopFormats,
  leaderboard: { width: undefined, height: undefined, slot: '2483095747' },
};

const mobileFormats:FormatsList = {
  ...desktopFormats,
  largeRect: { width: 300, height: 250, slot: '7299242495' },
  leaderboard: { width: 300, height: 50, slot: '7673812865' },
};

interface AdUnitProps {
  id: string,
  className?: string,
  format?: 'fluid' | 'skyscraper' | 'mediumRect' | 'largeRect' | 'leaderboard',
  variant?: 'light' | 'dark'
}

export default function AdUnit({
  id,
  className = '',
  format = 'fluid',
  variant = 'dark'
}:AdUnitProps) {
  const enabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;
  const pathname = usePathname();
  const [mediaQuery, setMediaQuery] = useState<MediaQuery>({
    breakpoint: 'desktop',
    width: breakpoints.desktop
  });
  const [displayFormat, setDisplayFormat] = useState<FormatProps>();

  function initialize() {
    if (enabled || !!displayFormat) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line
      } catch (error) {
        Sentry.captureException(error);
        console.error('Adsense Error: ', (error as Error).message);
      }
    }
  }

  useEffect(() => {
    Object.entries(breakpoints).forEach(([breakpoint, width]) => {
      const mql = window.matchMedia(`(max-width: ${width}px)`);
      if (mql.matches) setMediaQuery({ breakpoint, width });
      mql.onchange = () => setMediaQuery({ breakpoint, width });
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [pathname]);

  useEffect(() => {
    const selectFormat = () => {
      switch (mediaQuery.breakpoint) {
        case 'desktop': return desktopFormats[format];
        case 'tablet': return tabletFormats[format];
        case 'mobile': return mobileFormats[format];
        default: return undefined;
      }
    };
    if (selectFormat) setDisplayFormat(selectFormat());
  }, [pathname, mediaQuery]);

  useEffect(() => {
    if (displayFormat) initialize();
  }, [displayFormat]);

  if (!enabled || !displayFormat) return null;

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{
        width: displayFormat.width,
        height: displayFormat.height
      }}
      id={id}
      data-variant={variant}
    >
      <ins
        id={`${id}-ins`}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: displayFormat.width,
          height: displayFormat.height
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
        data-ad-slot={displayFormat.slot}
        data-ad-format={displayFormat.width ? null : 'auto'}
        data-full-width-responsive={displayFormat.width ? null : 'true'}
      />
    </div>
  );
}
