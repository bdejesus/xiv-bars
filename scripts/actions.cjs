/* eslint-disable no-console */
const fs = require('fs');
const fetch = require('node-fetch');
const { apiData } = require('../app.config');
const ACTION_TYPE = require('../lib/actionType');

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

module.exports = getActions;
