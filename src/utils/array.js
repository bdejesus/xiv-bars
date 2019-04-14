/* eslint-disable no-extend-native */
export const group = (array, size) => {
  const arr = [];
  const newArray = [].concat.apply(
    arr, array.map((elem, i) => (i % size ? [] : [array.slice(i, i + size)]))
  );
  return newArray;
};

export default group;
