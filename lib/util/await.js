module.exports = function() {
  var await = 0;
  function fork(fn, n) {
    await += n = (typeof n === 'number' && n >= 1 ? n : 1);
    return function() {
      fn && fn.apply(this, arguments);
      if (n > 0) {
        n--, await--, call();
      }
    };
  }
  var then = [];
  function call() {
    if (await === 0) {
      while (then.length) {
        setTimeout(then.shift(), 0);
      }
    }
  }
  fork.then = function(fn) {
    if (await === 0) {
      setTimeout(fn, 0);
    } else {
      then.push(fn);
    }
  };
  return fork;
};