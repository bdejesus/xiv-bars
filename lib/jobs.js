const JOBS = require('data/JobsMeta.json');
const BASE_CLASS_IDS = require('data/BaseClassIDs.json');
const ROLE_ACTION_IDS = require('data/RoleActionIDs.json');
const ROLE_NAMES = require('data/RoleNames.json');
const DISCIPLINE_NAMES = require('data/DisciplineNames.json');

function getAdvancedJobs() {
  return JOBS.filter((job) => !BASE_CLASS_IDS.includes(job.ID));
}

const ADVANCED_JOBS = getAdvancedJobs();

function getJobsByDiscipline(discipline) {
  return ADVANCED_JOBS.filter((job) => job.Discipline === discipline);
}

module.exports = {
  getJobsByDiscipline,
  JOBS,
  ADVANCED_JOBS,
  ROLE_ACTION_IDS,
  ROLE_NAMES,
  DISCIPLINE_NAMES
};
