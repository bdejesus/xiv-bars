/* eslint-disable no-extend-native */
/* eslint-disable no-prototype-builtins */

export const sortIntoGroups = (array, size) => {
  const arr = [];
  const concatArray = [].concat.apply(arr, array.map((_item, i) => (i % size ? [] : [array.slice(i, i + size)])));
  return concatArray;
};

export const byKey = (key, order = 'asc') => (a, b) => {
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

export const serializeDates = (list) => {
  return list.map((item) => ({
    ...item,
    createdAt: item?.createdAt?.toString(),
    updatedAt: item?.updatedAt?.toString()
  }))
}

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const exportFunctions = { byKey, sortIntoGroups, serializeDates, shuffleArray };


export default exportFunctions;
