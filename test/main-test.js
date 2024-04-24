let expect = require("./util/expect");

let Stage = require("../src/");

it("static methods", function () {
  expect(Stage.start).be.a("function");
  expect(Stage.pause).be.a("function");
  expect(Stage.resume).be.a("function");
  expect(Stage.app).be.a("function");
  expect(Stage.atlas).be.a("function");

  expect(Stage.create).be.a("function");

  // expect(Stage.mount).be.a('function');
  // expect(Stage.sprite).be.a('function');
  // expect(Stage.anim).be.a('function');
  // expect(Stage.monotype).be.a('function');
  // expect(Stage.canvas).be.a('function');
});
