var expect = require('./expect');
var rewire = require("rewire");
var sinon = require('sinon');
var sandbox = require('./sandbox');

var Cut = require('../lib/core');
var Pin = Cut.Pin;

describe('Pin', function() {

  it('_set/_get', function() {
    var pin = {}, set = {
      alpha : 0.8,
      width : 200,
      height : 300,
      scaleX : 2,
      scaleY : 3,
    };
    for ( var key in set) {
      Pin._set(pin, key, set[key]);
    }
    for ( var key in set) {
      expect(pin['_' + key]).be(set[key]);
      expect(Pin._get(pin, key)).be(set[key]);
    }
  });

  it('.pin()', function() {
    var foo = Cut.create(), pin = foo.pin();
    foo.pin('scale', 2);
    expect(foo.pin('scaleX')).be(2);
    expect(foo.pin('scaleY')).be(2);
    foo.pin({
      width : 200,
      height : 300
    });
    expect(foo.pin('width')).be(200);
    expect(foo.pin('height')).be(300);
  });

  it('.scaleTo()', function() {
    var foo = Cut.create(), pin = foo.pin();
    foo.pin({
      width : 100,
      height : 100
    });
    foo.pin()._scaleTo(200, 300);
    expect(foo.pin('scaleX')).be(2);
    expect(foo.pin('scaleY')).be(3);
    expect(foo.pin('width')).be(100);
    expect(foo.pin('height')).be(100);

    foo.pin()._scaleTo(200, 300, 'in');
    expect(foo.pin('scaleX')).be(2);
    expect(foo.pin('scaleY')).be(2);
    expect(foo.pin('width')).be(100);
    expect(foo.pin('height')).be(100);

    foo.pin()._scaleTo(200, 300, 'out');
    expect(foo.pin('scaleX')).be(3);
    expect(foo.pin('scaleY')).be(3);
    expect(foo.pin('width')).be(100);
    expect(foo.pin('height')).be(100);

    foo.pin()._scaleTo(200, 400, 'out-crop');
    expect(foo.pin('scaleX')).be(4);
    expect(foo.pin('scaleY')).be(4);
    expect(foo.pin('width')).be(50);
    expect(foo.pin('height')).be(100);

    foo.pin()._scaleTo(200, 400, 'in-pad');
    expect(foo.pin('scaleX')).be(2);
    expect(foo.pin('scaleY')).be(2);
    expect(foo.pin('width')).be(100);
    expect(foo.pin('height')).be(200);
  });

});