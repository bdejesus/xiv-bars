import Roles from 'data/RoleNames.json';
import Disciplines from 'data/DisciplineNames.json';

function shortDesc(job) {
  const descString = [`Plan your ${job.Name} Hotbars or Cross Hotbars (XHB) using this tool. Drag and drop, or click to assign actions to hotbar slots and save to a shareable URL.`];

  descString.push(`The ${job.Name}, abbreviated as ${job.Abbr}, is a ${Roles[job.Role]} and is a ${Disciplines[job.Discipline]} or ${job.Discipline}.`);

  if (job.Discipline === 'DOW' || job.Discipline === 'DOM') {
    descString.push(`This advanced class utilizes ${job.Weapon} as their main weapon.`);
  }

  return descString.join(' ');
}

export default shortDesc;
