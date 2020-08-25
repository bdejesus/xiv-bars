/* eslint-disable no-console */
const fs = require('fs');
const fetch = require('node-fetch');
const { outputDir } = require('./config');

async function getMacros() {
  const baseUrl = 'https://xivapi.com';

  const commands = await fetch(`${baseUrl}/MacroIcon`)
    .then((res) => {
      console.log('Fetching Macro actions...');
      return res.json();
    })
    .then((json) => {
      console.log('Writing Macro actions...');
      fs.writeFile(
        `${outputDir}/macros.json`,
        JSON.stringify(json.Results),
        () => null
      );
    });
  return commands;
}

module.exports = getMacros;
