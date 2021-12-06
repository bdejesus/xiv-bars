module.exports = {
  jsonToQuery: (json) => Object.entries(json)
    .map(([key, value]) => {
      const encodedKey = encodeURI(key);
      const encodedValue = encodeURI(value);
      return `${encodedKey}=${encodedValue}`;
    })
    .join('&'),

  getParameterByName: (name, url = window.location.href) => {
    const key = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${key}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
};
