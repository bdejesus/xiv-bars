/* eslint-disable no-console */
import fs from 'fs';
import { apiData } from '../app.config.json';

function clean() {
  // Clean up files and recreate directory
  fs.rmdir(apiData, { recursive: true }, () => {
    console.info('🗑 Cleaning up old files...');
    fs.mkdir(apiData, () => {
      console.info(`📂 Creating "${apiData}" directory...`);
    });
  });
}

export default clean;
