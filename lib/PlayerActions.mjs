import axios from 'axios';
import * as HTMLParser from 'fast-html-parser';

import ActionCategory from '../data/ActionCategory.json' assert { type: 'json' };
import { localizeKeys } from './utils/i18n.mjs';
import { byKey } from './utils/array.mjs';

export default class PlayerActions {
  constructor(job) {
    this.job = job;
    this.isCrafter = job.Discipline === 'DOH';
    this.actions = this.fetchActions({
      sheets: this.isCrafter ? 'CraftAction' : 'Action'
    })
    this.upgradableActions = this.fetchUpgradableActions();
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
    const decoratedJobActions = await this.decorateActions(jobActions, this.isCrafter ? 1 : 2);
    return decoratedJobActions;
  }

  async RoleActions() {
    const actions = await this.actions;
    const roleActions = actions.filter((action) =>
      action.fields.IsRoleAction
      && !action.fields.IsPvP
    );

    const decoratedRoleActions = this.decorateActions(roleActions, 2);
    return decoratedRoleActions;
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

    const decoratedPvpActions = await this.decorateActions(pvpActions, 3);
    const decoratedRoleActions = await this.decorateActions(roleActions, 3, { Prefix: 'r' });

    return {
      actions: decoratedPvpActions,
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

  async decorateActions(
    actionsJson,
    precision=2,
    props={ Prefix: undefined }
  ) {
    const Command = (this.job.Abbreviation === 'BLU') ? 'blueaction' : 'action';
    const excludeActions = ["Purify", 'Sic'];
    const upgradableActions = await this.upgradableActions;

    return actionsJson
      .filter((row) =>
        row.score >= precision
        && !excludeActions.includes(row.fields.Name)
      )
      .map((action) => ({
        ...action.fields,
        ...action.transient,
        ID: action.row_id,
        UrlType: 'Action',
        Prefix: props.Prefix || (action.fields.IsRoleAction ? 'r' : ''),
        Command,
        IsUpgradable: upgradableActions?.includes(action.fields.Name)
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

    const params = this.jsonToQuery({
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

  async fetchUpgradableActions() {
    // Fetch the page to parse for additional job data
    const lodestoneURL = `https://ffxiv.consolegameswiki.com/wiki/${this.job.Name}`;
    const request = await axios.get(lodestoneURL);
    const content = await request.data;
    // Select the Traits table from the resulting page
    const traits = HTMLParser.parse(content).querySelectorAll('.traits.table tr');
    // Search for rows with action upgrades using regex filtering to search for "Upgrades" in the text
    const rows = traits
      // Take the last column -- assuming that this is the Description column
      .map((row) => row.lastChild.text)
      // Filter for traits which tells us which actions upgrades to
      // Also filter out false positives
      .filter((row) => (row.match(/^Upgrades/) && !row.match(/^Upgrades.*when|.*executed by|.*while under|.*is upgraded/)))
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
