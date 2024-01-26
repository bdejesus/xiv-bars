/* eslint-disable no-console */

import UpgradableActions from 'data/UpgradableActions.json';
import RoleActionIDs from 'data/RoleActionIDs.json';

import type { ClassJobProps } from 'types/ClassJob';
import type { ActionProps } from 'types/Action';

const baseUrl = 'https://xivapi.com';

export async function listJobActions(job: ClassJobProps, pvp?:0|1) {
  const isPvP = pvp || 0;
  const filters = ['DOM', 'DOW'].includes(job.Discipline) ? `IsPvP=${isPvP},` : '';
  const endpoint = `search?indexes=Action,CraftAction&filters=${filters}ClassJobTargetID`;
  const actions = await fetch(`${baseUrl}/${endpoint}=${job.ID}`)
    .then((res) => res.json())
    .then(async (actionsRes) => {
      const { Results } = actionsRes;
      const names = Results.map((act: ActionProps) => act.Name);

      const uniqNames = (current: ActionProps, index: number) => names.indexOf(current.Name) === index;

      const filteredActions = Results
        .filter(uniqNames)
        .map((action: ActionProps) => (job.Abbr === 'BLU'
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
            .filter(({ Name }: { Name: string }) => job.ClassActionAllowlist?.includes(Name));
        }
      }

      // Are actions upgradable (not usable at max level)
      const jobKey = job.Abbr as keyof typeof UpgradableActions;
      const upgradableActions = UpgradableActions[jobKey] ?? [];
      const actionsWithUpgradedInfo = [...classJobActions, ...filteredActions]
        .map((action) => ({ ...action, upgradable: upgradableActions.includes(action.Name) }));

      return actionsWithUpgradedInfo;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
  return actions;
}

export async function listRoleActions(job: ClassJobProps) {
  try {
    if (!job.Role) return [];
    const actionKey = job.Role as keyof typeof RoleActionIDs;
    const request = await fetch(
      `${baseUrl}/Action?ids=${RoleActionIDs[actionKey].toString()}`
    );
    const roleActions = await request.json();

    if (roleActions) {
      return roleActions.Results.map((action: ActionProps) => ({
        ...action, Prefix: 'r', UrlType: 'Action'
      }));
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getContent(type: string, id: string | number) {
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
