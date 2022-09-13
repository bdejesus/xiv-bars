/* eslint-disable no-console */
import fs from 'fs';
import fetch from 'node-fetch';
import { apiData } from '../app.config.json';
import ACTION_TYPE from '../lib/actionType';

async function getActions() {
  const baseUrl = 'https://xivapi.com';
  const actionTypes = Object.keys(ACTION_TYPE);

  actionTypes.forEach(async (actionSet) => {
    const actions = await fetch(`${baseUrl}/${actionSet}`)
      .then((res) => res.json())
      .then(async (json) => {
        console.log(`Building ${actionSet} actions...`);
        const results = json.Results.filter((c) => c.Icon !== '');

        const decoratedResults = results.map((action) => ({
          ...action,
          Name: action.Name ? action.Name : `${actionSet} ${action.ID}`,
          UrlType: actionSet,
          Prefix: ACTION_TYPE[actionSet].prefix,
          Command: ACTION_TYPE[actionSet].command
        }));

        // await clean();

        fs.writeFile(
          `${apiData}/${actionSet}.json`,
          JSON.stringify(decoratedResults),
          () => null
        );
      })
      .catch((error) => { console.error(error); });
    return actions;
  });
}

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
