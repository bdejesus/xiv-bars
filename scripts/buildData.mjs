/* eslint-disable no-console */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
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
const apiUrl = 'https://beta.xivapi.com/api/1'
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
const delayShort = 100;
const columns = ['Icon', 'Name', 'Url', 'Abbreviation'];

async function fetchJobs() {
  const jobColumns = [
    ...columns,
    ...localizeKeys('Name'),
    ...localizeKeys('Abbreviation'),
    'IsLimitedJob',
    'Role',
  ];

  const options = jsonToQuery({ fields: jobColumns.join(',') });
  const request = await fetch(`${apiUrl}/sheet/ClassJob?${options}`)
    .catch((error) => console.error(error));
  const json = await request.json();
  const jobs = json.rows
    .filter((row) => row.row_id >= 2)
    .map(({ row_id, fields }) => ({ ...fields, ID: row_id }))
    .sort(array.byKey('Name'));
  return jobs;
}

async function getJobs() {
  let jobs = Jobs;
  const advJobs = JobsMeta.filter((job) => !BaseClassIDs.includes(job.ID));

  if (isRemote) {
    console.log("🔗 Fetching remote source...")
    jobs = await fetchJobs();
  } else {
    console.log("⛓️‍💥 Skipping remote source. Use `--remote` flag to fetch data from remote source.")
  }

  const decoratedJobs = advJobs.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });

  writeFile(`${dest}/Jobs.json`, JSON.stringify(decoratedJobs), () => null);

  if (isRemote) {
    const jobActions = await getJobActions(decoratedJobs);
  }
}

async function fetchIcon(action) {
  const iconUrl = `${apiUrl}/asset?path=${action.Icon.path_hr1}&format=png`;
  const folderPath = `${process.cwd()}/public/actionIcons/xivapi`;
  const fileName = `${action.ID}.png`;

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const response = await axios.get(iconUrl, { responseType: 'stream' });
    // Define the file path
    const filePath = path.join(folderPath, fileName);
    // Save the image to the local folder
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    // Return a Promise that resolves when the writing is done
    await new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`Image saved to ${filePath}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Something went wrong', error);
  }
}

async function bulkFetchIcons(actions) {
  console.log("   ⌙ Fetching Icons...");
  return actions.reduce(async (promiseAccumulator, action) => {
    const accumulator = await promiseAccumulator;

    try {
      await fetchIcon(action);
      await new Promise(resolve => setTimeout(resolve, delayShort));
    } catch (error) {
      console.error(error);
    }
  }, Promise.resolve([]));
}

async function getJobActions(jobs) {
  return jobs.reduce(async (promiseAccumulator, job) => {
    const accumulator = await promiseAccumulator;

    try {
      const jobActions = await listJobActions(job, false);
      const roleActions = await listRoleActions(job, false);
      const jobPvPActions = await listJobActions(job, true);
      const rolePvPActions = await listRoleActions(job, true);

      console.log(`🧱 Writing ${job.Abbr} actions...`);
      const actions = {
        PvE: {
          actions: jobActions,
          roleActions: roleActions
        },
        PvP: {
          actions: jobPvPActions,
          roleActions: rolePvPActions
        }
      }
      writeFile(`${dest}/JobActions/${job.Abbr}.json`, JSON.stringify(actions), () => null);

      await bulkFetchIcons([jobActions, roleActions, jobPvPActions, rolePvPActions].flat());
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, Promise.resolve([]));
}

async function getOtherActions() {
  const actionTypes = Object.keys(ActionCategory);

  actionTypes.forEach(async (actionCategory) => {
    const actionColumns = [
      ...localizeKeys('Name'),
      ...localizeKeys('Description'),
      'Icon',
    ].join(',');
    const endpoint = `${apiUrl}/sheet/${actionCategory}?fields=${actionColumns}`;
    const actions = await fetch(endpoint)
      .then((res) => res.json())
      .then(async (json) => {
        console.log(`🔩 Building ${actionCategory} actions...`);
        const decoratedActions = json.rows
          .filter((action) => action.fields.Name !== '' && action.fields.Name !== 'Sic')
          .map((action) => ({
            ...action.fields,
            ID: action.row_id,
            UrlType: actionCategory,
            Prefix: ActionCategory[actionCategory].prefix,
            Command: ActionCategory[actionCategory].command
          }));

        writeFile(
          `${dest}/${actionCategory}.json`,
          JSON.stringify(decoratedActions),
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
      console.log('🧹 Cleaning up old files...');
      mkdir(dest, () => {
        console.log(`📂 Creating "${dest}" directory...`);
        mkdir(`${dest}/JobActions`, () =>{
          getJobs();
          getOtherActions();
        });
      });
    });
  } catch (e) {
    console.error(new Error(e));
  }
})();
