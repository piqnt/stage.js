var expect = require('./expect');
var rewire = require("rewire");
var sinon = require('sinon');
var sandbox = require('./sandbox');

// defined them globally, then rewire them
window = document = null;

var Cut = require('../cut-core');

it('Mouse', function() {
  var Mouse = rewire('../cut-mouse');

  var document = {
    body : {}
  }, window = {
    document : document
  };
  Mouse.__set__('window', window);
  Mouse.__set__('document', document);

  var elem, add, remove, event;

  Mouse._xy = sinon.spy(function(root, el, ev, point) {
    expect(ev).equal(event);
    expect(el).equal(elem);
    point.x = ev.x;
    point.y = ev.y;
  });

  var cuts = sandbox(function(id) {
    return Cut.create().id(id).pin({
      width : 400,
      height : 300
    });
  });
  var listener = sandbox(function(id) {
    return sinon.spy();
  });
  var root = cuts(1).append(cuts(11),
      cuts(12).append(cuts(121).hide(), cuts(122), cuts(123)), cuts(13));

  cuts(1).on(Mouse.CLICK, listener('click-' + 1));
  cuts(1).on(Mouse.START, listener('start-' + 1));
  cuts(1).on(Mouse.END, listener('end-' + 1));
  cuts(1).on(Mouse.MOVE, listener('move-' + 1));

  Mouse(root, elem = {
    addEventListener : add = sinon.stub(),
    removeEventListener : remove = sinon.stub()
  });

  expect(add.args.pluck(0)).list([ 'mousedown', 'mouseup', 'mousemove' ]);
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

it('Touch', function() {
  var Mouse = rewire('../cut-mouse');
  Mouse.__set__('window', {
    ontouchstart : true
  });
  // Mouse.debug();
});

function tostr(obj) {
  return obj.id();
}