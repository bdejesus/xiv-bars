import { useEffect } from 'react';
import styles from './AdUnit.module.scss';

interface AdUnitProps {
  id: string,
  width?: number,
  className?: string
}

export default function AdUnit({ id, width, className = '' }:AdUnitProps) {
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
      <ins
        id={id}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3274093949320222"
        data-ad-slot="2483095747"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
