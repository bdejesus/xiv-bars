import { withSentryConfig } from '@sentry/nextjs';
import i18nConfig from './next-i18next.config.js';

const { i18n } = i18nConfig;

const options = {
  i18n,
  poweredByHeader: false,
  sentry: {
    hideSourceMaps: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xivapi.com'
      },
      {
        protocol: 'https',
        hostname: 'beta.xivapi.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com'
      }
    ],
  },
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
  silent: true
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
const moduleExports = withSentryConfig(options, SentryWebpackPluginOptions);

export default moduleExports;
