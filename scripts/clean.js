/* eslint-disable no-console */
import fs from 'fs';
import { apiData } from '../app.config.json';

function clean() {
  // Clean up files and recreate directory
  fs.rmdir(apiData, { recursive: true }, () => {
    console.log('🗑 Cleaning up old files...');
    fs.mkdir(apiData, () => {
      console.log(`📂 Creating "${apiData}" directory...`);
    });
  });
}

export default clean;
