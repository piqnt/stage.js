var expect = require('./util/expect');
var sinon = require('sinon');
var memo = require('./util/memo');

var Cut = require('../lib/node');

it('label', function() {
  var foo = Cut.create();
  expect(foo.label('label')).be(foo);
  expect(foo.label()).be('label');
});

it('attr', function() {
  var foo = Cut.create();
  expect(foo.attr('name')).not.ok();
  expect(foo.attr('string', 'Name')).equal(foo);
  expect(foo.attr('number', 9876543210)).equal(foo);
  expect(foo.attr('string')).equal('Name');
  expect(foo.attr('number')).equal(9876543210);
});

it('append', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  foo.append(bar);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(bar);
  foo.append(baz);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);

  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  foo.append([ bar, baz ]);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it('prepend', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  foo.prepend(bar);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(bar);
  foo.prepend(baz);
  expect(foo.first()).be(baz);
  expect(foo.last()).be(bar);

  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  foo.prepend([ bar, baz ]);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it('appendTo', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  bar.appendTo(foo);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(bar);
  baz.appendTo(foo);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it('prependTo', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  bar.prependTo(foo);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(bar);
  baz.prependTo(foo);
  expect(foo.first()).be(baz);
  expect(foo.last()).be(bar);
});

it('insertAfter', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  bar.prependTo(foo);
  baz.insertAfter(bar);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it('insertBefore', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  bar.prependTo(foo);
  baz.insertBefore(bar);
  expect(foo.first()).be(baz);
  expect(foo.last()).be(bar);
});

it('insertNext', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  bar.prependTo(foo);
  bar.insertNext(baz);
  expect(foo.first()).be(bar);
  expect(foo.last()).be(baz);
});

it('insertPrev', function() {
  var foo = Cut.create(), bar = Cut.create(), baz = Cut.create();
  bar.prependTo(foo);
  bar.insertPrev(baz);
  expect(foo.first()).be(baz);
  expect(foo.last()).be(bar);
});

it('visit', function() {
  var cuts = memo(function(id) {
    return Cut.create().label(id);
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
  expect(visitor.start.args.pluck(0)).list(cuts([ 1, 11, 12, 122, 123, 13 ]),
      'id');
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
