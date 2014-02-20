if (!Function.prototype.bind) {
  Function.prototype.bind = function(obj) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError(
          "Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this, args = Array.prototype.slice.call(arguments, 1), type = function() {
    }, bound = function() {
      return self.apply(this instanceof type && obj ? this : obj, args
          .concat(Array.prototype.slice.call(arguments)));
    };
    type.prototype = this.prototype;
    bound.prototype = new type();

    return bound;
  };
}

if (typeof Object.create != "function") {
  (function() {
    var F = function() {
    };
    Object.create = function(proto) {
      if (arguments.length > 1) {
        throw Error("Second argument not supported!");
      }
      if (proto === null || typeof proto != "object") {
        throw Error("Invalid prototype!");
      }
      F.prototype = proto;
      return new F;
    };
  })();
}