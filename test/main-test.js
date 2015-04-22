var expect = require('./util/expect');
var sinon = require('sinon');

var Stage = require('../lib/');

it('static methods', function() {
  expect(Stage.config).be.a('function');
  expect(Stage.preload).be.a('function');
  expect(Stage.start).be.a('function');
  expect(Stage.pause).be.a('function');
  expect(Stage.resume).be.a('function');
  expect(Stage.app).be.a('function');
  expect(Stage.atlas).be.a('function');

  expect(Stage.create).be.a('function');

  // expect(Stage.stage).be.a('function');
  // expect(Stage.image).be.a('function');
  // expect(Stage.anim).be.a('function');
  // expect(Stage.string).be.a('function');
  // expect(Stage.canvas).be.a('function');
});
