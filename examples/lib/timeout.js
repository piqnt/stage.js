/*
 * ExtraJS
 * Copyright (c) 2013-2015 Ali Shakiba, Piqnt LLC
 * Available under the MIT license
 * @license
 */

var Timeout = (function() {
  var map = {};
  var list = [];
  function set(fn, delay, name) {
    // console.log('Timeout.set', name);
    // console.log('Timeout.set+', list);
    var id = setTimeout(function() {
      // console.log('Timeout.done', id);
      // console.log('Timeout.done+', list);
      var i = list.indexOf(id);
      i >= 0 && list.splice(i, 1);
      // console.log('Timeout.done-', list);
      fn();
    }, delay);
    list.push(id);
    if (name) {
      clearTimeout(map[name]);
      map[name] = id;
    }
    // console.log('Timeout.set-', list);
    return id;
  }
  function unset(name) {
    // console.log('Timeout.unset', name);
    clearTimeout(map[name]);
    clearTimeout(name);
    var i = list.indexOf(id);
    i >= 0 && list.splice(i, 1);
  }
  function loop(fn, delay, name) {
    delay = delay || fn();
    delay && set(function() {
      loop(fn, 0, name);
    }, delay, name);
  }
  function reset() {
    // console.log('Timeout.reset+', list);
    while (list.length) {
      clearTimeout(list.shift());
    }
    // console.log('Timeout.reset-', list);
  }
  return {
    set : set,
    unset : unset,
    reset : reset,
    loop : loop
  };
})();