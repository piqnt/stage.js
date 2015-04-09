if (typeof performance !== 'undefined' && performance.now) {
  module.exports = function() {
    return performance.now();
  };
} else if (Date.now) {
  module.exports = function() {
    return Date.now();
  };
} else {
  module.exports = function() {
    return new Date().getTime();
  };
}
