module.exports = (function() {
  if (typeof Object.create == 'function') {
    return function(proto, props) {
      return Object.create.call(Object, proto, props);
    };
  } else {
    return function(proto, props) {
      if (props) {
        throw Error('Second argument is not supported!');
      }
      if (!proto || typeof proto !== 'object') {
        throw Error('Invalid prototype!');
      }
      noop.prototype = proto;
      return new noop;
    };
    function noop() {
    }
  }
})();