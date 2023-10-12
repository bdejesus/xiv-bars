/* eslint-disable no-console */
import { writeFile, rm, mkdir } from 'fs';
import appConfig from '../app.config.json' assert { type: "json" };
import JobsMeta from '../data/JobsMeta.json' assert { type: "json" };
import BaseClassIDs from '../data/BaseClassIDs.json' assert { type: "json" };
import ActionCategory from '../data/ActionCategory.json' assert { type: "json" };
import array from '../lib/utils/array.mjs';

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
  const actionTypes = Object.keys(ActionCategory);

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
          Prefix: ActionCategory[actionSet].prefix,
          Command: ActionCategory[actionSet].command
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
