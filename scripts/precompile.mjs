/* eslint-disable no-console */
import dotenv from 'dotenv';
import { writeFile, rm, mkdir } from 'fs';
import Jobs from '../.apiData/Jobs.json' assert {type: 'json' };
import JobsMeta from '../data/JobsMeta.json' assert { type: 'json' };
import BaseClassIDs from '../data/BaseClassIDs.json' assert { type: 'json' };
import ActionCategory from '../data/ActionCategory.json' assert { type: 'json' };
import array from '../lib/utils/array.mjs';
import { localizeKeys } from '../lib/utils/i18n.mjs';
import i18nConfig from '../next-i18next.config.js';
import { listJobActions, listRoleActions } from '../lib/api/actions.mjs';

dotenv.config();

const dest = './.apiData';
const apiURL = 'https://xivapi.com';
const { i18n } = i18nConfig;

const separatorIndex = process.argv.indexOf("--");
const options = process.argv.slice(separatorIndex + 1);
const isRemote = options.includes('--remote');

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

const delay = 300;
const columns = ['ID', 'Icon', 'Name', 'Url'];



async function fetchJobs() {
  const jobColumns = [
    ...columns,
    ...localizeKeys('Name'),
    ...localizeKeys('Abbreviation')
  ];
  const options = jsonToQuery({ private_key: process.env.XIV_API_KEY, columns: jobColumns.join(',') });
  const request = await fetch(`${apiURL}/ClassJob?${options}`);
  const json = await request.json();
  const jobs = json.Results.sort(array.byKey('Name'));
  return jobs;
}

async function getJobs() {
  const jobs = isRemote ? await fetchJobs() : Jobs;
  const advJobs = JobsMeta.filter((job) => !BaseClassIDs.includes(job.ID));
  const decoratedJobs = advJobs.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });

  writeFile(`${dest}/Jobs.json`, JSON.stringify(decoratedJobs), () => null);
  getJobActions(decoratedJobs);
}

async function getJobActions(jobs) {
  return jobs.reduce(async (accumulatorPromise, job) => {
    const accumulator = await accumulatorPromise;

    try {
      const jobActions = await listJobActions(job, false);
      const roleActions = await listRoleActions(job, false);
      const jobPvpActions = await listJobActions(job, true);
      const rolePvPActions = await listRoleActions(job, true);

      console.log(`Writing ${job.Abbr} actions...`);

      const actions = {
        PvE: {
          actions: jobActions,
          roleActions: roleActions
        },
        PvP: {
          actions: jobPvpActions,
          roleActions: rolePvPActions
        }
      }
      writeFile(`${dest}/JobActions/${job.Abbr}.json`, JSON.stringify(actions), () => null);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, Promise.resolve([]));
}

async function getActions() {
  const actionTypes = Object.keys(ActionCategory);

  actionTypes.forEach(async (actionSet) => {
    const actionColumns = [
      ...columns,
      ...ActionCategory[actionSet].columns,
      ...localizeKeys('Name'),
      ...localizeKeys('Description')
    ].join(',');
    const actions = await fetch(`${apiURL}/${actionSet}?columns=${actionColumns}`)
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
        mkdir(`${dest}/JobActions`, () =>{
          getJobs();
          getActions();
        });
      });
    });
  } catch (e) {
    console.error(new Error(e));
  }
})();
