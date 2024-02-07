// This file configures the intialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;
const ENV = process.env.NEXT_PUBLIC_ENV;

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    Sentry.replayIntegration()
  ],
  environment: ENV,
  enabled: ENV === 'production',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
