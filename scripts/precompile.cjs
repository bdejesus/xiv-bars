/* eslint-disable no-console */
const fs = require('fs');
const { apiData } = require('../app.config');
const getActions = require('./actions');

(async () => {
  try {
    fs.rmdir(apiData, { recursive: true }, () => {
      console.log('🗑 Cleaning up old files...');
      fs.mkdir(apiData, () => {
        console.log(`📂 Creating "${apiData}" directory...`);
        getActions();
      });
    });
  } catch (e) {
    console.error(new Error(e));
  }
})();
