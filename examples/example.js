!function() {
  var body = document.body;
  var loading = document.createElement('class');
  loading.className = 'loading';
  if (supported()) {
    loading.innerHTML = 'Loading...';
    loading.style.zIndex = -1;
  } else {
    loading.innerHTML = 'Please use a <a target="_blank" href="https://www.google.com/search?q=modern+browser">modern browser!';
    loading.style.zIndex = 0;
  }
  body.insertBefore(loading, body.firstChild);

  function supported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
}();

eval(load('../../cut-core.js'));
eval(load('../../cut-mouse.js'));
eval(load('../../cut-loader.web.js'));

function load(path) {
  var xhrObj = new XMLHttpRequest();
  xhrObj.open('GET', path, false);
  xhrObj.send();
  return xhrObj.responseText;
}

var status = (function() {
  var el = null;
  return function(msg) {
    if (el === null) {
      var el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.color = 'black';
      el.style.background = 'white';
      el.style.zIndex = 999;
      el.style.top = '5px';
      el.style.right = '5px';
      el.style.padding = '1px 5px';
      document.body.appendChild(el);
    }
    el.innerHTML = msg;
  };
})();
