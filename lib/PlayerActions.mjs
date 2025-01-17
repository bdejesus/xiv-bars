import axios from 'axios';
import * as HTMLParser from 'fast-html-parser';

import ActionCategory from '../data/ActionCategory.json' assert { type: 'json' };
import { localizeKeys } from './utils/i18n.mjs';
import { byKey } from './utils/array.mjs';
import jsonToQuery from './utils/jsonToQuery.mjs';

export default class PlayerActions {
  constructor(job) {
    this.job = job;
    this.isCrafter = job.Discipline === 'DOH';
    this.actions = this.#fetchActions({
      sheets: this.isCrafter ? 'CraftAction' : 'Action'
    })
    this.externalActionsData = this.#fetchExternalActionsData();
  }

  async All() {
    const actions = await this.actions;
    return this.#decorateActions(actions, 2);
  }

  async JobActions() {
    const actions = await this.actions;
    const jobActions = this.isCrafter
      ? actions
      : actions.filter((action) => (!action.fields.IsRoleAction && !action.fields.IsPvP));
    const decoratedJobActions = await this.#decorateActions(jobActions, this.isCrafter ? 1 : 2);
    return decoratedJobActions;
  }

  async RoleActions() {
    const actions = await this.actions;
    const roleActions = actions.filter((action) =>
      action.fields.IsRoleAction
      && !action.fields.IsPvP
    );

    const decoratedRoleActions = this.#decorateActions(roleActions, 2);
    return decoratedRoleActions;
  }

  async PvPActions() {
    if (this.isCrafter) return [];
    const actions = await this.#fetchActions({
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

    const decoratedPvpActions = await this.#decorateActions(pvpActions, 3);
    const decoratedRoleActions = await this.#decorateActions(roleActions, 3, { Prefix: 'r' });

    return {
      actions: decoratedPvpActions,
      roleActions: decoratedRoleActions
    }
  }

  async #decorateActions(
    actionsJson,
    precision=2,
    props={ Prefix: undefined }
  ) {
    const Command = (this.job.Abbreviation === 'BLU') ? 'blueaction' : 'action';
    const excludeActions = ["Purify", 'Sic'];
    const upgradableActions = await this.#UpgradableActions();
    const externalActionsData = await this.#ExternalActionsData();

    return actionsJson
      .filter((row) =>
        row.score >= precision
        && !excludeActions.includes(row.fields.Name)
      )
      .map((action) => {
        const Level = externalActionsData.find((actionData) => actionData.Action === action.fields.Name)?.Level;
        return {
          ...action.fields,
          ...action.transient,
          ID: action.row_id,
          UrlType: 'Action',
          Prefix: props.Prefix || (action.fields.IsRoleAction ? 'r' : ''),
          Command,
          IsUpgradable: upgradableActions?.includes(action.fields.Name),
          Level
        }
      })
      .sort(byKey('ID'));
  }

  async #fetchActions({ sheets, query }) {
    const baseQuery = {
      ClassJob: this.job.ID,
      'IsPlayerAction': this.isCrafter ? undefined : 1,
      [`+ClassJobCategory.${this.job.Abbreviation}`]: 1,
      ...query
    };
    const queryString = `(${jsonToQuery(baseQuery, ' ')})`;

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

    const params = jsonToQuery({
      sheets,
      query: queryString,
      limit: 400,
      ...defaultFields,
    });

    const endpoint = `${process.env.XIV_API_URL}/search?${params}`;
    const request = await axios.get(endpoint).catch((error) => console.error(error));
    const json = await request.data;
    return json.results;
  }

  #getSectionSelector() {
    switch (this.job.Role) {
      case 'TANK': return '.tanker-role';
      case 'HEAL': return '.healer-role';
      case 'DOL': return '.gathering-role.actions';
      case 'DOH': return '.crafting-role.actions';
      default: return '.dps-role';
    }
  }

  async #fetchExternalActionsData() {
    const lodestoneURL = `https://ffxiv.consolegameswiki.com/wiki/${this.job.Name}`;
    const request = await axios.get(lodestoneURL);
    const content = await request.data;
    return content;
  }

  async #ExternalActionsData() {
    const content = await this.externalActionsData;
    const actionsTableSelector = this.#getSectionSelector();
    const actionsTable = HTMLParser.parse(content).querySelector(`${actionsTableSelector}.table`);
    if (actionsTable) {
      const actionRows = actionsTable.querySelectorAll('tr');
      const headers = actionRows[0].querySelectorAll('th').map((th) => {
        return th.text?.replace('\n', '') || 'Undefined'
      });
      const actionData = actionRows.slice(1).map((row) => {
        return row.querySelectorAll('td').reduce((accumulator, td, index) => {
          const headerKey = headers[index] || 'Undefined';
          const value = td.text.replace('\n', '').trimStart().trimEnd()
          return {
            ...accumulator,
            [headerKey]: (value === '0'|| parseInt(value, 10)) ? parseInt(value, 10) : value
          }
        }, {});
      });
      return actionData;
    }
    return [];
  }

  async #UpgradableActions() {
    // Fetch the page to parse for additional job data
    const content = await this.#fetchExternalActionsData();

    // Select the Traits table from the resulting page
    const traits = HTMLParser.parse(content).querySelectorAll('.traits.table tr');
    // Search for rows with action upgrades using regex filtering to search for "Upgrades" in the text
    const rows = traits
      // Take the last column -- assuming that this is the Description column
      .map((row) => row?.lastChild?.text)
      // Filter for traits which tells us which actions upgrades to
      // Also filter out false positives
      .filter((row) => (row?.match(/^Upgrades/) && !row.match(/^Upgrades.*when|.*executed by|.*while under|.*is upgraded/)))
      // Parse the text to only take Action Names that are upgradable
      .map((text) => {
        if (text.match(/respectively/)) {
          return text.split(' to ')[0].replace('Upgrades ', '').split(' and ')
        } else {
          return text.replaceAll(/^Upgrades |\n/g, '').split(' and ')
            .map((t) => t.split(' to ')[0]).flat()
        }
      })
      .flat()
      // One more text filter to catch any remaining false positives
      .filter((text) => !text.match(/increases the|the potency of/));
    return rows;
  }
}

export function getActionIcon(action) {
  const path = action.fields ? action.fields.Icon.path_hr1 : action.Icon.path_hr1;
  return `${process.env.XIV_API_URL}/asset?path=${path}&format=png`;
}
