'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useBreakpoint } from 'use-breakpoint';
import * as Sentry from '@sentry/nextjs';

import styles from './AdUnit.module.scss';

const breakpoints = { mobile: 0, tablet: 600, desktop: 800 };

type FormatProps = {
  width?: string,
  height?: string,
  slot: string
}

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
  const { breakpoint } = useBreakpoint(breakpoints);
  const enabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;
  const pathname = usePathname();
  const [displayFormat, setDisplayFormat] = useState<FormatProps|undefined>(undefined);

  const formats = {
    skyscraper: { width: '160px', height: '600px', slot: '8212034761' },
    mediumRect: { width: '300px', height: '250px', slot: '7299242495' },
    largeRect: { width: '336px', height: '280px', slot: '9103811582' },
    leaderboard: { width: '728px', height: '90px', slot: '8931155846' },
    mobileLeaderboard: { width: '300px', height: '50px', slot: '7673812865' },
    fluid: { width: undefined, height: undefined, slot: '2483095747' }
  };

  const desktopFormats = formats;
  const tabletFormats = {
    ...formats,
    leaderboard: { width: undefined, height: undefined, slot: '2483095747' }
  };
  const mobileFormats = {
    ...formats,
    largeRect: formats.mediumRect,
    leaderboard: formats.mobileLeaderboard,
  };

  function initialize() {
    if (typeof window !== 'undefined' && enabled) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line
      } catch (error) {
        Sentry.captureException(error);
        console.error('Adsense Error: ', error);
      }
    }
  }

  useEffect(() => {
    if (displayFormat) initialize();
  }, [pathname, displayFormat]);

  useEffect(() => {
    const selectFormat = () => {
      switch (breakpoint) {
        case 'desktop': return desktopFormats[format];
        case 'tablet': return tabletFormats[format];
        case 'mobile': return mobileFormats[format];
        default: return undefined;
      }
    };

    setDisplayFormat(selectFormat());
  }, [breakpoint]);

  if (enabled && !!displayFormat) {
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
            display: displayFormat.width ? 'inline-block' : 'block',
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
  return null;
}
