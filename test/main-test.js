var expect = require('./util/expect');
var rewire = require("rewire");
var sinon = require('sinon');
var sandbox = require('./util/sandbox');

var Cut = require('../lib/main');

it('static methods', function() {
  expect(Cut.config).be.a('function');
  expect(Cut.preload).be.a('function');
  expect(Cut.start).be.a('function');
  expect(Cut.pause).be.a('function');
  expect(Cut.resume).be.a('function');
  expect(Cut.app).be.a('function');
  expect(Cut.atlas).be.a('function');

  expect(Cut.create).be.a('function');
  expect(Cut.image).be.a('function');
  expect(Cut.anim).be.a('function');
  expect(Cut.string).be.a('function');
});
