/* eslint-disable no-console */
const clean = require('./clean');
const getMainCommands = require('./commands');
const getMacros = require('./macros');

(async () => {
  try {
    await clean();
    await getMainCommands();
    await getMacros();
  } catch (e) {
    console.error(new Error(e));
    process.exit(-1);
  }
})();
