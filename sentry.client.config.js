// This file configures the intialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;
const ENV = process.env.NEXT_PUBLIC_ENV;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENV,
  enabled: ENV === 'production',
  tracesSampleRate: 0.1
});
