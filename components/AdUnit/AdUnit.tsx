import { useEffect } from 'react';
import styles from './AdUnit.module.scss';

interface AdUnitProps {
  width?: number,
  height?: number,
  className?: string,
  format?: 'display' | 'feed' | 'fixed-square'
}

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

export default function AdUnit({
  width,
  height,
  className = '',
  format = 'display'
}:AdUnitProps) {
  const enabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE;

  useEffect(() => {
    if (typeof window !== 'undefined' && enabled) {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line
    }
  }, []);

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
