/* eslint-disable no-console */
const fs = require('fs');
const { outputDir } = require('./config');
const getActions = require('./actions');

(async () => {
  try {
    fs.rmdir(outputDir, { recursive: true }, () => {
      console.log('🗑 Cleaning up old files...');
      fs.mkdir(outputDir, () => {
        console.log(`📂 Creating "${outputDir}" directory...`);
        getActions();
      });
    });
  } catch (e) {
    console.error(new Error(e));
  }
})();
