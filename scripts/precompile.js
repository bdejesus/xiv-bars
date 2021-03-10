/* eslint-disable no-console */
const getActions = require('./actions');

(async () => {
  try {
    await getActions();
  } catch (e) {
    console.error(new Error(e));
  }
})();
