var expect = require('./util/expect');
var sinon = require('sinon');

var Stage = require('../lib/tree');
require('../lib/event');

describe('Event', function() {

  it('on/off', function() {
    var hello = sinon.stub();
    var open = sinon.stub();

    var door = Stage.create();

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

  it('flag', function() {
    var foo = Stage.create();
    var bar = Stage.create();
    var baz = Stage.create();
    var qux = Stage.create();

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

});