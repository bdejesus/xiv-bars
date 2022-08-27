import * as Sentry from '@sentry/nextjs';

function Error({ err }) {
  Sentry.captureException(err);
  return err.message;
}

export default Error;
