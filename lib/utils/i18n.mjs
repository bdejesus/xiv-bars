import i18nConfig from '../../next-i18next.config.js';

const { i18n } = i18nConfig;

export const languages = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
}

function sanitizeName(name) {
  return name?.replaceAll('<If(GreaterThan(PlayerParameter(75),0))>', '')
    .replaceAll(/<Else.*/g, '');
}

export function localizeKey(key, locale = i18n.defaultLocale) {
  if (i18n.locales.includes(locale) && locale !== 'en') {
    return `${key}_${locale}`;
  }
  return key;
}

export function localizeKeys(key) {
  return i18n.locales.map((locale) => localizeKey(key, locale));
}

export function translateData(key, data, locale = i18n.defaultLocale) {
  const localeKey = localizeKey(key, locale);
  const translation = data[localeKey];
  if (translation) return sanitizeName(translation);
  return data[key];
}

export function localizePath(path, locale = i18n.defaultLocale) {
  if (locale !== i18n.defaultLocale) {
    return `/${locale}${path}`;
  }
  return path;
}

const modules = {
  localizeKey,
  localizeKeys,
  translateData,
  localizePath,
  sanitizeName
};

export default modules;
