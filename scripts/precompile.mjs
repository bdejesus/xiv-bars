/* eslint-disable no-console */
import dotenv from 'dotenv';
import { writeFile, rm, mkdir } from 'fs';
import JobsMeta from '../data/JobsMeta.json' assert { type: 'json' };
import BaseClassIDs from '../data/BaseClassIDs.json' assert { type: 'json' };
import ActionCategory from '../data/ActionCategory.json' assert { type: 'json' };
import array from '../lib/utils/array.mjs';

dotenv.config();

const dest = './.apiData';
const apiURL = 'https://xivapi.com';
const apiOptions = `private_key=${process.env.XIV_API_KEY}`;
const requestDelay = 300;

async function getJobData(job) {
  console.log(`Fetching ${job.Name}...`);
  const requestURL = `${apiURL}/ClassJob/${job.ID}?${apiOptions}`;
  const request = await fetch(requestURL);
  const json = await request.json();
  const selectKeys = ['ID', 'Abbreviation', 'Abbreviation_ja', 'ClassJobParent', 'Name', 'Name_ja'];
  const jobData = Object.fromEntries(
    Object.entries(json).filter(([key]) => selectKeys.includes(key))
  );

  return jobData;
}

async function getJobs() {
  const request = await fetch(`${apiURL}/ClassJob?${apiOptions}`);
  const json = await request.json();
  const jobs = json.Results.sort(array.byKey('Name'));
  const advJobs = JobsMeta.filter((job) => !BaseClassIDs.includes(job.ID));
  const decoratedJobs = advJobs.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });
  const jobDetails = [];

  await decoratedJobs.reduce(async (collectPromise, job) => {
    await collectPromise;

    try {
      const jobData = await getJobData(job);
      jobDetails.push(jobData);
    } catch (error) {
      console.error(error);
      return collectPromise;
    }

    return new Promise((resolve) => { setTimeout(resolve, requestDelay); });
  }, Promise.resolve([]));

  const detailedJobs = decoratedJobs.map((job) => {
    const jobData = jobDetails.find(({ ID }) => ID === job.ID);
    return { ...jobData, ...job };
  });

  writeFile(`${dest}/Jobs.json`, JSON.stringify(detailedJobs), () => null);
}

async function getActions() {
  const actionTypes = Object.keys(ActionCategory);

  actionTypes.forEach(async (actionSet) => {
    const actions = await fetch(`${apiURL}/${actionSet}?${apiOptions}`)
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
          `${dest}/${actionSet}.json`,
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
    rm(dest, { recursive: true }, () => {
      console.log('🗑 Cleaning up old files...');
      mkdir(dest, () => {
        console.log(`📂 Creating "${dest}" directory...`);
        getJobs();
        getActions();
      });
    });
  } catch (e) {
    console.error(new Error(e));
  }
})();
