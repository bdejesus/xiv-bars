/* eslint-disable no-console */
const clean = require('./clean');
const getActions = require('./actions');

(async () => {
  try {
    await clean();
    await getActions();
  } catch (e) {
    console.error(new Error(e));
    process.exit(-1);
  }
})();
