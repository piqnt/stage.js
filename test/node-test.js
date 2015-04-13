var expect = require('./util/expect');
var sinon = require('sinon');
var memo = require('./util/memo');

var Cut = require('../lib/node');

it('attr', function() {
  var foo = Cut.create();
  expect(foo.attr('name')).not.ok();
  expect(foo.attr('name', 'Name')).equal(foo);
  expect(foo.attr('number', 9876543210)).equal(foo);
  expect(foo.attr('name')).equal('Name');
  expect(foo.attr('number')).equal(9876543210);
});

it('visit', function() {
  var cuts = memo(function(id) {
    return Cut.create().id(id);
  });
  var visitor, data;
  var root = cuts(1).append(cuts(11),
      cuts(12).append(cuts(121).hide(), cuts(122), cuts(123)), cuts(13));

  root.visit(visitor = {
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.pluck(0)).list(
      cuts([ 1, 11, 12, 121, 122, 123, 13 ]), 'id');
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  root.visit(visitor = {
    visible : true,
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.pluck(0)).list(
      cuts([ 1, 11, 12, 122, 123, 13 ]), 'id');
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  root.visit(visitor = {
    reverse : true,
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.pluck(0)).list(
      cuts([ 1, 13, 12, 123, 122, 121, 11 ]), 'id');
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