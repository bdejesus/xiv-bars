/* eslint-disable no-console */
import fs from 'fs';
import { apiData } from '../app.config.json';
import getActions from './actions';

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
