module.exports = function() {
  var count = 0;
  function fork(fn, n) {
    count += n = (typeof n === 'number' && n >= 1 ? n : 1);
    return function() {
      fn && fn.apply(this, arguments);
      if (n > 0) {
        n--, count--, call();
      }
    };
  }
  var then = [];
  function call() {
    if (count === 0) {
      while (then.length) {
        setTimeout(then.shift(), 0);
      }
    }
  }
  fork.then = function(fn) {
    if (count === 0) {
      setTimeout(fn, 0);
    } else {
      then.push(fn);
    }
  };
  return fork;
};