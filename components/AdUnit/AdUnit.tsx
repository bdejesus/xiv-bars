'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './AdUnit.module.scss';

function Display() {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
      data-ad-slot="2483095747"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

function FixedSize({ height = 360, width = 368 }:{height?: number, width?: number}) {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
      data-ad-slot="9103811582"
    />
  );
}

interface AdUnitProps {
  width?: number,
  height?: number,
  className?: string,
  format?: 'display' | 'feed' | 'fixed-square'
}

export default function AdUnit({
  width,
  height,
  className = '',
  format = 'display'
}:AdUnitProps) {
  const enabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;
  const pathname = usePathname();

  useEffect(() => {
    function initializeAdUnit() {
      if (typeof window !== 'undefined' && enabled) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line
      }
    }

    initializeAdUnit();
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{
        width: width ? `${width}px` : 'unset',
        height: height ? `${height}px` : 'unset'
      }}
    >
      { format === 'fixed-square'
        ? <FixedSize height={height} width={width} />
        : <Display />}
    </div>
  );
}
