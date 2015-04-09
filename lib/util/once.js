module.exports = function(fn, ctx) {
  var called = false;
  return function() {
    if (!called) {
      called = true;
      fn.apply(ctx, arguments);
    }
  };
};