var expect = require('./util/expect');
var sinon = require('sinon');
var sandboxed = require('sandboxed-module');
var memo = require('./util/memo');

var Stage = require('../lib/node');

it('Mouse', function() {
  var document = {
    body : {}
  }, window = {
    document : document
  };

  var Mouse = sandboxed.require('../lib/addon/mouse', {
    locals : {
      window : window,
      document : document
    }
  });

  var elem, add, remove, event;

  Mouse._xy = sinon.spy(function(stage, el, ev, point) {
    expect(ev).equal(event);
    expect(el).equal(elem);
    point.x = ev.x;
    point.y = ev.y;
  });

  var node = memo(function(id) {
    return Stage.create().label(id).pin({
      width : 400,
      height : 300
    });
  });
  var listener = memo(function(id) {
    return sinon.spy();
  });
  var stage = node(1).append(node(11),
      node(12).append(node(121).hide(), node(122), node(123)), node(13));

  node(1).on(Mouse.CLICK, listener('click-' + 1));
  node(1).on(Mouse.START, listener('start-' + 1));
  node(1).on(Mouse.END, listener('end-' + 1));
  node(1).on(Mouse.MOVE, listener('move-' + 1));

  Mouse.subscribe(stage, elem = {
    addEventListener : add = sinon.stub(),
    removeEventListener : remove = sinon.stub()
  });

  expect(add.args.pluck(0)).list(
      [ 'touchstart', 'touchend', 'touchmove', 'touchcancel', 'mousedown',
          'mouseup', 'mousemove' ]);
  expect(add.alwaysCalledOn(elem)).ok();

  var down = add.args[0][1], up = add.args[1][1], move;

  down.call(elem, event = Event('mousedown', 40, 30));
  expect(listener('start-' + 1).callCount).be(1);
  expect(listener('end-' + 1).callCount).be(0);
  expect(listener('click-' + 1).callCount).be(0);

  up.call(elem, event = Event('mouseup', 40, 30));
  expect(listener('start-' + 1).callCount).be(1);
  expect(listener('end-' + 1).callCount).be(1);
  expect(listener('click-' + 1).callCount).be(1);

  listener('start-' + 1).reset();
  listener('end-' + 1).reset();
  listener('click-' + 1).reset();

  down.call(elem, event = Event('mousedown', 40, 30));
  move = add.lastCall.args[1];
  move.call(elem, event = Event('mousemove', 30, 20));
  up.call(elem, event = Event('mouseup'));
  expect(listener('start-' + 1).callCount).be(1);
  expect(listener('end-' + 1).callCount).be(1);
  expect(listener('click-' + 1).callCount).be(1);
  expect(listener('click-' + 1).callCount).be(1);
});

function Event(type, x, y) {
  return {
    x : x,
    y : y,
    type : type,
    preventDefault : sinon.stub()
  };
}
