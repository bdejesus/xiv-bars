/* eslint-disable no-console */

import { byKey } from 'lib/utils';
import UPGRADABLE_ACTIONS from 'data/UpgradableActions.json';
import Jobs, { ADVANCED_JOBS } from './jobs';

const baseUrl = 'https://xivapi.com';

export async function listJobs() {
  const req = `${baseUrl}/ClassJob`;
  let decoratedJobs;
  try {
    const data = await fetch(req)
      .then((res) => res.json())
      .then((json) => json.Results);

    const jobs = data.sort(byKey('Name'));

    decoratedJobs = ADVANCED_JOBS.map((advancedJob) => {
      const jobData = jobs.find((job) => job.ID === advancedJob.ID);
      return { ...jobData, ...advancedJob };
    });
  } catch (error) {
    console.error(error);
    decoratedJobs = [];
  }

  return decoratedJobs;
}

export async function listJobActions(job) {
  const isPvP = ['DOM', 'DOW'].includes(job.Discipline) ? 'IsPvP=0,' : '';
  const endpoint = `search?indexes=Action,CraftAction&filters=${isPvP}ClassJobTargetID`;
  const actions = await fetch(`${baseUrl}/${endpoint}=${job.ID}`)
    .then((res) => res.json())
    .then(async (actionsRes) => {
      const { Results } = actionsRes;
      const names = Results.map((a) => a.Name);

      const uniqNames = (current, index) => names.indexOf(current.Name) === index;

      const filteredActions = Results
        .filter(uniqNames)
        .map((action) => (job.Abbr === 'BLU'
          ? { ...action, Command: 'blueaction' }
          : action));

      let classJobActions = [];
      if (job.ClassID !== null) {
        const reqUrl = `${baseUrl}/${endpoint}=${job.ClassID}`;
        classJobActions = await fetch(reqUrl)
          .then((res) => res.json())
          .then((json) => json.Results);

        if (job.ClassActionAllowlist) {
          classJobActions = classJobActions
            .filter(({ Name }) => job.ClassActionAllowlist.includes(Name));
        }
      }

      // Are actions upgradable (not usable at max level)
      const upgradableActions = UPGRADABLE_ACTIONS[job.Abbr] ?? [];
      const actionsWithUpgradedInfo = [...classJobActions, ...filteredActions]
        .map((action) => ({ ...action, upgradable: upgradableActions.includes(action.Name) }));

      return actionsWithUpgradedInfo;
    })
    .catch((error) => {
      console.error(error);
      const classJobActions = [];
      const filteredActions = [];
      return [...classJobActions, ...filteredActions];
    });
  return actions;
}

export async function listRoleActions(job) {
  try {
    const roleActions = await fetch(
      `${baseUrl}/Action?ids=${Jobs.ROLE_ACTION_IDS[job.Role].toString()}`
    )
      .then((res) => res.json())
      .then((json) => json.Results);
    return roleActions.map((action) => ({
      ...action, Prefix: 'r', UrlType: 'Action'
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getContent(type, id) {
  const req = `${baseUrl}/${type}/${id}`;
  const content = await fetch(req).then((res) => res.json());
  return content;
}

const moduleExports = {
  listJobs,
  listJobActions,
  listRoleActions,
  getContent
};

export default moduleExports;
