import { sendGAEvent } from '@next/third-parties/google'

/* eslint-disable import/prefer-default-export */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// log the pageview with their URL
const pageview = (url) => {
  try {
    sendGAEvent('config', GA_ID, { page_path: url });
  } catch {
    console.info('Analytics Disabled');
  }
};

// log specific events happening.
const event = ({ action, params }) => {
  try {
    sendGAEvent('event', action, params);
  } catch {
    console.info('Analytics Disabled');
  }
};

const exports = { pageview, event };

export default exports;
