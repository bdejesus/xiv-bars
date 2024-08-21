import { useEffect } from 'react';

export default function AdUnit({ id }:{id:string}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); // eslint-disable-line
    }
  }, []);

  return (
    <ins
      id={id}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3274093949320222"
      data-ad-slot="2483095747"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
