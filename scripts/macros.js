/* eslint-disable no-console */
const fs = require('fs');
const fetch = require('node-fetch');
const { outputDir } = require('./config');
const ACTION_TYPE = require('../data/actionType');

async function getMacros() {
  const baseUrl = 'https://xivapi.com';

  const commands = await fetch(`${baseUrl}/MacroIcon`)
    .then((res) => {
      console.log('Fetching Macro actions...');
      return res.json();
    })
    .then((json) => {
      console.log('Writing Macro actions...');
      const results = json.Results.filter((c) => c.Icon !== '');
      const decoratedResults = results.map((macro, index) => ({
        ...macro,
        Name: `Macro ${index + 1}`,
        Prefix: ACTION_TYPE.MACRO
      }));

      fs.writeFile(
        `${outputDir}/macros.json`,
        JSON.stringify(decoratedResults),
        () => null
      );
    });
  return commands;
}

module.exports = getMacros;
