var expect = require('./util/expect');
var sinon = require('sinon');

var Cut = require('../lib/node');
require('../lib/event');

it('event on/off', function() {
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
