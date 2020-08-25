/* eslint-disable no-console */
const fs = require('fs');
const fetch = require('node-fetch');
const { outputDir } = require('./config');
const ACTION_TYPE = require('../data/actionType');

async function getMainCommands() {
  const baseUrl = 'https://xivapi.com';

  const mainCommands = await fetch(`${baseUrl}/MainCommand`)
    .then((res) => {
      console.log('Fetching MainCommand actions...');
      return res.json();
    })
    .then((json) => {
      console.log('Writing MainCommand actions...');
      const results = json.Results.filter((m) => m.Icon !== '');

      const decoratedResults = results.map((command) => (
        { ...command, Prefix: ACTION_TYPE.MACRO }
      ));

      fs.writeFile(
        `${outputDir}/mainCommands.json`,
        JSON.stringify(decoratedResults),
        () => null
      );
    });
  return mainCommands;
}

module.exports = getMainCommands;
