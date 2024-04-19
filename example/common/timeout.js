let Timeout = (function () {
  let map = {};
  let list = [];
  function set(fn, delay, name) {
    let id = setTimeout(function () {
      let i = list.indexOf(id);
      i >= 0 && list.splice(i, 1);
      fn();
    }, delay);
    list.push(id);
    if (name) {
      clearTimeout(map[name]);
      map[name] = id;
    }
    return id;
  }
  function unset(name) {
    clearTimeout(map[name]);
    clearTimeout(name);
    let i = list.indexOf(id);
    i >= 0 && list.splice(i, 1);
  }
  function loop(fn, delay, name) {
    delay = delay || fn();
    delay &&
      set(
        function () {
          loop(fn, 0, name);
        },
        delay,
        name,
      );
  }
  function reset() {
    while (list.length) {
      clearTimeout(list.shift());
    }
  }
  return {
    set: set,
    unset: unset,
    reset: reset,
    loop: loop,
  };
})();

export default Timeout;
