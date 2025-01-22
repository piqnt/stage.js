const expect = require("./util/expect");
const sinon = require("sinon");
const sandboxed = require("sandboxed-module");
const memo = require("./util/memo");

const Stage = require("../src/");

it("Pointer", function () {
  let event, elem, elemOn, doc, docOn, win, winOn;

  const Pointer = sandboxed.require("../src/pointer", {
    locals: {
      document: (doc = {
        addEventListener: (docOn = sinon.stub()),
      }),
      window: (win = {
        document: doc,
        addEventListener: (winOn = sinon.stub()),
      }),
    },
  });

  const component = memo(function (id) {
    return Stage.component().label(id).pin({
      width: 400,
      height: 300,
    });
  });
  const listener = memo(function (id) {
    return sinon.spy();
  });
  const stage = component(1).append(
    component(11),
    component(12).append(component(121).hide(), component(122), component(123)),
    component(13),
  );

  stage.viewport = function () {
    return {
      ratio: 1,
    };
  };

  component(1).on(Pointer.CLICK, listener("click-" + 1));
  component(1).on(Pointer.START, listener("start-" + 1));
  component(1).on(Pointer.END, listener("end-" + 1));
  component(1).on(Pointer.MOVE, listener("move-" + 1));

  new Pointer().mount(
    stage,
    (elem = {
      addEventListener: (elemOn = sinon.stub()),
      getBoundingClientRect: function () {
        return {
          left: 0,
          top: 0,
        };
      },
      clientLeft: 0,
      clientTop: 0,
    }),
  );

  expect(elemOn.args.pluck(0)).list([
    "touchstart",
    "touchend",
    "touchmove",
    "touchcancel",
    "mousedown",
    "mouseup",
    "mousemove",
  ]);
  expect(elemOn.alwaysCalledOn(elem)).ok();

  const down = elemOn.args[0][1];
  const up = elemOn.args[1][1];
  let move;

  down.call(elem, (event = Event("mousedown", 40, 30)));
  expect(listener("start-" + 1).callCount).be(1);
  expect(listener("end-" + 1).callCount).be(0);
  expect(listener("click-" + 1).callCount).be(0);

  up.call(elem, (event = Event("mouseup", 40, 30)));
  expect(listener("start-" + 1).callCount).be(1);
  expect(listener("end-" + 1).callCount).be(1);
  expect(listener("click-" + 1).callCount).be(1);

  listener("start-" + 1).reset();
  listener("end-" + 1).reset();
  listener("click-" + 1).reset();

  down.call(elem, (event = Event("mousedown", 40, 30)));
  move = elemOn.lastCall.args[1];
  move.call(elem, (event = Event("mousemove", 30, 20)));
  up.call(elem, (event = Event("mouseup")));
  expect(listener("start-" + 1).callCount).be(1);
  expect(listener("end-" + 1).callCount).be(1);
  expect(listener("click-" + 1).callCount).be(1);
  expect(listener("click-" + 1).callCount).be(1);
});

function Event(type, x, y) {
  return {
    pageX: x,
    pageY: y,
    type: type,
    preventDefault: sinon.stub(),
  };
}
