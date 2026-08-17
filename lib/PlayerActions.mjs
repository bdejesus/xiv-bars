import { promises as fsPromise } from 'fs';
import { localizeKeys } from './utils/i18n.mjs';
import { byKey } from './utils/array.mjs';

const src = './.apiData';
const defaults = {
  IsPvP: false,
  precision: 2
}
const defaultFields = {
  fields: [
    'Icon',
    ...localizeKeys('Name'),
    ...localizeKeys('Description'),
    ...localizeKeys('ClassJob.Name'),
    ...localizeKeys('ClassJob.Abbreviation'),
    'IsPvP',
    'IsRoleAction',
    'IsPlayerAction',
    'IsLimitedJob'
  ],
  transient: ['Description', ...localizeKeys('Description')].join(',')
};
const limit = 400;

const excludeActions = [
  'Purify', 'Sic'
]

export default class PlayerActions {
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
      : actions.filter((action) => (!action.fields.IsRoleAction && !action.fields.IsPvP));
    return this.decorateActions(jobActions, this.isCrafter ? 1 : 2);
  }

  async RoleActions() {
    const actions = await this.actions;
    const roleActions = actions.filter((action) =>
      action.fields.IsRoleAction
      && !action.fields.IsPvP
    );

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
      action.fields.IsPvP
      && action.fields.ClassJob.value !== 0
    ));
    const roleActions = actions.filter((action) => (
      action.fields.IsPvP
      && action.fields.ClassJob.value === 0
    ));

    const decoratedActions = await this.decorateActions(pvpActions, 3);
    const decoratedRoleActions = await this.decorateActions(roleActions, 3, { Prefix: 'r' });

    return {
      actions: decoratedActions,
      roleActions: decoratedRoleActions
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

  async upgradableActions() {
    if (!this.upgrades) {
      this.upgrades = fsPromise
        .readFile(`${src}/UpgradableActions.json`, 'utf8')
        .then((data) => (data ? JSON.parse(data) : {}))
        .catch(() => ({}));
    }

    return this.upgrades;
  }

  async decorateActions(
    actionsJson,
    precision=defaults.precision,
    props={ Prefix: undefined }
  ) {
    const upgradableActions = await this.upgradableActions();
    const upgrades = upgradableActions[this.job.Abbreviation] || [];
    const Command = (this.job.Abbreviation === 'BLU') ? 'blueaction' : 'action';

    const rows = actionsJson.filter((row) =>
      row.score >= precision
      && !excludeActions.includes(row.fields.Name)
    );

    // An action is only marked upgradable when the action replacing it is in
    // this same list. Traits describe conditional swaps the same way as real
    // upgrades — DRK's Bloodspiller becomes Scarlet Delirium only under
    // Delirium — and those replacements are not player actions, so hiding the
    // original at max level would leave nothing to slot in its place.
    const names = new Set(rows.map((row) => row.fields.Name.toLowerCase()));
    const upgraded = new Set(
      upgrades
        .filter(({ to }) => names.has(to?.toLowerCase()))
        .map(({ from }) => from.toLowerCase())
    );

    return rows
      .map((action) => ({
        ...action.fields,
        ...action.transient,
        ID: action.row_id,
        UrlType: 'Action',
        Prefix: props.Prefix || (action.fields.IsRoleAction ? 'r' : ''),
        Command,
        IsUpgradable: upgraded.has(action.fields.Name.toLowerCase())
      }))
      .sort(byKey('ID'));
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
    const response = await fetch(endpoint).catch((error) => console.error(error));
    const json = await response.json();
    return json.results;
  }
}
