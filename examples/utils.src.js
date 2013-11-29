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

function Randomize(none) {
  this._none = none;
  this._cases = [];
  this._sum = 0;
  this._filter = function(item) {
    return item;
  };
};

Randomize.prototype.clone = function() {
  var clone = new Randomize(this._none);
  clone._cases.push.apply(clone._cases, this._cases);
  clone._sum = this._sum;
  return clone;
};

Randomize.prototype.add = function(obj, prob) {
  prob = prob || 1;
  this._cases.push([ prob, obj ]);
  this._sum += prob;
  return this;
};

Randomize.prototype.filter = function(func) {
  this._filter = func || function(item) {
    return item;
  };
  return this;
};

Randomize.prototype.exact = function(cheat) {
  return this._filter(this._cases[cheat][1]);
};

Randomize.prototype.random = function(prob) {
  if (prob && Math.random() >= prob)
    return this._filter(this._none);
  var rand = Math.random() * this._sum;
  for ( var i = 0; i < this._cases.length; i++) {
    var each = this._cases[i];
    if ((rand -= each[0]) < 0) {
      return this._filter(each[1]);
    }
  }
  return this._filter(this._none);
};