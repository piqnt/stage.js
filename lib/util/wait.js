module.exports = function() {
  var then, wait = 0;
  function fork(fn, n) {
    wait += n = (typeof n === 'number' && n >= 1 ? n : 1);
    return function() {
      fn && fn.apply(this, arguments);
      if (n > 0) {
        n--, wait--, call();
      }
    };
  }
  function call() {
    if (wait === 0 && typeof then === 'function') {
      then();
    }
  }
  fork.then = function(fn) {
    then = fn, call();
  };
  return fork;
};