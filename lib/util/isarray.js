module.exports = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};