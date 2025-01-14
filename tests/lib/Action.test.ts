import Action from '@/lib/JobAction.mjs';
import '@testing-library/jest-dom';
import 'tests/setupTests';
import axios from 'axios';

jest.mock('axios');

const ClassJob = {
  ID: 34,
  row_id: 34,
  Abbreviation: 'SAM',
  fields: {
    Name: 'Samurai',
    Abbreviation: 'SAM',
    Discipline: 'DOW'
  }
};

const JobAction = {
  score: 2,
  row_id: 678,
  fields: {
    ClassJob,
    IsPlayerAction: true,
    IsPvP: false,
    IsRoleAction: false,
    Name: 'Hakaze',
    Icon: { id: 678, path: '/', path_hr1: '/' }
  },
  transient: {
    Description: 'Lorem ipsum...'
  }
};

const RoleAction = {
  score: 2,
  row_id: 7478,
  fields: {
    ClassJob,
    IsPlayerAction: true,
    IsPvP: false,
    IsRoleAction: true,
    Name: 'Second Wind',
    Icon: { id: 7478, path: '/', path_hr1: '/' }
  },
  transient: {
    Description: 'Dolor sit amet...'
  }
};

const PvPAction = {
  score: 3,
  row_id: 178,
  fields: {
    ClassJob,
    IsPlayerAction: true,
    IsPvP: true,
    IsRoleAction: false,
    Name: 'PvP Hakaze',
    Icon: { id: 178, path: '/', path_hr1: '/' }
  },
  transient: {
    Description: 'Lorem ipsum...'
  }
};

const responseActions = {
  results: [
    JobAction,
    RoleAction,
    PvPAction
  ]
};

describe('Action', () => {
  let actions:Action;

  beforeEach(() => {
    const mockData = { data: responseActions };
    (axios.get as jest.Mock).mockResolvedValue(mockData);

    actions = new Action(ClassJob);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return JobActions', async () => {
    const mockResults = [
      {
        ID: 678,
        ClassJob,
        IsPlayerAction: true,
        IsPvP: false,
        IsRoleAction: false,
        IsUpgradable: true,
        Name: 'Hakaze',
        Description: 'Lorem ipsum...',
        Icon: { id: 678, path: '/', path_hr1: '/' },
        Command: 'action',
        Prefix: '',
        UrlType: 'Action'
      }
    ];

    const result = await actions.JobActions();
    expect(result).toEqual(mockResults);
  });

  it('should return PvP JobActions', async () => {
    const mockResults = [
      {
        ID: 178,
        ClassJob,
        IsPlayerAction: true,
        IsPvP: true,
        IsRoleAction: false,
        IsUpgradable: false,
        Name: 'PvP Hakaze',
        Description: 'Lorem ipsum...',
        Icon: { id: 178, path: '/', path_hr1: '/' },
        Command: 'action',
        Prefix: '',
        UrlType: 'Action'
      }
    ];

    const result = await actions.PvPActions();
    expect(result.actions).toEqual(mockResults);
  });

  it('should return RoleActions', async () => {
    const mockResults = [
      {
        ID: 7478,
        ClassJob,
        IsPlayerAction: true,
        IsPvP: false,
        IsRoleAction: true,
        IsUpgradable: false,
        Name: 'Second Wind',
        Description: 'Dolor sit amet...',
        Icon: { id: 7478, path: '/', path_hr1: '/' },
        Command: 'action',
        Prefix: 'r',
        UrlType: 'Action'
      }
    ];

    const result = await actions.RoleActions();
    expect(result).toEqual(mockResults);
  });
});
