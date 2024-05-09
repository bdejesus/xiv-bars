import Script from 'next/script';

export function renderMeta(title: string, description: string) {
  return (
    <>
      <meta name="description" content={description} />
      <meta name="keywords" content="hotbar cross ffxiv endwalker simulator xhb wxhb controller xiv fantasy final tool hotbars simulate planner interface configurations pc ps4 ps5 layouts" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="icons/favicon-144x144.png" />
      <meta name="msvalidate.01" content="1C49C656556D4EC56E43522F297886AF" />

      <link rel="preconnect" href="https://xivapi.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="manifest" href="/manifest.json" />
      <Script
        id="schema"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'CreativeWork',
            name: title,
            description,
            image: 'https://xivbars.bejezus.com/images/xivbars-thumb.png',
            thumbnailUrl: 'https://xivbars.bejezus.com/images/xivbars-thumb.png',
            author: {
              '@type': 'Person',
              name: 'Ben de Jesus',
              disambiguatingDescription: 'Graphic Designer, UI Developer, Photographer',
              knowsAbout: 'Graphic Design, Web Design, HTML, CSS, Javascript, React, Photography',
              sameAs: [
                'https://github.com/bdejesus',
                'https://linkedin.com/in/bendjsf/',
                'https://josebenedicto.com',
                'https://instagram.com/bejezus',
                'https://flickr.com/photos/bendjsf/'
              ]
            }
          })
        }}
      />
    </>
  );
}

export default renderMeta;
