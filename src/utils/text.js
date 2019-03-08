String.prototype.titleize = function() {
  var string_array = this.split(' ');
  string_array = string_array.map(function(str) {
     return str.capitalize(); 
  });
  
  return string_array.join(' ');
}
export function titleize(string) {
  return string.titleize()
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
export function capitalize(string) {
  return string.capitalize()
}

export default {
  titleize,
  capitalize
}
