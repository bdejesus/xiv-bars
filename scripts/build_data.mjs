// Builds the static game data in `.apiData/` that the app reads at runtime.
//
//   yarn build:data              rebuild only what is derived from local data
//   yarn build:data -- --remote  refetch everything from XIVAPI (slow)

import { promises as fs } from 'fs';

import array from '../lib/utils/array.mjs';
import { localizeKeys } from '../lib/utils/i18n.mjs';
import { parseUpgradeRows, traitRows } from '../lib/utils/upgradableActions.mjs';
import PlayerActions from '../lib/PlayerActions.mjs';
import JobsMeta from '../data/JobsMeta.json' with { type: 'json' };
import BaseClassIDs from '../data/BaseClassIDs.json' with { type: 'json' };
import ActionCategory from '../data/ActionCategory.json' with { type: 'json' };
import { isRemote, paths, throttle } from './lib/config.mjs';
import { log, warn, warningCount, progressBar } from './lib/log.mjs';
import { readJson, writeJson } from './lib/files.mjs';
import { assetUrl, fetchSheet, downloadIcons } from './lib/xivapi.mjs';

const WIKI_URL = 'https://ffxiv.consolegameswiki.com/wiki';

function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

// Every action carries the icon it needs; the id doubles as the filename so
// the app can build `/actionIcons/xivapi/{id}.png` without a lookup table.
function actionIcon(action) {
  return { url: assetUrl(action.Icon.path_hr1), name: `${action.Icon.id}.png` };
}

// ─── Global Actions ──────────────────────────────────────────────────────────

const actionFields = [
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
  ...localizeKeys('Description')
];

// Shared placeholder art the API returns for rows that have no icon of their own.
const PLACEHOLDER_ICON_IDS = [0, 786, 66001];

async function buildActionCategory(category) {
  log(`  🔩 Building ${category} actions...`);

  const { rows } = await fetchSheet(category, { fields: actionFields.join(',') });

  const actions = rows
    .filter(({ fields }) => (
      fields.Name !== '' && !PLACEHOLDER_ICON_IDS.includes(fields.Icon.id)
    ))
    .map(({ row_id: id, fields }, index) => ({
      // Fallback for categories whose rows are unnamed; a real `Name` in
      // `fields` overwrites it.
      Name: `${category} ${index}`,
      ...fields,
      ID: id,
      UrlType: category,
      Prefix: ActionCategory[category].prefix,
      Command: ActionCategory[category].command
    }));

  await downloadIcons(actions.map(actionIcon), { dir: paths.actionIcons });
  await writeJson(`${paths.apiData}/${category}.json`, actions);
}

async function buildGlobalActions() {
  for (const category of Object.keys(ActionCategory)) {
    try {
      await buildActionCategory(category);
    } catch (error) {
      warn(`Could not build ${category}`, error);
    }
  }
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

const jobFields = [
  'Name',
  'Abbreviation',
  'IsLimitedJob',
  'Role',
  ...localizeKeys('Name'),
  ...localizeKeys('Abbreviation')
];

async function fetchJobs() {
  const { rows } = await fetchSheet('ClassJob', { fields: jobFields.join(',') });

  return rows
    .filter(({ row_id: id }) => id >= 2)
    .map(({ row_id: id, fields }) => ({ ...fields, ID: id }))
    .sort(array.byKey('Name'));
}

// JobsMeta holds the curated data the API does not carry (abbreviations the app
// routes on, weapons, lore) and decides which jobs are offered at all — base
// classes are folded into the job they become.
async function buildJobs() {
  const jobs = isRemote
    ? await fetchJobs()
    : await readJson(`${paths.apiData}/Jobs.json`, []);

  const decoratedJobs = JobsMeta
    .filter((job) => !BaseClassIDs.includes(job.ID))
    .map((advancedJob) => ({
      ...jobs.find((job) => job.ID === advancedJob.ID),
      ...advancedJob
    }));

  await writeJson(`${paths.apiData}/Jobs.json`, decoratedJobs);
  return decoratedJobs;
}

// ─── Job Actions ─────────────────────────────────────────────────────────────

// Must run before the job's actions are decorated: PlayerActions reads this
// file to decide which actions are replaced at max level.
async function buildUpgradableActions(job) {
  const filePath = `${paths.apiData}/UpgradableActions.json`;
  const response = await fetch(`${WIKI_URL}/${job.Name}`);
  const upgrades = parseUpgradeRows(traitRows(await response.text()));
  const existing = await readJson(filePath);

  await writeJson(filePath, { ...existing, [job.Abbreviation]: upgrades }, { pretty: true });
}

async function buildJobActions(job) {
  await buildUpgradableActions(job);

  const playerActions = new PlayerActions(job);
  const [allActions, actions, roleActions, pvp] = await Promise.all([
    playerActions.All(),
    playerActions.JobActions(),
    playerActions.RoleActions(),
    playerActions.PvPActions()
  ]);

  await writeJson(`${paths.jobActions}/${job.Abbr}.json`, {
    PvE: { actions, roleActions },
    PvP: pvp
  });

  const progress = progressBar(job.Abbr, allActions.length);
  await downloadIcons(allActions.map(actionIcon), {
    dir: paths.actionIcons,
    progress
  });
  progress.stop();
}

async function buildAllJobActions(jobs) {
  for (const job of jobs) {
    try {
      await buildJobActions(job);
    } catch (error) {
      warn(`Could not build ${job.Abbr} actions`, error);
    }

    await sleep(throttle.betweenJobs);
  }
}

// ─── Entry ───────────────────────────────────────────────────────────────────

async function setup() {
  if (isRemote) {
    log('🔗 Fetching from remote source...');
    log('🧹 Cleaning up old files...');
    await fs.rm(paths.apiData, { recursive: true, force: true });
  } else {
    log('⛓️‍💥 Skipping remote job data. Use `--remote` to refetch it from XIVAPI.');
  }

  log(`📂 Creating "${paths.apiData}" directory...`);
  await fs.mkdir(paths.jobActions, { recursive: true });
}

(async () => {
  try {
    await setup();
    await buildGlobalActions();
    const jobs = await buildJobs();
    if (isRemote) await buildAllJobActions(jobs);
  } catch (error) {
    warn('Build failed', error);
  }

  // Surface partial builds: without this a job that failed to fetch still
  // exits 0 and ships a `.apiData` directory with holes in it.
  if (warningCount() > 0) {
    log(`\n❌ Finished with ${warningCount()} warning(s).`);
    process.exitCode = 1;
  } else {
    log('\n✅ Done.');
  }
})();
