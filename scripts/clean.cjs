/* eslint-disable no-console */
const fs = require('fs');
const { apiData } = require('../app.config');

function clean() {
  // Clean up files and recreate directory
  fs.rmdir(apiData, { recursive: true }, () => {
    console.log('🗑 Cleaning up old files...');
    fs.mkdir(apiData, () => {
      console.log(`📂 Creating "${apiData}" directory...`);
    });
  });
}

module.exports = clean;
