/* eslint-disable no-console */
import dotenv from 'dotenv';
import path from 'path';
import { promises as fsPromise } from 'fs';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';
import * as HTMLParser from 'fast-html-parser';

import i18nConfig from '../next-i18next.config.js';
import array from '../lib/utils/array.mjs';
import { localizeKeys } from '../lib/utils/i18n.mjs';
import JobAction, { getActionIcon } from '../lib/PlayerActions.mjs';
import Jobs from '../.apiData/Jobs.json' with {type: 'json' };
import JobsMeta from '../data/JobsMeta.json' with { type: 'json' };
import BaseClassIDs from '../data/BaseClassIDs.json' with { type: 'json' };
import ActionCategory from '../data/ActionCategory.json' with { type: 'json' };

dotenv.config();

const apiUrl = 'https://beta.xivapi.com/api/1';
const dest = './.apiData';
const { i18n } = i18nConfig;

// Read command arguments
const separatorIndex = process.argv.indexOf('--');
const parsedArgs = process.argv.slice(separatorIndex + 1);
const isRemote = parsedArgs.includes('--remote');

// ─── Utilities ──────────────────────────────────────────────────────────────

function buildQuery(params) {
  return new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined)
  ).toString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// fetch requests throttle settings
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

// ─── Icon Fetching ───────────────────────────────────────────────────────────

async function fetchIcon(action) {
  const iconUrl = getActionIcon(action);
  const folderPath = `${process.cwd()}/public/actionIcons/xivapi`;
  const fileName = `${action.Icon.id}.png`;
  const filePath = path.join(folderPath, fileName);

  await fsPromise.mkdir(folderPath, { recursive: true });

  const response = await fetch(iconUrl, {
    headers: { Accept: 'image/jpeg, image/png, image/webp' },
  });
  const buffer = await response.arrayBuffer();
  await fsPromise.writeFile(filePath, Buffer.from(buffer));
}

async function bulkFetchIcons(actions, progressBar) {
  for (const action of actions) {
    try {
      await fetchIcon(action);
      progressBar?.increment();
      await sleep(delayShort);
    } catch (error) {
      console.error(error);
    }
  }
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

async function fetchJobsData() {
  const jobColumns = [...defaultFields, 'IsLimitedJob', 'Role'];
  const query = buildQuery({ fields: jobColumns.join(',') });
  const response = await fetch(`${process.env.XIV_API_URL}/sheet/ClassJob?${query}`)
    .catch((error) => { console.error(error); });
  const data = await response.json();

  return data.rows
    .filter((row) => row.row_id >= 2)
    .map(({ row_id, fields }) => ({ ...fields, ID: row_id }))
    .sort(array.byKey('Name'));
}

async function getJobs() {
  let jobs = Jobs;
  const advJobs = JobsMeta.filter((job) => !BaseClassIDs.includes(job.ID));

  if (isRemote) {
    console.log('🔗 Fetching from remote source...');
    jobs = await fetchJobsData();
  } else {
    console.log('⛓️‍💥 Skipping remote source. Use `--remote` flag to fetch data from remote source.');
  }

  const decoratedJobs = advJobs.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });

  await fsPromise.writeFile(`${dest}/Jobs.json`, JSON.stringify(decoratedJobs));

  if (isRemote) {
    await getJobActions(decoratedJobs);
  }
}

// ─── Job Actions ─────────────────────────────────────────────────────────────

async function fetchUpgradableActionsData(job) {
  if (!job) return;

  const lodestoneURL = `https://ffxiv.consolegameswiki.com/wiki/${job.Name}`;
  const filePath = `${dest}/UpgradableActions.json`;

  let jsonData = {};
  try {
    const raw = await fsPromise.readFile(filePath, 'utf8');
    jsonData = raw ? JSON.parse(raw) : {};
  } catch {
    // file may not exist yet; start fresh
  }

  const data = await fetch(lodestoneURL);
  const content = await data.text();
  const actions = HTMLParser.parse(content).querySelectorAll('.traits.table tr');

  const rows = actions
    .map((row) => row.lastChild.text)
    .filter((row) => row.match(/^Upgrades/) && !row.match(/^Upgrades.*when|.*executed by|.*while under|.*is upgraded/))
    .map((text) => {
      if (text.match(/respectively/)) {
        return text.split(' to ')[0].replace('Upgrades ', '').split(' and ');
      }
      return text
        .replaceAll(/^Upgrades |\n/g, '')
        .split(' and ')
        .map((t) => t.split(' to ')[0])
        .flat();
    })
    .flat()
    .filter((text) => !text.match(/increases the|the potency of/));

  const newData = JSON.stringify({ ...jsonData, [job.Abbreviation]: rows }, null, 2);
  await fsPromise.writeFile(`${dest}/UpgradableActions.json`, newData);
  return newData;
}

async function processJob(job) {
  await fetchUpgradableActionsData(job);

  const actions = new JobAction(job);
  const [allActions, jobActions, roleActions, pvpActions] = await Promise.all([
    actions.All(),
    actions.JobActions(),
    actions.RoleActions(),
    actions.PvPActions(),
  ]);

  const actionsObj = {
    PvE: { actions: jobActions, roleActions },
    PvP: pvpActions,
  };

  await fsPromise.writeFile(`${dest}/JobActions/${job.Abbr}.json`, JSON.stringify(actionsObj));

  const progressBar = new cliProgress.SingleBar({
    format: `  🧱 Fetching ${colors.yellowBright(job.Abbr)} ${colors.yellowBright('[{bar}]')} {value}/{total} | {percentage}% `,
    barsize: 10,
  }, cliProgress.Presets.rect);

  progressBar.start(allActions.length, 0);
  await bulkFetchIcons(allActions, progressBar);
  progressBar.stop();

  await sleep(delay);
}

async function getJobActions(jobs) {
  for (const job of jobs) {
    try {
      await processJob(job);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }
}

// ─── Global Actions ──────────────────────────────────────────────────────────

async function fetchActionCategory(actionCategory) {
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
  const response = await fetch(endpoint);
  const data = await response.json();

  console.log(`  🔩 Building ${actionCategory} actions...`);

  const decoratedActions = data.rows
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
      Command: ActionCategory[actionCategory].command,
    }));

  await bulkFetchIcons(decoratedActions);
  await fsPromise.writeFile(`${dest}/${actionCategory}.json`, JSON.stringify(decoratedActions));
}

async function getGlobalActions() {
  for (const actionCategory of Object.keys(ActionCategory)) {
    try {
      await fetchActionCategory(actionCategory);
    } catch (error) {
      console.error(`Error fetching ${actionCategory}`, error);
    }
  }
}

// ─── Setup & Entry ───────────────────────────────────────────────────────────

async function setup() {
  if (isRemote) {
    console.log('🧹 Cleaning up old files...');
    await fsPromise.rm(dest, { recursive: true, force: true });

    console.log(`📂 Creating "${dest}" directory...`);
    await fsPromise.mkdir(dest);
    await fsPromise.mkdir(`${dest}/JobActions`);
  } else {
    await fsPromise.mkdir(dest, { recursive: true });
    await fsPromise.mkdir(`${dest}/JobActions`, { recursive: true });
  }
}

(async () => {
  try {
    await setup();
    await getGlobalActions();
    await getJobs();
  } catch (e) {
    console.error(new Error(e));
  }
})();
