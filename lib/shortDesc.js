import { ROLE_NAMES, DISCIPLINE_NAMES } from 'data/jobs';

function shortDesc(job, actions) {
  const descString = [`Simulate your ${job.Name} Hotbars or W Cross Hotbars with ${actions.length} actions using XIVBars below.`];

  descString.push(`The ${job.Name}, usually abbreviated as ${job.Abbr}, is a ${ROLE_NAMES[job.Role]} and is a ${DISCIPLINE_NAMES[job.Discipline]} or ${job.Discipline}.`);

  if (job.Discipline === 'DOW' || job.Discipline === 'DOM') {
    descString.push(`This advanced class utilizes ${job.Weapon} as their main weapon.`);
  }

  return descString.join(' ');
}

export default shortDesc;
