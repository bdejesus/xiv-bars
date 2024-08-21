import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdUnit() {
  const pathname = usePathname();

  function renderAds() {
    if (window) { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
  }

  useEffect(() => {
    renderAds();
  }, [pathname]);

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
