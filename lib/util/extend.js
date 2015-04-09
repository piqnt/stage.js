module.exports = function(base) {
  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];
    for ( var key in obj) {
      if (obj.hasOwnProperty(key)) {
        base[key] = obj[key];
      }
    }
  }
  return base;
};
