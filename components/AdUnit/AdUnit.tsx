import { useEffect } from 'react';
import styles from './AdUnit.module.scss';

interface AdUnitProps {
  width?: number,
  height?: number,
  format?: 'display' | 'feed' | 'fixed-square'
}

function Display() {
  return (
    <ins
      className={`${styles.container} adsbygoogle`}
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
      className={`${styles.container} ${styles.inFeed} adsbygoogle`}
      style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
      data-ad-slot="9103811582"
    />
  );
}

export default function AdUnit({
  width,
  height,
  format = 'display'
}:AdUnitProps) {
  const enabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;

  useEffect(() => {
    if ((window as any).adsbygoogle) { // eslint-disable-line
      try {
        (window as any).adsbygoogle.push({}); // eslint-disable-line
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  if (!enabled) return null;

  if (format === 'fixed-square') return <FixedSize height={height} width={width} />;
  return <Display />;
}
