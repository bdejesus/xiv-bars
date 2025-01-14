import axios from 'axios';
import ActionCategory from '../data/ActionCategory.json' assert { type: 'json' };
import { localizeKeys } from '../lib/utils/i18n.mjs';

const defaults = {
  IsPvP: false,
  precision: 2
}
const defaultFields = {
  fields: [
    'Icon',
    'Name',
    'Description',
    'IsPvP',
    'IsRoleAction',
    'IsPlayerAction',
    'IsLimitedJob',
    'ClassJob.Abbreviation',
    'ClassJob.Name',
    'Prefix',
    'UrlType',
    ...localizeKeys('Name'),
    ...localizeKeys('Description')
  ],
  transient: ['Description', ...localizeKeys('Description')].join(',')
};
const limit = 400;

export default class Action {
  constructor(job) {
    this.job = job;
    this.isCrafter = job.Discipline === 'DOH';
    this.actions = this.fetchActions({
      sheets: this.isCrafter ? 'CraftAction' : 'Action'
    })
  }

  async All() {
    const actions = await this.actions;
    return this.decorateActions(actions, 2);
  }

  async JobActions() {
    const actions = await this.actions;
    const jobActions = this.isCrafter
      ? actions
      : actions.filter((action) => (
          !action.fields.IsRoleAction && !action.fields.IsPvP
        ));
    return this.decorateActions(jobActions, this.isCrafter ? 1 : 2);
  }

  async RoleActions() {
    const actions = await this.actions;
    const roleActions = actions.filter((action) => action.fields.IsRoleAction && !action.fields.IsPvP);

    return this.decorateActions(roleActions, 2);
  }

  async PvPActions() {
    if (this.isCrafter) return [];
    const actions = await this.fetchActions({
      sheets: 'Action',
      query: {
        IsPvP: true
      }
    });
    const pvpActions = actions.filter((action) => (
      action.fields.IsPvP && action.fields.ClassJob.value !== 0
    ));
    const roleActions = actions.filter((action) => (
      action.fields.IsPvP && action.fields.ClassJob.value === 0
    ));

    return {
      actions: this.decorateActions(pvpActions, 3),
      roleActions: this.decorateActions(roleActions, 3, { Prefix: 'r' })
    }
  }

  jsonToQuery(json, separator='&') {
    return Object.entries(json)
      .reduce((items, [key, value]) => {
        const encodedKey = encodeURI(key);
        const encodedValue = encodeURI(value);
        if (encodedValue !== 'undefined') items.push(`${encodedKey}=${encodedValue}`);
        return items;
      }, [])
      .join(separator);
  }

  decorateActions(
    actionsJson,
    precision=defaults.precision,
    props={ Prefix: undefined }
  ) {
    const Command = (this.job.Abbreviation === 'BLU') ? 'blueaction' : 'action';

    return actionsJson
      .filter((row) => row.score >= precision)
      .map((action) => ({
        ...action.fields,
        ...action.transient,
        ID: action.row_id,
        UrlType: 'Action',
        Prefix: props.Prefix || (action.fields.IsRoleAction ? 'r' : ''),
        Command
      }));
  }

  async fetchActions({ sheets, query }) {
    const baseQuery = {
      ClassJob: this.job.ID,
      'IsPlayerAction': this.isCrafter ? undefined : 1,
      [`+ClassJobCategory.${this.job.Abbreviation}`]: 1,
      ...query
    };
    const queryString = `(${this.jsonToQuery(baseQuery, ' ')})`;

    const params = this.jsonToQuery({
      sheets,
      query: queryString,
      limit,
      ...defaultFields,
    });

    const endpoint = `${process.env.XIV_API_URL}/search?${params}`;
    const request = await axios.get(endpoint).catch((error) => console.error(error));
    const json = await request.data;
    return json.results;
  }
}

export function getActionIcon(action) {
  const path = action.fields ? action.fields.Icon.path_hr1 : action.Icon.path_hr1;
  return `${process.env.XIV_API_URL}/asset?path=${path}&format=png`;
}
