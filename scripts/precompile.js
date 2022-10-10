/* eslint-disable no-console */
const fetch = require('node-fetch');
const { writeFile, rm, mkdir } = require('fs');
const appConfig = require('../app.config.json');
const JobsMeta = require('../data/JobsMeta.json');
const BaseClassIDs = require('../data/BaseClassIDs.json');
const ACTION_TYPE = require('../data/ActionType.json');
const array = require('../lib/utils/array.js');

const { apiData } = appConfig;
const apiURL = 'https://xivapi.com';

async function getJobs() {
  const req = `${apiURL}/ClassJob`;
  const request = await fetch(req);
  const data = await request.json();
  const jobs = data.Results.sort(array.byKey('Name'));
  const advJobs = JobsMeta.filter((job) => !BaseClassIDs.includes(job.ID));
  const decoratedJobs = advJobs.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });

  writeFile(`${apiData}/Jobs.json`, JSON.stringify(decoratedJobs), () => null);
}

async function getActions() {
  const actionTypes = Object.keys(ACTION_TYPE);

  actionTypes.forEach(async (actionSet) => {
    const actions = await fetch(`${apiURL}/${actionSet}`)
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

        writeFile(
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
    rm(apiData, { recursive: true }, () => {
      console.log('🗑 Cleaning up old files...');
      mkdir(apiData, () => {
        console.log(`📂 Creating "${apiData}" directory...`);
        getJobs();
        getActions();
      });
    });
  } catch (e) {
    console.error(new Error(e));
  }
})();
