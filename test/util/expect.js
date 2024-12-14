const expect = require("expect.js");

expect.Assertion.prototype.list = function (obj, fn) {
  if (typeof fn === "function") {
  } else if (typeof fn === "string") {
    fn = (function (id) {
      return function (obj) {
        let value = obj[id];
        return typeof value === "function" ? value.call(obj) : value;
      };
    })(fn);
  } else {
    fn = function (obj) {
      return expect.stringify(obj, false, 1);
    };
  }
  let match = true;
  if (obj.length === this.obj.length) {
    const n = this.obj.length;
    for (let i = 0; match && i < n; i++) {
      match = this.obj[i] === obj[i] ? match : false;
    }
  } else {
    match = false;
  }
  this.assert(
    match,
    function () {
      return "expected " + this.obj.map(fn) + " to list " + obj.map(fn);
    },
    function () {
      return "expected " + this.obj.map(fn) + " to not list " + obj.map(fn);
    },
  );
  return this;
};

export default expect;

Array.prototype.pluck = function (key) {
  return this.map(function (obj) {
    return obj[key];
  });
};
