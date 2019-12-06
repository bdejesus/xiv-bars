const jobs = [
  {
    Name: 'Alchemist',
    Abbr: 'ALC',
    ID: 14,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Armorer',
    Abbr: 'ARM',
    ID: 10,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Blacksmith',
    Abbr: 'BSM',
    ID: 9,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Carpenter',
    Abbr: 'CRP',
    ID: 8,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Culinarian',
    Abbr: 'CUL',
    ID: 15,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Goldsmith',
    Abbr: 'GSM',
    ID: 11,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Leatherworker',
    Abbr: 'LTW',
    ID: 12,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Weaver',
    Abbr: 'WVR',
    ID: 13,
    Discipline: 'DOH',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Botanist',
    Abbr: 'BOT',
    ID: 17,
    Discipline: 'DOL',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Fisher',
    Abbr: 'FSH',
    ID: 18,
    Discipline: 'DOL',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Miner',
    Abbr: 'MIN',
    ID: 16,
    Discipline: 'DOL',
    ClassID: null,
    Role: null
  },
  {
    Name: 'Arcanist',
    Abbr: 'ACN',
    ID: 26,
    Discipline: 'DOM',
    ClassID: null,
    Role: 'HLR'
  },
  {
    Name: 'Astrologian',
    Abbr: 'AST',
    ID: 33,
    Discipline: 'DOM',
    ClassID: null,
    Role: 'HLR'
  },
  {
    Name: 'Black Mage',
    Abbr: 'BLM',
    ID: 25,
    Discipline: 'DOM',
    ClassID: 7,
    Role: 'MDPS'
  },
  {
    Name: 'Blue Mage',
    Abbr: 'BLU',
    ID: 36,
    Discipline: 'DOM',
    ClassID: null,
    Role: 'MDPS'
  },
  {
    Name: 'Conjurer',
    Abbr: 'CNJ',
    ID: 6,
    Discipline: 'DOM',
    ClassID: null,
    Role: 'HLR'
  },
  {
    Name: 'Scholar',
    Abbr: 'SCH',
    ID: 28,
    Discipline: 'DOM',
    ClassID: 26,
    Role: 'HLR'
  },
  {
    Name: 'Summoner',
    Abbr: 'SMN',
    ID: 27,
    Discipline: 'DOM',
    ClassID: 26,
    Role: 'MDPS'
  },
  {
    Name: 'Thaumaturge',
    Abbr: 'THM',
    ID: 7,
    Discipline: 'DOM',
    ClassID: null,
    Role: 'MDPS'
  },
  {
    Name: 'White Mage',
    Abbr: 'WHM',
    ID: 24,
    Discipline: 'DOM',
    ClassID: 6,
    Role: 'HLR'
  },
  {
    Name: 'Archer',
    Abbr: 'ARC',
    ID: 5,
    Discipline: 'DOM',
    ClassID: null,
    Role: 'RDPS'
  },
  {
    Name: 'Bard',
    Abbr: 'BRD',
    ID: 23,
    Discipline: 'DOW',
    ClassID: 5,
    Role: 'RDPS'
  },
  {
    Name: 'Dancer',
    Abbr: 'DNC',
    ID: 38,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'RDPS'
  },
  {
    Name: 'Dark Knight',
    Abbr: 'DRK',
    ID: 32,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'TNK'
  },
  {
    Name: 'Dragoon',
    Abbr: 'DRG',
    ID: 22,
    Discipline: 'DOW',
    ClassID: 4,
    Role: 'PDPS'
  },
  {
    Name: 'Gladiator',
    Abbr: 'GLA',
    ID: 1,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'TNK'
  },
  {
    Name: 'Gunbreaker',
    Abbr: 'GNB',
    ID: 37,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'TNK'
  },
  {
    Name: 'Lancer',
    Abbr: 'LNC',
    ID: 4,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'PDPS'
  },
  {
    Name: 'Machinist',
    Abbr: 'MCH',
    ID: 31,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'RDPS'
  },
  {
    Name: 'Marauder',
    Abbr: 'MRD',
    ID: 3,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'TNK'
  },
  {
    Name: 'Monk',
    Abbr: 'MNK',
    ID: 20,
    Discipline: 'DOW',
    ClassID: 2,
    Role: 'PDPS'
  },
  {
    Name: 'Ninja',
    Abbr: 'NIN',
    ID: 30,
    Discipline: 'DOW',
    ClassID: 29,
    Role: 'PDPS'
  },
  {
    Name: 'Paladin',
    Abbr: 'PLD',
    ID: 19,
    Discipline: 'DOW',
    ClassID: 1,
    Role: 'TNK'
  },
  {
    Name: 'Pugilist',
    Abbr: 'PGL',
    ID: 2,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'PDPS'
  },
  {
    Name: 'Red Mage',
    Abbr: 'RDM',
    ID: 35,
    Discipline: 'DOM',
    ClassID: null,
    Role: 'MDPS'
  },
  {
    Name: 'Rogue',
    Abbr: 'ROG',
    ID: 29,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'PDPS'
  },
  {
    Name: 'Samurai',
    Abbr: 'SAM',
    ID: 34,
    Discipline: 'DOW',
    ClassID: null,
    Role: 'PDPS'
  },
  {
    Name: 'Warrior',
    Abbr: 'WAR',
    ID: 21,
    Discipline: 'DOW',
    ClassID: 3,
    Role: 'TNK'
  }
];

const baseClassIDs = [1, 2, 3, 4, 5, 6, 7, 26, 29];

function getAdvancedJobs() {
  return jobs.filter((job) => !baseClassIDs.includes(job.ID));
}

const advancedJobs = getAdvancedJobs();

function getJobsByDiscipline(discipline) {
  return advancedJobs.filter((job) => job.Discipline === discipline);
}

module.exports = { jobs, getJobsByDiscipline, advancedJobs };
