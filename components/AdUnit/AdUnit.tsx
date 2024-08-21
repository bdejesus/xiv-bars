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
      data-ad-client="ca-pub-3274093949320222"
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
      data-ad-client="ca-pub-3274093949320222"
      data-ad-slot="5638375142"
      data-ad-format="fluid"
      data-ad-layout-key="-61+bt-5k-al+1lj"
    />
  );
}

export default function AdUnit({
  width, className = '', format = 'display'
}:AdUnitProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line
    }
  }, []);

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
