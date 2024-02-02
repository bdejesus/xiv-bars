import { domain } from 'lib/host';
import type { URLParams } from 'types/Page';

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

export function buildUrl(query:URLParams) {
  const jobId = query.id;
  const filterQuery = Object.entries(query).reduce((items, [key, value]) => {
    if (key !== 'id') return { ...items, [key]: value };
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
