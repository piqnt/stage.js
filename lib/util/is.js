/**
 * ! is the definitive JavaScript type testing library
 * 
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;

var NON_HOST_TYPES = {
  'boolean' : 1,
  'number' : 1,
  'string' : 1,
  'undefined' : 1
};

var hexRegex = /^[A-Fa-f0-9]+$/;

var is = module.exports = {};

is.a = is.an = is.type = function(value, type) {
  return typeof value === type;
};

is.defined = function(value) {
  return typeof value !== 'undefined';
};

is.empty = function(value) {
  var type = toStr.call(value);
  var key;

  if ('[object Array]' === type || '[object Arguments]' === type
      || '[object String]' === type) {
    return value.length === 0;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (owns.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  return !value;
};

is.equal = function(value, other) {
  if (value === other) {
    return true;
  }

  var type = toStr.call(value);
  var key;

  if (type !== toStr.call(other)) {
    return false;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if ('[object Array]' === type) {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if ('[object Function]' === type) {
    return value.prototype === other.prototype;
  }

  if ('[object Date]' === type) {
    return value.getTime() === other.getTime();
  }

  return false;
};

is.instance = function(value, constructor) {
  return value instanceof constructor;
};

is.nil = function(value) {
  return value === null;
};

is.undef = function(value) {
  return typeof value === 'undefined';
};

is.array = function(value) {
  return '[object Array]' === toStr.call(value);
};

is.emptyarray = function(value) {
  return is.array(value) && value.length === 0;
};

is.arraylike = function(value) {
  return !!value && !is.boolean(value) && owns.call(value, 'length')
      && isFinite(value.length) && is.number(value.length) && value.length >= 0;
};

is.boolean = function(value) {
  return '[object Boolean]' === toStr.call(value);
};

is.element = function(value) {
  return value !== undefined && typeof HTMLElement !== 'undefined'
      && value instanceof HTMLElement && value.nodeType === 1;
};

is.fn = function(value) {
  return '[object Function]' === toStr.call(value);
};

is.number = function(value) {
  return '[object Number]' === toStr.call(value);
};

is.nan = function(value) {
  return !is.number(value) || value !== value;
};

is.object = function(value) {
  return '[object Object]' === toStr.call(value);
};

is.hash = function(value) {
  return is.object(value) && value.constructor === Object && !value.nodeType
      && !value.setInterval;
};

is.regexp = function(value) {
  return '[object RegExp]' === toStr.call(value);
};

is.string = function(value) {
  return '[object String]' === toStr.call(value);
};

is.hex = function(value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};
