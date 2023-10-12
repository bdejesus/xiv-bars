// eslint-disable-next-line @typescript-eslint/no-explicit-any
/* eslint-disable no-extend-native */

const group = (array, size) => {
  const arr = [];
  const newArray = [];
  const concatArray = newArray.concat.apply(arr, array.map((item, i) => (i % size ? [] : [array.slice(i, i + size)])));
  return concatArray;
};

const byKey = (key, order = 'asc') => (a, b) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
    return 0;
  }
  const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
  const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
  let comparison = 0;
  if (varA > varB) {
    comparison = 1;
  } else if (varA < varB) {
    comparison = -1;
  }
  return (
    (order === 'desc') ? (comparison * -1) : comparison
  );
};

const exportFunctions = { byKey, group };

module.exports = exportFunctions;
