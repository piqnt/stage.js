var expect = require('./util/expect');
var sinon = require('sinon');

var Stage = require('../lib');
var Tween = require('../lib/addon/tween');

describe('Tween', function() {

  it('node.tween()', function() {
    var node = Stage.create();
    var m = node.tween();
    expect(node._tweens[0]).be(m);
    expect(m._duration).be(400);
    expect(m._delay).be(0);

    var n = node.tween(500, 100);
    expect(node._tweens[0]).be(n);
    expect(n._duration).be(500);
    expect(n._delay).be(100);

    var o = node.tween(true);
    expect(node._tweens[0]).be(n);
    expect(node._tweens[1]).be(o);
  });

  it('tween.tween()', function() {
    var node = Stage.create();
    var m = node.tween();

    var n = m.tween();
    expect(m._next).be(n);
    expect(n._duration).be(400);
    expect(n._delay).be(0);

    var n = m.tween(500, 100);
    expect(m._next).be(n);
    expect(n._duration).be(500);
    expect(n._delay).be(100);
  });

});