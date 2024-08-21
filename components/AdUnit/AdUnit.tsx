import Script from 'next/script';

export default function AdUnit({ id }:{id:string}) {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3274093949320222"
        data-ad-slot="2483095747"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={id}>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </Script>
    </>
  );
}
