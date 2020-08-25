/* eslint-disable no-console */
const fs = require('fs');
const { outputDir } = require('./config');

function clean() {
  // Clean up files and recreate directory
  fs.rmdir(outputDir, { recursive: true }, () => {
    console.log('🗑 Cleaning up old files...');
    fs.mkdir(outputDir, () => {
      console.log(`📂 Creating "${outputDir}" directory...`);
    });
  });
}

module.exports = clean;
