const Timeout = (function () {
  const map = {};
  const list = [];
  function set(fn: () => any, delay: number, name: string) {
    const id = setTimeout(function () {
      const i = list.indexOf(id);
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
  function unset(name: string) {
    clearTimeout(map[name]);
    clearTimeout(name);
    const i = list.indexOf(name);
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
