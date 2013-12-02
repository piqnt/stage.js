function Pool(create, checkout, checkin, discard) {

  var _list = [], _max = 4, _name = "";

  this.max = function(max) {
    if (!arguments.length) {
      return _max;
    }
    _max = max;
    return this;
  };

  this.name = function(name) {
    if (!arguments.length) {
      return _name;
    }
    _name = name;
    return this;
  };

  this.checkOut = function() {
    var item = _list.length ? _list.shift() : create.call(this);
    checkout && checkout.call(this, item);
    return item;
  };

  this.checkIn = function(item) {
    if (_list.length < _max) {
      checkin && checkin.call(this, item);
      _list.push(item);
    } else {
      discard && discard.call(this, item);
    }
  };
}

function Randomize() {
  this._none = null;
  this._cases = [];
  this._filter = function(item) {
    return item;
  };
};

Randomize.prototype.clone = function() {
  var clone = new Randomize(this._none);
  clone._cases.push.apply(clone._cases, this._cases);
  return clone;
};

Randomize.prototype.add = function(obj, prob) {
  if (typeof prob == "undefined") {
    prob = 1;
  }
  this._cases.push([ obj, (typeof prob == "function" ? prob : function() {
    return prob;
  }) ]);
  return this;
};

Randomize.prototype.filter = function(func) {
  this._filter = func || function(item) {
    return item;
  };
  return this;
};

Randomize.prototype.none = function(none) {
  if (!arguments.length) {
    return this._none;
  }
  this._none = none;
  return this;
};

Randomize.prototype.exact = function(cheat) {
  return this._filter(this._cases[cheat][1]);
};

Randomize.prototype.random = function(prob) {
  if (prob && Math.random() >= prob)
    return this._filter(this._none);
  var sum = 0;
  for ( var i = 0; i < this._cases.length; i++) {
    sum += (this._cases[i][2] = this._cases[i][1]());
  }
  var rand = Math.random() * sum;
  for ( var i = 0; i < this._cases.length; i++) {
    var each = this._cases[i];
    if ((rand -= each[2]) < 0) {
      return this._filter(each[0]);
    }
  }
  return this._filter(this._none);
};

Randomize.prototype.next = function(func) {
  this._nextFunc = func;
  return this;
};

Randomize.prototype.reset = function() {
  this._next = this._nextFunc();
  return this;
};

Randomize.prototype.tick = function(n) {
  if (!this._nextFunc) {
    return true;
  }
  n = n || 1;
  if ((this._next -= n) < 0) {
    this._next = this._nextFunc();
    return true;
  }
  return false;
};
