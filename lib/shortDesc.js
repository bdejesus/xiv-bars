import jobs from 'lib/jobs';

function shortDesc(job, actions) {
  const descString = [`Plan your ${job.Name} Hotbars or W Cross Hotbars (WXHB) using this tool. Drag and drop, or click to assign any of the ${actions.length} actions to hotbar slots and save to a shareable URL.`];

  descString.push(`The ${job.Name}, abbreviated as ${job.Abbr}, is a ${jobs.ROLE_NAMES[job.Role]} and is a ${jobs.DISCIPLINE_NAMES[job.Discipline]} or ${job.Discipline}.`);

  if (job.Discipline === 'DOW' || job.Discipline === 'DOM') {
    descString.push(`This advanced class utilizes ${job.Weapon} as their main weapon.`);
  }

  return descString.join(' ');
}

export default shortDesc;
