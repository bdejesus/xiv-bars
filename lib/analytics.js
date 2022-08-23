/* eslint-disable import/prefer-default-export */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// log the pageview with their URL
const pageview = (url) => {
  window.gtag('config', GA_ID, { page_path: url });
};

// log specific events happening.
const event = ({ action, params }) => {
  window.gtag('event', action, params);
};

const exports = { pageview, event };

export default exports;
