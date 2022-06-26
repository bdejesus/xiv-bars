import JOBS from 'data/JobsMeta.json';
import BASE_CLASS_IDS from 'data/BaseClassIDs.json';
import ROLE_ACTION_IDS from 'data/RoleActionIDs.json';
import ROLE_NAMES from 'data/RoleNames.json';
import DISCIPLINE_NAMES from 'data/DisciplineNames.json';

function getAdvancedJobs() {
  return JOBS.filter((job) => !BASE_CLASS_IDS.includes(job.ID));
}

export const ADVANCED_JOBS = getAdvancedJobs();

export function getJobsByDiscipline(discipline) {
  return ADVANCED_JOBS.filter((job) => job.Discipline === discipline);
}

const moduleExports = {
  getJobsByDiscipline,
  JOBS,
  ADVANCED_JOBS,
  ROLE_ACTION_IDS,
  ROLE_NAMES,
  DISCIPLINE_NAMES
};

export default moduleExports;
