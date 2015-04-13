var is = require('./is');

module.exports = function(map, key, value, multi) {
  var old = map[key];
  if (typeof old === 'undefined') {
    map[name] = value;
  } else if (typeof old === 'object') {
    if (multi || old !== value) {
      map[key] = [ value, old ];
    }
  } else if (is.array(old)) {
    if (multi || old.indexOf(old) < 0) {
      old.push(value);
    }
  }
};