let expect = require("./util/expect");
let sinon = require("sinon");
let memo = require("./util/memo");

let Stage = require("../src/tree");

it("label", function () {
  let foo = Stage.component();
  expect(foo.label("label")).be(foo);
  expect(foo.label()).be("label");
});

it("attr", function () {
  let foo = Stage.component();
  expect(foo.attr("name")).not.ok();
  expect(foo.attr("string", "Name")).equal(foo);
  expect(foo.attr("number", 9876543210)).equal(foo);
  expect(foo.attr("string")).equal("Name");
  expect(foo.attr("number")).equal(9876543210);
});

it("append", function () {
  {
    let foo = Stage.component();
    let bar = Stage.component();
    let baz = Stage.component();
    foo.append(bar);
    expect(foo.first()).be(bar);
    expect(foo.last()).be(bar);
    foo.append(baz);
    expect(foo.first()).be(bar);
    expect(foo.last()).be(baz);
  }

  {
    let foo = Stage.component();
    let bar = Stage.component();
    let baz = Stage.component();
    foo.append([bar, baz]);
    expect(foo.first()).be(bar);
    expect(foo.last()).be(baz);
  }
});

it("prepend", function () {
  {
    let foo = Stage.component();
    let bar = Stage.component();
    let baz = Stage.component();
    foo.prepend(bar);
    expect(foo.first()).be(bar);
    expect(foo.last()).be(bar);
    foo.prepend(baz);
    expect(foo.first()).be(baz);
    expect(foo.last()).be(bar);
  }

  {
    let foo = Stage.component();
    let bar = Stage.component();
    let baz = Stage.component();
    foo.prepend([bar, baz]);
    expect(foo.first()).be(bar);
    expect(foo.last()).be(baz);
  }
});

it("appendTo", function () {
  let foo = Stage.component();
  let bar = Stage.component();
  let baz = Stage.component();
  bar.appendTo(foo);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(bar);
  baz.appendTo(foo);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it("prependTo", function () {
  let foo = Stage.component();
  let bar = Stage.component();
  let baz = Stage.component();
  bar.prependTo(foo);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(bar);
  baz.prependTo(foo);
  expect(foo.first()).be(baz);
  expect(foo.last()).be(bar);
});

it("insertAfter", function () {
  let foo = Stage.component();
  let bar = Stage.component();
  let baz = Stage.component();
  bar.prependTo(foo);
  baz.insertAfter(bar);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it("insertBefore", function () {
  let foo = Stage.component();
  let bar = Stage.component();
  let baz = Stage.component();
  bar.prependTo(foo);
  baz.insertBefore(bar);
  expect(foo.first()).be(baz);
  expect(foo.last()).be(bar);
});

it("insertNext", function () {
  let foo = Stage.component();
  let bar = Stage.component();
  let baz = Stage.component();
  bar.prependTo(foo);
  bar.insertNext(baz);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it("insertPrev", function () {
  let foo = Stage.component();
  let bar = Stage.component();
  let baz = Stage.component();
  bar.prependTo(foo);
  bar.insertPrev(baz);
  expect(foo.first()).be(baz);
  expect(foo.last()).be(bar);
});

it("visit", function () {
  let component = memo(function (id) {
    return Stage.component().label(id);
  });
  let visitor, data;
  let stage = component(1).append(
    component(11),
    component(12).append(component(121).hide(), component(122), component(123)),
    component(13),
  );

  stage.visit(
    (visitor = {
      start: sinon.stub(),
      end: sinon.stub(),
    }),
    (data = {}),
  );
  expect(visitor.start.args.pluck(0)).list(component([1, 11, 12, 121, 122, 123, 13]), "id");
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  stage.visit(
    (visitor = {
      visible: true,
      start: sinon.stub(),
      end: sinon.stub(),
    }),
    (data = {}),
  );
  expect(visitor.start.args.pluck(0)).list(component([1, 11, 12, 122, 123, 13]), "id");
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  stage.visit(
    (visitor = {
      reverse: true,
      start: sinon.stub(),
      end: sinon.stub(),
    }),
    (data = {}),
  );
  expect(visitor.start.args.pluck(0)).list(component([1, 13, 12, 123, 122, 121, 11]), "id");
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();
});
