export function getUrlParams(url: string) {
  const search = url.split('?')[1];
  if (search) {
    const searchString = decodeURI(search);
    return JSON
      .parse(`{"${searchString.replaceAll('"', '\\"').replaceAll('&', '","').replaceAll('=', '":"')}"}`);
  }
  return {};
}

export function jsonToQuery(json: object) {
  return Object.entries(json)
    .map(([key, value]) => {
      const encodedKey = encodeURI(key);
      const encodedValue = encodeURI(value);
      return `${encodedKey}=${encodedValue}`;
    })
    .join('&');
}

export function queryToJson(hash: string) {
  return Object.fromEntries(new URLSearchParams(hash.slice(1)));
}

const exportFunctions = {
  getUrlParams,
  jsonToQuery,
  queryToJson
};
export default exportFunctions;
