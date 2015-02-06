var sinon = require('sinon');
var expect = require('expect.js');
var Cut = require('../cut-core');

it('Attribute', function() {
  var foo = Cut.create();
  expect(foo.attr('name')).not.ok();
  expect(foo.attr('name', 'Name')).equal(foo);
  expect(foo.attr('number', 9876543210)).equal(foo);
  expect(foo.attr('name')).equal('Name');
  expect(foo.attr('number')).equal(9876543210);
});

it('Visit', function() {
  var cuts = Sandbox(function(id) {
    return Cut.create().id(id);
  });
  function tostr(obj) {
    return obj.id();
  }
  var visitor, data;
  var root = cuts.neo(1).append(cuts.neo(11),
      cuts.neo(12).append(cuts.neo(121).hide(), cuts.neo(122), cuts.neo(123)),
      cuts.neo(13));

  root.visit(visitor = {
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.select(0)).list(
      cuts.list([ 1, 11, 12, 121, 122, 123, 13 ]), tostr);
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  root.visit(visitor = {
    visible : true,
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.select(0)).list(
      cuts.list([ 1, 11, 12, 122, 123, 13 ]), tostr);
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();

  root.visit(visitor = {
    reverse : true,
    start : sinon.stub(),
    end : sinon.stub()
  }, data = {});
  expect(visitor.start.args.select(0)).list(
      cuts.list([ 1, 13, 12, 123, 122, 121, 11 ]), tostr);
  expect(visitor.start.alwaysCalledWithMatch(sinon.match.object, data)).ok();
  expect(visitor.start.alwaysCalledOn(visitor)).ok();
});

it('Event On/Off', function() {
  var hello = sinon.stub();
  var open = sinon.stub();

  var door = Cut.create();

  expect(door.listeners('knock')).not.ok();

  door.on('knock', hello);
  expect(door.listeners('knock')).eql([ hello ]);

  door.on('knock', open);
  expect(door.listeners('knock')).eql([ hello, open ]);

  door.off('knock', open);
  expect(door.listeners('knock')).eql([ hello ]);

  door.off('knock', hello);
  expect(door.listeners('knock')).not.ok();

  door.on('knock ring', open);
  expect(door.listeners('knock')).eql([ open ]);
  expect(door.listeners('ring')).eql([ open ]);

  door.off('knock ring', open);

  expect(door.listeners('knock')).not.ok();
  expect(door.listeners('ring')).not.ok();
});

it('Flag', function() {
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

expect.Assertion.prototype.list = function(obj, fn) {
  fn = typeof fn === 'function' ? fn : function(obj) {
    return expect.stringify(obj, false, 1);
  };
  var match = true;
  if (obj.length === this.obj.length) {
    var n = this.obj.length;
    for (var i = 0; match && i < n; i++) {
      match = this.obj[i] === obj[i] ? match : false;
    }
  } else {
    match = false;
  }
  this.assert(match, function() {
    return 'expected ' + this.obj.map(fn) + ' to list ' + obj.map(fn);
  }, function() {
    return 'expected ' + this.obj.map(fn) + ' to not list ' + obj.map(fn);
  });
  return this;
};

Array.prototype.select = function(key) {
  return this.map(function(obj) {
    return obj[key];
  });
};

function Sandbox(create) {
  var map = {};
  function fn(query) {
    if (Array.isArray(query)) {
      return fn.list(query);
    } else {
      return fn.get(query) || fn.neo(query);
    }
  }
  fn.neo = function(id) {
    return map[id] = create(id);
  };
  fn.get = function(id) {
    return map[id];
  };
  fn.list = function(ids) {
    return ids.map(function(id) {
      return map[id];
    });
  };
  return fn;
}
