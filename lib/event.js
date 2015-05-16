require('./util/event')(require('./core').prototype, function(obj, name, on) {
  obj._flag(name, on);
});
