/* eslint-disable no-console */

import UpgradableActions from '../../data/UpgradableActions.json' assert { type: 'json' };
import { localizeKeys } from '../../lib/utils/i18n.mjs';
import JobsMeta from '../../data/JobsMeta.json' assert { type: 'json' };

const baseUrl = 'https://beta.xivapi.com/api/1';
const fields = [
  'Icon',
  'Name',
  'ClassJob.Abbreviation',
  'ClassJob.Name',
  'IsPvP',
  'IsRoleAction',
  'IsPlayerAction'
].join(',');

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

async function getActions(filters, sheets='Action', precision=3) {
  const query = `(${filters.join(' ')})`;
  const params = jsonToQuery({
    sheets,
    fields,
    transient: 'Description',
    query
  });
  const endpoint = `${baseUrl}/search?${params}`;
  const actions = await fetch(endpoint)
    .catch((error) => console.error(endpoint));
  const json = await actions.json();

  return json.results
    .filter((row) => row.score >= precision)
    .map((row) => ({
      ...row.fields,
      ...row.transient,
      ID: row.row_id,
      score: row.score
    }));
}

export async function listJobActions(job, pvp) {
  const isPvP = pvp ? 1 : 0;
  const isCombat = ['DOM', 'DOW'].includes(job.Discipline);
  const isCrafter = job.Discipline === 'DOH';
  const jobFilters = [`ClassJob.Abbreviation="${job.Abbr}"`];
  if (isCombat) {
    jobFilters.push(`IsPvP=${isPvP}`);
    jobFilters.push('IsPlayerAction=1');
  }
  const actionsReq = await getActions(
    jobFilters,
    isCrafter ? 'CraftAction' : 'Action',
    isCombat ? 3 : 1
  );
  const actions = actionsReq.filter((action) => action.ClassJob?.fields?.Abbreviation === job.Abbr)
  const allNames = actions.map((act) => act.Name);
  const filteredActions = actions
    // Filter by unique Action names
    .filter((current, index) => allNames.indexOf(current.Name) === index)
    // Handle special command for Special Jobs
    .map((action) => {
      if (job.Abbr === 'BLU') {
        return { ...action, Command: 'blueaction' }
      } else return action;
    });

  let classJobActions = [];
  const classJob = JobsMeta.find(({ID}) => ID === job.ClassID);

  if (classJob) {
    const classJobFilters = [`ClassJob.Abbreviation="${classJob.Abbr}"`];
    if (isCombat) classJobFilters.push(`IsPvP=${isPvP}`);
    const classActionRequest = await getActions(
      classJobFilters,
      isCrafter ? 'CraftAction' : 'Action',
      isCombat ? 2 : 1
    );

    classJobActions = classActionRequest.filter((action) => action.ClassJob?.fields?.Abbreviation === classJob.Abbr);
    if (job.ClassActionAllowlist) {
      classJobActions = classJobActions.filter(({ Name }) => job.ClassActionAllowlist?.includes(Name));
    }
  }

  // Are actions upgradable (not usable at max level)
  const upgradableActions = UpgradableActions[job.Abbr] ?? [];
  const jobActions = [...classJobActions, ...filteredActions]
    .map((action) => ({ ...action, upgradable: upgradableActions.includes(action.Name) }));

  return jobActions;
}

export async function listRoleActions(job, pvp) {
  // Skip if job is a crafting job
  if (!['DOM', 'DOW'].includes(job.Discipline)) return [];

  // Construct filters params if PvP or PvE

  const params = pvp
    ? ['ClassJob=85', 'IsRoleAction=1']
    : ['IsRoleAction=1', `ClassJobCategory.${job.Abbr}=1`];

  const roleActions = await getActions(params);
  // Add prefix and additional params to the resulting actions
  const decoratedRoleActions = roleActions
    .map((action) => ({ ...action, Prefix: 'r', UrlType: 'Action', }))

  return decoratedRoleActions;
}

export async function getContent(type, id) {
  const req = `${baseUrl}/${type}/${id}`;
  const content = await fetch(req).then((res) => res.json());
  return content;
}

const moduleExports = {
  listJobActions,
  listRoleActions,
  getContent
};

export default moduleExports;
