import { useEffect } from 'react';
import styles from './AdUnit.module.scss';

interface AdUnitProps {
  width?: number,
  className?: string,
  format?: 'display' | 'feed'
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

function InFeed() {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
      data-ad-slot="5638375142"
      data-ad-format="fluid"
      data-ad-layout-key="-61+bt-5k-al+1lj"
    />
  );
}

export default function AdUnit({
  width, className = '', format = 'display'
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
      style={{ width: width ? `${width}px` : 'unset' }}
    >
      { format === 'feed'
        ? <InFeed />
        : <Display />}
    </div>
  );
}
