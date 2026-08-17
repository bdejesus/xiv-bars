import dotenv from 'dotenv';

dotenv.config();

// Single source of truth for the API host. `beta.xivapi.com/api/1` and
// `v2.xivapi.com/api` serve the same schema; the env var picks which one.
export const apiUrl = process.env.XIV_API_URL ?? 'https://v2.xivapi.com/api';

export const paths = {
  apiData: './.apiData',
  jobActions: './.apiData/JobActions',
  actionIcons: './public/actionIcons/xivapi',
  jobIcons: './public/jobIcons'
};

// Milliseconds to wait between requests so a full build stays polite.
export const throttle = {
  betweenJobs: 66,
  betweenIcons: 33
};

// `yarn build:data -- --remote` refetches everything from XIVAPI. Without it,
// only the files derived from local data are rebuilt.
export const isRemote = process.argv.slice(2).includes('--remote');
