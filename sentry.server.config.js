// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN;
const ENV = process.env.NEXT_PUBLIC_ENV;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENV,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 1.0
});
