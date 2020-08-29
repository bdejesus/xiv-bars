/* eslint-disable no-console */
const fs = require('fs');
const fetch = require('node-fetch');
const { outputDir } = require('./config');
const ACTION_TYPE = require('../data/actionType');

async function getActions() {
  const baseUrl = 'https://xivapi.com';
  const actionTypes = [
    'MainCommand',
    'MacroIcon',
    'GeneralAction',
    'PetAction',
    'PvPAction'
  ];

  actionTypes.forEach(async (actionSet) => {
    const actions = await fetch(`${baseUrl}/${actionSet}`)
      .then((res) => {
        console.log(`Fetching ${actionSet} actions...`);
        return res.json();
      })
      .then((json) => {
        console.log(`Writing ${actionSet} actions...`);
        const results = json.Results.filter((c) => c.Icon !== '');
        const decoratedResults = results.map((action) => ({
          ...action,
          Prefix: ACTION_TYPE[actionSet]
        }));

        fs.writeFile(
          `${outputDir}/${actionSet}.json`,
          JSON.stringify(decoratedResults),
          () => null
        );
      });
    return actions;
  });
}

module.exports = getActions;
