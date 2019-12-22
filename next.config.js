/* eslint-disable no-param-reassign */
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const aliases = require('./.alias');

module.exports = withCss(
  withSass({
    poweredByHeader: false,
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 2,
      localsConvention: 'dashes',
      localIdentName: '[folder]-[local]--[hash:base64:5]',
      sourceMap: true
    },
    webpack(config, { isServer }) {
      const { alias } = config.resolve;
      config.resolve.alias = {
        ...alias,
        ...aliases
      };

      if (!isServer) {
        config.node = {
          fs: 'empty',
          net: 'empty',
          tls: 'empty'
        };
      }

      // Further custom configuration here
      return config;
    },
  })
);
