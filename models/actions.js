const generalActions = [
  {
    ID: 7,
    Name: 'Auto-Attack',
    Description: 'Auto-Attack',
    Icon: '/i/000000/000101.png'
  },
  {
    ID: 209,
    Name: 'Limit Break',
    Description: 'Limit Break is a Light Party or Full Party (4 or 8 player) ability. It can only be used after the Limit Break Gauge has at least one segment filled. The length of the Limit Break gauge depends on the type of party',
    Icon: '/i/000000/000103.png'
  },
  {
    ID: 3,
    Name: 'Sprint',
    Description: 'Increases movement speed.',
    Icon: '/i/000000/000104.png'
  },
  {
    ID: 6,
    Name: 'Return',
    Description: 'Transports the user to their current Aetheryte home point free of charge.',
    Icon: '/i/000000/000111.png'
  },
  {
    ID: 5,
    Name: 'Teleport',
    Description:
      'Transports the user and party members to the chosen Aetheryte location for a fee. The fee is higher the further the destination.',
    Icon: '/i/000000/000112.png'
  }
];

const roleActions = {
  TANK: [
    {
      ID: 7531,
      Name: 'Rampart',
      Icon: '/i/000000/000801.png'
    },
    {
      ID: 7540,
      Name: 'Low Blow',
      Icon: '/i/000000/000802.png'
    },
    {
      ID: 7533,
      Name: 'Provoke',
      Icon: '/i/000000/000803.png'
    },
    {
      ID: 7538,
      Name: 'Interject',
      Icon: '/i/000000/000808.png'
    },
    {
      ID: 7535,
      Name: 'Reprisal',
      Icon: '/i/000000/000806.png'
    },
    {
      ID: 7548,
      Name: "Arm's Length",
      Icon: '/i/000000/000822.png'
    },
    {
      ID: 7537,
      Name: 'Shirk',
      Icon: '/i/000000/000810.png'
    }
  ],
  PDPS: [
    {
      ID: 7541,
      Name: 'Second Wind',
      Icon: '/i/000000/000821.png'
    },
    {
      ID: 7863,
      Name: 'Leg Sweep',
      Icon: '/i/000000/000824.png'
    },
    {
      ID: 7542,
      Name: 'Bloodbath',
      Icon: '/i/000000/000823.png'
    },
    {
      ID: 7549,
      Name: 'Feint',
      Icon: '/i/000000/000828.png'
    },
    {
      ID: 7548,
      Name: "Arm's Length",
      Icon: '/i/000000/000822.png'
    },
    {
      ID: 7546,
      Name: 'True North',
      Icon: '/i/000000/000830.png'
    }
  ],
  RDPS: [
    {
      ID: 7554,
      Name: 'Leg Graze',
      Icon: '/i/000000/000843.png'
    },
    {
      ID: 7541,
      Name: 'Second Wind',
      Icon: '/i/000000/000821.png'
    },
    {
      ID: 7553,
      Name: 'Foot Graze',
      Icon: '/i/000000/000842.png'
    },
    {
      ID: 7557,
      Name: 'Peloton',
      Icon: '/i/000000/000844.png'
    },
    {
      ID: 7551,
      Name: 'Head Graze',
      Icon: '/i/000000/000848.png'
    },
    {
      ID: 7548,
      Name: "Arm's Length",
      Icon: '/i/000000/000822.png'
    }
  ],
  MDPS: [
    {
      ID: 7560,
      Name: 'Addle',
      Icon: '/i/000000/000861.png'
    },
    {
      ID: 7561,
      Name: 'Swiftcast',
      Icon: '/i/000000/000866.png'
    },
    {
      ID: 7562,
      Name: 'Lucid Dreaming',
      Icon: '/i/000000/000865.png'
    },
    {
      ID: 7559,
      Name: 'Surecast',
      Icon: '/i/000000/000869.png'
    }
  ],
  HEAL: [
    {
      ID: 16560,
      Name: 'Repose',
      Icon: '/i/000000/000891.png'
    },
    {
      ID: 7568,
      Name: 'Esuna',
      Icon: '/i/000000/000884.png'
    },
    {
      ID: 7561,
      Name: 'Swiftcast',
      Icon: '/i/000000/000866.png'
    },
    {
      ID: 7562,
      Name: 'Lucid Dreaming',
      Icon: '/i/000000/000865.png'
    },
    {
      ID: 7559,
      Name: 'Surecast',
      Icon: '/i/000000/000869.png'
    },
    {
      ID: 7571,
      Name: 'Rescue',
      Icon: '/i/000000/000890.png'
    }
  ]
};

module.exports = { generalActions, roleActions };
