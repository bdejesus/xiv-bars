import Script from 'next/script';
import { languages, localizePath } from 'lib/utils/i18n.mjs';
import { domain } from 'lib/host';

interface MetaProps {
  title: string,
  description: string,
  currentPath: string,
  image?: string
}

export function renderMeta({
  title,
  description,
  currentPath
}:MetaProps) {
  const alternateUrls = Object.keys(languages).reduce((langs, lang) => {
    const path = localizePath(currentPath, lang);
    return { ...langs, [lang]: [domain, path].join('') };
  }, {});

  return (
    <>
      <meta name="description" content={description} />
      <meta name="keywords" content="hotbar cross ffxiv endwalker simulator xhb wxhb controller xiv fantasy final tool hotbars simulate planner interface configurations pc ps4 ps5 layouts keymaps keymapping keybinds keybindings" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="icons/favicon-144x144.png" />
      <meta name="msvalidate.01" content="1C49C656556D4EC56E43522F297886AF" />

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

      <meta property="og:url" content={[domain, currentPath].join('')} />
      <meta property="og:type" content="website" />

      <link rel="preconnect" href="https://xivapi.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="manifest" href="/manifest.json" />

      <link rel="canonical" href={[domain, currentPath].join('')} />

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
