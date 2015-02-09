module.exports = function(create) {
  var map = {};
  function fn(query) {
    if (Array.isArray(query)) {
      return fn.list(query);
    } else {
      return fn.get(query) || fn.neo(query);
    }
  }
  fn.neo = function(id) {
    return map[id] = create(id);
  };
  fn.get = function(id) {
    return map[id];
  };
  fn.list = function(ids) {
    if (Array.isArray(ids)) {
      return ids.map(function(id) {
        return map[id];
      });
    }
    return Object.keys(function(id) {
      return map[id];
    });
  };
  return fn;
};
