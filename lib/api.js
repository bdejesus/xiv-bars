import { ascByKey } from 'lib/utils';
import { ADVANCED_JOBS, ROLE_ACTION_IDS } from 'data/jobs';

const baseUrl = 'https://xivapi.com';

async function listJobs() {
  const req = `${baseUrl}/ClassJob`;
  const data = await fetch(req)
    .then((res) => res.json())
    .then((json) => json.Results);
  const jobs = data.sort(ascByKey('Name'));

  const decoratedJobs = ADVANCED_JOBS.map((advancedJob) => {
    const jobData = jobs.find((job) => job.ID === advancedJob.ID);
    return { ...jobData, ...advancedJob };
  });

  return decoratedJobs;
}

async function listJobActions(job) {
  const req = `${baseUrl}/search?indexes=Action,CraftAction&filters=ClassJobTargetID=${job.ID}`;

  const actions = await fetch(req)
    .then((res) => res.json())
    .then(async (resActions) => {
      let classJobActions = [];
      if (job.ClassID !== null) {
        const classJobActionsRequest = `${baseUrl}/search?indexes=Action,CraftAction&filters=ClassJobTargetID=${job.ClassID}`;
        classJobActions = await fetch(classJobActionsRequest)
          .then((res) => res.json())
          .then((json) => json.Results);
      }
      return [...classJobActions, ...resActions.Results];
    });
  return actions;
}

async function listRoleActions(job) {
  const roleActions = await fetch(
    `${baseUrl}/Action?ids=${ROLE_ACTION_IDS[job.Role].toString()}`
  )
    .then((res) => res.json())
    .then((json) => json.Results);
  return roleActions.map((action) => ({ ...action, UrlType: 'Action' }));
}

async function getContent(type, id) {
  const req = `${baseUrl}/${type}/${id}`;
  const content = await fetch(req).then((res) => res.json());
  return content;
}

const api = {
  listJobs, listJobActions, listRoleActions, getContent
};
export default api;
export {
  listJobs, listJobActions, listRoleActions, getContent
};
