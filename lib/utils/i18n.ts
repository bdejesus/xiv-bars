import i18nConfig from '../../next-i18next.config';

const { i18n } = i18nConfig;

export function localizeKey(key:string, locale:string = 'en') {
  if (i18n.locales.includes(locale) && locale !== 'en') {
    return `${key}_${locale}`;
  }
  return key;
}

const modules = { localizeKey };

export default modules;
