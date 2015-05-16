var expect = require('./util/expect');
var sinon = require('sinon');
var sandboxed = require('sandboxed-module');
var memo = require('./util/memo');

var Stage = require('../lib/');

it('Mouse', function() {
  var event, elem, elemOn, doc, docOn, win, winOn;

  var Mouse = sandboxed.require('../lib/addon/mouse', {
    locals : {
      document : doc = {
        addEventListener : docOn = sinon.stub()
      },
      window : win = {
        document : doc,
        addEventListener : winOn = sinon.stub()
      }
    }
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

  stage.viewport = function() {
    return {
      ratio : 1
    };
  };

  node(1).on(Mouse.CLICK, listener('click-' + 1));
  node(1).on(Mouse.START, listener('start-' + 1));
  node(1).on(Mouse.END, listener('end-' + 1));
  node(1).on(Mouse.MOVE, listener('move-' + 1));

  Mouse.subscribe(stage, elem = {
    addEventListener : elemOn = sinon.stub(),
    getBoundingClientRect : function() {
      return {
        left : 0,
        top : 0
      };
    },
    clientLeft : 0,
    clientTop : 0
  });

  expect(elemOn.args.pluck(0)).list(
      [ 'touchstart', 'touchend', 'touchmove', 'touchcancel', 'mousedown',
          'mouseup', 'mousemove' ]);
  expect(elemOn.alwaysCalledOn(elem)).ok();

  var down = elemOn.args[0][1], up = elemOn.args[1][1], move;

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
  move = elemOn.lastCall.args[1];
  move.call(elem, event = Event('mousemove', 30, 20));
  up.call(elem, event = Event('mouseup'));
  expect(listener('start-' + 1).callCount).be(1);
  expect(listener('end-' + 1).callCount).be(1);
  expect(listener('click-' + 1).callCount).be(1);
  expect(listener('click-' + 1).callCount).be(1);
});

function Event(type, x, y) {
  return {
    pageX : x,
    pageY : y,
    type : type,
    preventDefault : sinon.stub()
  };
}
