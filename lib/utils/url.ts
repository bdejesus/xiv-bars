import { domain } from 'lib/host';
import type { URLProps, URLParams } from 'types/Page';

export function getUrlParams(url: string) {
  const search = url.split('?')[1];
  if (search) {
    const searchString = decodeURI(search);
    return JSON
      .parse(`{"${searchString.replaceAll('"', '\\"').replaceAll('&', '","').replaceAll('=', '":"')}"}`);
  }
  return {};
}

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

export function queryToJson(hash: string) {
  return Object.fromEntries(new URLSearchParams(hash.slice(1)));
}

interface BuildURLProps {
  params: URLParams,
  viewData?: URLProps
}

export function buildUrl({ params, viewData }:BuildURLProps) {
  const jobId = params.jobId;
  const filterQuery = Object.entries(params).reduce((items, [key, value]) => {
    if (key === 'hb') return { ...items, [key]: value?.toString() };
    if (key !== 'jobId') return { ...items, [key]: value };
    return items;
  }, {});
  const url = [`${domain}/job/${jobId}/new`];
  if (Object.keys(filterQuery).length > 0) url.push(jsonToQuery(filterQuery));
  return url.join('?');
}

const exportFunctions = {
  getUrlParams,
  jsonToQuery,
  queryToJson,
  buildUrl,
};
export default exportFunctions;
