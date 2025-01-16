/* eslint-disable no-console */
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import fs, { promises as fsPromise } from 'fs';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';
import * as HTMLParser from 'fast-html-parser';

import i18nConfig from '../next-i18next.config.js';
import array from '../lib/utils/array.mjs';
import { localizeKeys } from '../lib/utils/i18n.mjs';
import JobAction, { getActionIcon } from '../lib/PlayerActions.mjs';
import Jobs from '../.apiData/Jobs.json' assert {type: 'json' };
import JobsMeta from '../data/JobsMeta.json' assert { type: 'json' };
import BaseClassIDs from '../data/BaseClassIDs.json' assert { type: 'json' };
import ActionCategory from '../data/ActionCategory.json' assert { type: 'json' };

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

const delay = 66;
const delayShort = 33;
const defaultFields = [
  'Icon',
  'Name',
  'Url',
  'Abbreviation',
  ...localizeKeys('Name'),
  ...localizeKeys('Abbreviation'),
];

async function fetchJobsData() {
  const jobColumns = [
    ...defaultFields,
    'IsLimitedJob',
    'Role',
  ];

  const options = jsonToQuery({ fields: jobColumns.join(',') });
  const request = await axios(`${process.env.XIV_API_URL}/sheet/ClassJob?${options}`)
    .catch((error) => console.error(error));
  const json = await request.data;
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
    console.log("🔗 Fetching from remote source...")
    jobs = await fetchJobsData();
  } else {
    console.log("⛓️‍💥 Skipping remote source. Use `--remote` flag to fetch data from remote source.")
  }

  const decoratedJobs = advJobs.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });

  fs.writeFile(`${dest}/Jobs.json`, JSON.stringify(decoratedJobs), () => null);

  if (isRemote) {
    const jobActions = await getJobActions(decoratedJobs);
  }
}

async function fetchIcon(action) {
  const iconUrl = getActionIcon(action);
  const folderPath = `${process.cwd()}/public/actionIcons/xivapi`;
  const fileName = `${action.Icon.id}.png`;

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    } else if (fs.existsSync(folderPath, fileName)) {
      return;
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

async function bulkFetchIcons(actions, progressBar) {
  return actions.reduce(async (promiseAccumulator, action) => {
    const accumulator = await promiseAccumulator;

    try {
      await fetchIcon(action);
      progressBar?.increment();
      await new Promise(resolve => setTimeout(resolve, delayShort));
    } catch (error) {
      console.error(error);
    }
  }, Promise.resolve([]));
}

async function getJobActions(jobs) {
  const upgradableActionsFilePath = `${dest}/UpgradableActions.json`;
  let jsonData = {};

  return jobs.reduce(async (promiseAccumulator, job) => {
    const accumulator = await promiseAccumulator;

    fs.readFile(upgradableActionsFilePath, 'utf8', (err, data) => {
      jsonData = data ? JSON.parse(data) : {};
    });

    try {
      const actions = new JobAction(job);
      const allActions = await actions.All();
      const jobActions = await actions.JobActions();
      const roleActions = await actions.RoleActions();
      const pvpActions = await actions.PvPActions();

      const actionsObj = {
        PvE: { actions: jobActions, roleActions },
        PvP: pvpActions
      }

      await fsPromise.writeFile(`${dest}/JobActions/${job.Abbr}.json`, JSON.stringify(actionsObj), () => null);

      const progressBar = new cliProgress.SingleBar({
        format:`  🧱 Fetching ${colors.yellowBright(job.Abbr)} ${colors.yellowBright('[{bar}]')} {value}/{total} | {percentage}% `,
        barsize: 10,
      }, cliProgress.Presets.rect);

      progressBar.start(allActions.length, 0);

      await bulkFetchIcons(allActions, progressBar);

      progressBar.stop();

      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, Promise.resolve([]));
}

async function getGlobalActions() {
  const actionTypes = Object.keys(ActionCategory);

  actionTypes.forEach(async (actionCategory) => {
    const actionColumns = [
      'Icon',
      'IsPvP',
      'IsRoleAction',
      'IsPlayerAction',
      'IsLimitedJob',
      'ClassJob.Abbreviation',
      'ClassJob.Name',
      'Prefix',
      'UrlType',
      ...localizeKeys('Name'),
      ...localizeKeys('Description'),
    ].join(',');
    const endpoint = `${apiUrl}/sheet/${actionCategory}?fields=${actionColumns}`;
    const actions = await axios(endpoint)
      .then((res) => res.data)
      .then(async (json) => {
        console.log(`  🔩 Building ${actionCategory} actions...`);

        const decoratedActions = json.rows
          .filter((action) => (
            action.fields.Name !== ''
            && ![0, 786, 66001].includes(action.fields.Icon.id)
          ))
          .map((action, index) => ({
            Name: `${actionCategory} ${index}`,
            ...action.fields,
            ID: action.row_id,
            UrlType: actionCategory,
            Prefix: ActionCategory[actionCategory].prefix,
            Command: ActionCategory[actionCategory].command
          }));

        fs.writeFile(
          `${dest}/${actionCategory}.json`,
          JSON.stringify(decoratedActions),
          () => null
        );
        await bulkFetchIcons(decoratedActions);
      })
      .catch((error) => { console.error(error); });

    return actions;
  });
}

(async () => {
  try {
    fs.rm(dest, { recursive: true }, () => {
      console.log('🧹 Cleaning up old files...');
      fs.mkdir(dest, () => {
        console.log(`📂 Creating "${dest}" directory...`);
        fs.mkdir(`${dest}/JobActions`, async () =>{
          await getGlobalActions();
          await getJobs();

        });
      });
    });
  } catch (e) {
    console.error(new Error(e));
  }
})();
