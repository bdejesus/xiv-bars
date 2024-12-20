/* eslint-disable import/prefer-default-export */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// log the pageview with their URL
const pageview = (url) => {
  try {
    window.gtag('config', GA_ID, { page_path: url });
  } catch {
    console.info('Analytics is disabled');
  }
};

// log specific events happening.
const event = ({ action, params }) => {
  try {
    window.gtag('event', action, params);
  } catch {
    console.info('Analytics is disabled');
  }
};

const exports = { pageview, event };

export default exports;
