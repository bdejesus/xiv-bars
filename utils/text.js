/* eslint-disable */

String.prototype.titleize = function () {
  let string = this.split(' ');
  string = string.map((str) => {
     return str.capitalize();
  });

  return string.join(' ');
};

export function titleize(string) {
  return string.titleize();
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
export function capitalize(string) {
  return string.capitalize();
}

export default {
  titleize,
  capitalize,
};
