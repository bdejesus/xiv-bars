const PROD = 'production';
const STAGE = 'staging';
const DEV = 'development';

function getHost() {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case DEV: return 'http://localhost:3000';
    case STAGE: return 'https://staging-xivbars.herokuapp.com';
    case PROD: return 'https://xivbars.bejezus.com';
    default: return 'https://xivbars.bejezus.com';
  }
}

export const root = getHost();

const moduleExports = { host: getHost() };

export default moduleExports;
