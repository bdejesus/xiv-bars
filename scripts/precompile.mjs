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

function jsonToQuery(json) {
  return Object.entries(json)
    .reduce((items, [key, value]) => {
      const encodedKey = encodeURI(key);
      const encodedValue = encodeURI(value);
      if (encodedValue !== 'undefined') items.push(`${encodedKey}=${encodedValue}`);
      return items;
    }, [])
    .join('&');
}

const columns = ['ID', 'Icon', 'IconHD', 'Name', 'Name_ja', 'Description', 'Description_ja', 'Url', 'UrlType'];

async function getJobs() {
  const options = jsonToQuery({ private_key: process.env.XIV_API_KEY, columns: [...columns, 'Abbreviation', 'Abbreviation_ja'].join(',') });
  const request = await fetch(`${apiURL}/ClassJob?${options}`);
  const json = await request.json();
  const jobs = json.Results.sort(array.byKey('Name'));
  const advJobs = JobsMeta.filter((job) => !BaseClassIDs.includes(job.ID));
  const decoratedJobs = advJobs.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });

  writeFile(`${dest}/Jobs.json`, JSON.stringify(decoratedJobs), () => null);
}

async function getActions() {
  const actionTypes = Object.keys(ActionCategory);

  actionTypes.forEach(async (actionSet) => {
    const actions = await fetch(`${apiURL}/${actionSet}?columns=${actionSet.columns?.join(',') || columns.join(',')}`)
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
