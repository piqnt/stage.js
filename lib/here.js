(function() {

  if (typeof window !== 'object') {
    return;
  }

  var scripts = document.getElementsByTagName('script');

  function getScriptSrc() {
    if (document.currentScript) {
      return document.currentScript.src;
    }

    // IE>=10
    // TODO: Use stacktrace.js?
    var stack;
    try {
      var err = new Error();
      if (err.stack) {
        stack = err.stack;
      } else {
        throw err;
      }
    } catch (err) {
      stack = err.stack;
    }
    if (typeof stack === 'string') {
      stack = stack.split('\n');
      // Use the last trace, the result will be valid only if called directly
      // TODO: Use n-th trace from begining which is just before this script
      for (var i = stack.length; i--;) {
        var url = stack[i].match(/(\w+\:\/\/[^/]*?\/.+?)(:\d+)(:\d+)?/);
        if (url) {
          return url[1];
        }
      }
    }

    // IE<11
    if (scripts.length && 'readyState' in scripts[0]) {
      for (var i = scripts.length; i--;) {
        if (scripts[i].readyState === 'interactive') {
          return scripts[i].src;
        }
      }
    }

    return '';
  }

  function defineGetter(obj, name, getter) {
    try {
      Object.defineProperty(obj, name, {
        get : getter
      });
      if (name in obj) {
        return true;
      }
    } catch (e) {
    }
    if (obj.__defineGetter__) {
      obj.__defineGetter__(name, getter);
      return true;
    }
    return false;
  }

  defineGetter(window, '__src', function() {
    return getScriptSrc();
  });

  defineGetter(window, '__dirname', function() {
    var url = getScriptSrc();
    return url.substring(0, url.lastIndexOf('/') + 1);
  });

})();
