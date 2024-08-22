'use client';

import { useEffect, } from 'react';
import { usePathname } from 'next/navigation';
import styles from './AdUnit.module.scss';

interface AdUnitProps {
  id: string,
  className?: string,
  format?: 'fluid' | 'skyscraper' | 'largeRect' | 'leaderboard'
}

export default function AdUnit({
  id,
  className = '',
  format = 'fluid'
}:AdUnitProps) {
  const enabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;
  const pathname = usePathname();
  const formats = {
    skyscraper: { width: 160, height: 600, slot: '8212034761' },
    largeRect: { width: 336, height: 280, slot: '9103811582' },
    leaderboard: { width: 728, height: 90, slot: '8931155846' },
    mobileLeaderboard: { width: 300, height: 50, slot: '7673812865' },
    fluid: { width: undefined, height: undefined, slot: '2483095747' }
  };
  const { width, height, slot } = formats[format];
  const displayStyle = { display: format === 'fluid' ? 'block' : 'inline-block' };
  const sizeStyle = format === 'fluid' ? {} : { width: `${width}px`, height: `${height}px` };

  function initialize() {
    if (typeof window !== 'undefined' && enabled) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line
      } catch (error) {
        console.error('Adsense Error: ', error);
      }
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    initialize();
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div
      className={`${styles.container} ${className}`}
      style={sizeStyle}
      id={id}
    >
      <ins
        id={`${id}-ins`}
        className="adsbygoogle"
        style={{ ...displayStyle, ...sizeStyle }}
        data-format={JSON.stringify({ f: formats[format], sizeStyle })}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
        data-ad-slot={slot}
        data-ad-format={format === 'fluid' ? 'auto' : null}
        data-full-width-responsive={format === 'fluid' ? 'true' : null}
      />
    </div>
  );
}
