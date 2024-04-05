import i18nConfig from '../../next-i18next.config';

const { i18n } = i18nConfig;

export function localizeKey(key:string, locale:string = i18n.defaultLocale) {
  if (i18n.locales.includes(locale) && locale !== 'en') {
    return `${key}_${locale}`;
  }
  return key;
}

export function translateData(key:string, data:object, locale:string = i18n.defaultLocale) {
  const localeKey = localizeKey(key, locale) as keyof typeof data;
  const translation = data[localeKey];
  return translation;
}

const modules = { localizeKey, translateData };

export default modules;
