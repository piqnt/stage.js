var Cut = require('./core');
var Tween = require('./tween');
var Easing = require('./easing');

Cut.prototype.tween = function(duration, delay) {
  if (!this._tween) {
    this._tween = new Tween(this);
  }
  return this._tween.tween(duration, delay);
};

Tween.prototype.ease = function(easing) {
  this._next.easing = Easing(easing);
  return this;
};

module.exports = Cut;
module.exports.Tween = Tween;
module.exports.Easing = Easing;