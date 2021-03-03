const { ascByKey } = require('lib/utils');
const { ADVANCED_JOBS, ROLE_ACTION_IDS } = require('lib/jobs');

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
  const endpoint = 'search?indexes=Action,CraftAction&filters=ClassJobTargetID';
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
      }

      return [...classJobActions, ...filteredActions];
    });
  return actions;
}

async function listRoleActions(job) {
  const roleActions = await fetch(
    `${baseUrl}/Action?ids=${ROLE_ACTION_IDS[job.Role].toString()}`
  )
    .then((res) => res.json())
    .then((json) => json.Results);
  return roleActions.map((action) => ({
    ...action, Prefix: 'r', UrlType: 'Action'
  }));
}

async function getContent(type, id) {
  const req = `${baseUrl}/${type}/${id}`;
  const content = await fetch(req).then((res) => res.json());
  return content;
}

module.exports = {
  listJobs,
  listJobActions,
  listRoleActions,
  getContent,
};
