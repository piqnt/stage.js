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