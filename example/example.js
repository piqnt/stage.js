(function() {
  var body = document.body;
  var loading = document.createElement('class');
  loading.className = 'loading';
  if (Stage._supported) {
    loading.innerHTML = 'Loading...';
    loading.style.zIndex = -1;
  } else {
    loading.innerHTML = 'Please use a <a target="_blank" href="https://www.google.com/search?q=modern+browser">modern browser!';
    loading.style.zIndex = 0;
  }
  body.insertBefore(loading, body.firstChild);
})();

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

(function() {
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = window.location.href.replace(/\/example\/.*/, '/favicon.ico');
  document.getElementsByTagName('head')[0].appendChild(link);
})();
