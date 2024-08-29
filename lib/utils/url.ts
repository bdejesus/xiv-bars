import { domain } from 'lib/host';
import type { LayoutViewProps, MergeDataProps } from 'types/Layout';
import { defaultState } from 'components/App/defaultState';
import { QueryProps } from 'types/Page';

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
  const params = { ...viewData, ...query, ...mergeData } || {};
  const inlcudeKeys = [
    'l',
    'hb',
    'isPvp',
    'xhb',
    'wxhb',
    'exhb',
    's',
    'id'
  ];
  const jobId = params.jobId;

  if (!jobId) throw new Error('jobId param is undefined');

  function formatPvp(value:boolean|number|string) {
    const valStr = value.toString();
    if (['true', 'false'].includes(valStr)) return valStr === 'true' ? 1 : 0;
    return value;
  }

  function formatHb(value:hbValue) {
    const isArray = Array.isArray(value);
    if (isArray) return value.toString();
    return value.replaceAll(/\[|\]|"/gi, '');
  }

  const decorateEntries = Object.entries(params).reduce((items, [key, value]) => {
    if (['s', 's1', 'encodedSlots'].includes(key)) return { ...items, s: value };
    if (key === 'isPvp') return { ...items, [key]: formatPvp(value as string) };
    if (key === 'hb') return { ...items, [key]: value && formatHb(value as hbValue) };
    if (['l', 'layout'].includes(key)) return { ...items, l: value?.toString() };
    if (inlcudeKeys.includes(key)) return { ...items, [key]: value };
    return items;
  }, {});

  const filterEntries = Object.entries(decorateEntries).reduce((entries, [key, value]) => {
    if (value && ['undefined', 'null'].includes(value.toString())) return entries;
    return { ...entries, [key]: value };
  }, {});

  const url = `${domain}/job/${jobId}/new`;

  if (Object.keys(filterEntries).length > 0) {
    return [url, jsonToQuery(filterEntries)].join('?');
  }

  return url;
}

export function decorateRouterQuery(query:QueryProps) {
  const encodedSlots = query.s1 || query.s;
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
