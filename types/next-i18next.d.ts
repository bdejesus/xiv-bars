// Ambient declarations for next-i18next v16 Pages Router sub-paths.
// Required because moduleResolution: "node" cannot resolve .d.mts/.d.cts files
// from package.json exports — TypeScript only finds these via explicit paths here.

declare module 'next-i18next/pages/serverSideTranslations' {
  type SSRConfig = {
    _nextI18Next?: {
      initialI18nStore: unknown;
      initialLocale: string;
      ns: string[];
      userConfig: unknown;
    };
  };
  export function serverSideTranslations(
    initialLocale: string,
    namespacesRequired?: string[] | null,
    configOverride?: object | null,
    extraLocales?: string[] | false
  ): Promise<SSRConfig>;
}

declare module 'next-i18next/pages' {
  import type { ComponentType } from 'react';
  export type UserConfig = {
    i18n: {
      defaultLocale: string;
      locales: string[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  export function appWithTranslation<T extends object>(
    App: ComponentType<T>,
    configOverride?: UserConfig | null
  ): ComponentType<T>;
}
