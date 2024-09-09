import Script from 'next/script';
import { languages, localizePath } from 'lib/utils/i18n.mjs';
import { domain } from 'lib/host';

interface MetaProps {
  title: string,
  description: string,
  canonicalPath: string,
  image?: string
}

export function renderMeta({
  title,
  description,
  canonicalPath
}:MetaProps) {
  const alternateUrls = Object.keys(languages).reduce((langs, lang) => {
    const path = localizePath(canonicalPath, lang);
    return { ...langs, [lang]: [domain, path].join('') };
  }, {});

  return (
    <>
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
            image: 'https://www.xivbars.com/images/xivbars-thumb.png',
            thumbnailUrl: 'https://www.xivbars.com/images/xivbars-thumb.png',
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

      <meta property="og:url" content={[domain, canonicalPath].join('')} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={[domain, canonicalPath].join('')} />
      { Object.entries(alternateUrls).map(([lang, url]) => (
        <link
          rel="alternate"
          hrefLang={lang}
          href={url as string}
          key={lang}
        />
      ))}
    </>
  );
}

export default renderMeta;
