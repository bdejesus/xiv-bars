/* eslint-disable no-console */
const fs = require('fs');
const fetch = require('node-fetch');
const { outputDir } = require('./config');

async function getMainCommands() {
  const baseUrl = 'https://xivapi.com';

  const mainCommands = await fetch(`${baseUrl}/MainCommand`)
    .then((res) => {
      console.log('Fetching MainCommand actions...');
      return res.json();
    })
    .then((json) => {
      console.log('Writing MainCommand actions...');
      fs.writeFile(
        `${outputDir}/mainCommands.json`,
        JSON.stringify(json.Results),
        () => null
      );
    });
  return mainCommands;
}

module.exports = getMainCommands;
