export function getUrlParams(url) {
  const search = url.split('?')[1];
  if (search) {
    return JSON
      .parse(`{"${decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')}"}`);
  }
  return {};
}

const exportFunctions = { getUrlParams };
export default exportFunctions;
