var expect = require('./util/expect');
var rewire = require("rewire");
var sinon = require('sinon');
var sandbox = require('./util/sandbox');

var Cut = require('../lib/core');

it('attr', function() {
  var foo = Cut.create();
  expect(foo.attr('name')).not.ok();
  expect(foo.attr('name', 'Name')).equal(foo);
  expect(foo.attr('number', 9876543210)).equal(foo);
  expect(foo.attr('name')).equal('Name');
  expect(foo.attr('number')).equal(9876543210);
});

it('visit', function() {
  var cuts = sandbox(function(id) {
    return Cut.create().id(id);
  });
  var visitor, data;
  var root = cuts.neo(1).append(cuts.neo(11),
      cuts.neo(12).append(cuts.neo(121).hide(), cuts.neo(122), cuts.neo(123)),
      cuts.neo(13));

  root.visit(visitor = {
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.pluck(0)).list(
      cuts.list([ 1, 11, 12, 121, 122, 123, 13 ]), 'id');
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  root.visit(visitor = {
    visible : true,
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.pluck(0)).list(
      cuts.list([ 1, 11, 12, 122, 123, 13 ]), 'id');
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  root.visit(visitor = {
    reverse : true,
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.pluck(0)).list(
      cuts.list([ 1, 13, 12, 123, 122, 121, 11 ]), 'id');
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();
});

it('flag', function() {
  var foo = Cut.create();
  var bar = Cut.create();
  var baz = Cut.create();
  var qux = Cut.create();

  var ring = sinon.stub();
  baz.on('ring', ring);
  expect(baz._flag('ring')).equal(1);

  baz.off('ring', ring);
  expect(baz._flag('ring')).equal(0);

  baz.on('knock', sinon.stub());
  expect(baz._flag('knock')).equal(1);

  qux.on('knock', sinon.stub());
  qux.on('knock', sinon.stub());
  expect(qux._flag('knock')).equal(2);

  bar.appendTo(foo);

  baz.appendTo(bar);
  qux.appendTo(bar);

  expect(bar._flag('knock')).equal(2);
  expect(foo._flag('knock')).equal(1);

  baz.remove();
  expect(bar._flag('knock')).equal(1);
  expect(foo._flag('knock')).equal(1);

  qux.remove();
  expect(bar._flag('knock')).equal(0);
  expect(foo._flag('knock')).equal(0);

  bar.remove();

  foo.append(bar, baz, qux);
  expect(foo._flag('knock')).equal(2);

  foo.empty();
  expect(foo._flag('knock')).equal(0);
});