import i18nConfig from '../../next-i18next.config';

const { i18n } = i18nConfig;

function sanitizeName(name?:string) {
  return name?.replaceAll('<If(GreaterThan(PlayerParameter(75),0))>', '')
    .replaceAll(/<Else.*/g, '');
}

export function localizeKey(key:string, locale:string = i18n.defaultLocale) {
  if (i18n.locales.includes(locale) && locale !== 'en') {
    return `${key}_${locale}`;
  }
  return key;
}

export function translateData(key:string, data:object, locale:string = i18n.defaultLocale) {
  const localeKey = localizeKey(key, locale) as keyof typeof data;
  const translation = data[localeKey];
  if (translation) return sanitizeName(translation);
  return data[key as keyof typeof data];
}

export function localizePath(path:string, locale:string = i18n.defaultLocale) {
  if (locale !== i18n.defaultLocale) {
    return `/${locale}${path}`;
  }
  return path;
}

const modules = {
  localizeKey, translateData, localizePath, sanitizeName
};

export default modules;
