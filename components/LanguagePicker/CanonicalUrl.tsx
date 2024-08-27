import { languages } from 'lib/utils/i18n.mjs';
import { domain } from 'lib/host';

interface Props {
  path?: string
}

export default function CanonicalUrl({ path = '' }:Props) {
  const baseURL = domain;
  const alternateUrls = Object.keys(languages).reduce((langs, lang) => {
    const url = lang === 'en'
      ? [baseURL, path].join('/')
      : [baseURL, lang, path].join('/');
    return { ...langs, [lang]: url };
  }, {});

  return (
    <>
      <link rel="canonical" href={[baseURL, path].join('/')} />

      { Object.entries(alternateUrls).map(([lang, url]) => (
        <link
          rel="alternate"
          hrefLang={lang}
          href={url as string}
          key={lang}
        />
      ))}
      )
    </>
  );
}
