import { domain } from 'lib/host';
import type { LayoutViewProps, MergeDataProps } from 'types/Layout';
import { defaultState } from 'components/App/defaultState';
import { QueryProps } from 'types/Page';
import { ENCODED_SLOTS_PARAM, ENCODED_SLOTS_PARAM_ALIASES, readSlotParam } from 'lib/utils/encoding';

export function jsonToQuery(json:object) {
  return Object.entries(json)
    .reduce((items:string[], [key, value]) => {
      const encodedKey = encodeURI(key);
      const encodedValue = encodeURI(value);
      if (encodedValue !== 'undefined') items.push(`${encodedKey}=${encodedValue}`);
      return items;
    }, [])
    .join('&');
}

interface BuildURLProps {
  query?: QueryProps,
  viewData?: LayoutViewProps,
  mergeData?: MergeDataProps
}

type hbValue = string|string[]|number[];

export function buildUrl({ viewData, query, mergeData }:BuildURLProps):string {
  const params = { ...viewData, ...query, ...mergeData };
  const includeKeys = [
    'l',
    'hb',
    'isPvp',
    'xhb',
    'wxhb',
    'exhb',
    's'
  ];
  const jobId = params.jobId;

  if (!jobId) throw new Error('jobId param is undefined');

  function formatPvp(value:boolean|number|string) {
    const valStr = value.toString();
    if (['true', 'false'].includes(valStr)) return valStr === 'true' ? 1 : 0;
    return value;
  }

  function formatHb(value:hbValue) {
    return value.toString().replaceAll(/\[|\]|"/gi, '');
  }

  const decoratedParams = Object.entries(params).reduce((items, [key, value]) => {
    if (ENCODED_SLOTS_PARAM_ALIASES.includes(key)) return { ...items, [ENCODED_SLOTS_PARAM]: value };
    if (key === 'isPvp') return { ...items, [key]: formatPvp(value as string) };
    if (key === 'hb') return { ...items, [key]: value && formatHb(value as hbValue) };
    if (['l', 'layout'].includes(key)) return { ...items, l: value?.toString() };
    if (includeKeys.includes(key)) return { ...items, [key]: value };
    if (key === 'id') return { ...items, parentId: value };
    return items;
  }, {});

  const filterEntries = Object.fromEntries(
    Object.entries(decoratedParams).filter(([, value]) => value && !['undefined', 'null'].includes(value.toString()))
  );

  const url = `${domain}/job/${jobId}/new`;

  if (Object.keys(filterEntries).length > 0) {
    return [url, jsonToQuery(filterEntries)].join('?');
  }

  return url;
}

export function decorateRouterQuery(query:QueryProps) {
  const encodedSlots = readSlotParam(query);
  // convert isPvp url param to boolean
  const parsePvp = (pvpVal:string):boolean => {
    if (pvpVal === '0') return false;
    if (pvpVal === '1') return true;
    return false;
  };

  // convert hb url param to string[]
  const parseHb = (hbVal:string):number[]|undefined => {
    if (hbVal === 'undefined' || hbVal === 'null') return defaultState.viewData.hb;
    const sanitizeVal = hbVal.replaceAll(/\[|\]/gi, '');
    const hb = sanitizeVal.split(',').map((v) => parseInt(v, 10));
    return hb;
  };

  const formatProps = {
    encodedSlots,
    wxhb: query.wxhb && parseInt(query.wxhb as string, 10),
    xhb: query.xhb && parseInt(query.xhb as string, 10),
    exhb: query.exhb && parseInt(query.exhb as string, 10),
    hb: query.hb && parseHb(query.hb as string),
    layout: query.l && parseInt(query.l as string, 10),
    isPvp: query.isPvp && parsePvp(query.isPvp as string),
    jobId: query?.jobId
  };

  const filterUndefined = Object.entries(formatProps)
    .reduce((newProps, [key, value]) => {
      const hasValue:boolean = value !== undefined;
      if (hasValue) return { ...newProps, [key]: value };
      return newProps;
    }, {});

  return filterUndefined;
}

const exportFunctions = {
  jsonToQuery,
  buildUrl,
  decorateRouterQuery
};
export default exportFunctions;
