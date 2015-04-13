var expect = require('./util/expect');
var sandboxed = require('sandboxed-module');
var sinon = require('sinon');

var Cut = require('../lib/node');
var Texture = require('../lib/texture');
var Atlas = require('../lib/atlas');

var mario = {
  x : 1,
  y : 2,
  width : 3,
  height : 4
};

function bemario(obj) {

  expect(obj.draw).be.a('function');

  expect(obj.width).be(mario.width);
  expect(obj.height).be(mario.height);

  expect(obj._sx).be(mario.x);
  expect(obj._sy).be(mario.y);
  expect(obj._sw).be(mario.width);
  expect(obj._sh).be(mario.height);

  expect(obj._dx).be(0);
  expect(obj._dy).be(0);
  expect(obj._dw).be(mario.width);
  expect(obj._dh).be(mario.height);
}

it('Atlas', function() {
  var selected;

  selected = new Atlas({
    textures : {
      mario : mario
    }
  }).select('mario');

  bemario(selected);

  selected = new Atlas({
    textures : {
      walk : [ mario, mario, mario ]
    }
  }).select('walk');
  expect(selected.length).be(3);
  bemario(selected[0]);

  selected = new Atlas({
    textures : {
      mario : function() {
        return mario;
      }
    }
  }).select('mario');
  bemario(selected);

  selected = new Atlas({
    textures : {
      mario : mario,
      him : function() {
        return 'mario';
      }
    }
  }).select('mario');
  bemario(selected);

  selected = new Atlas({
    textures : {
      mario : mario,
      walk : [ 'mario', 'mario', 'mario' ]
    }
  }).select('walk');
  expect(selected.length).be(3);
  bemario(selected[0]);

  selected = new Atlas({
    textures : {
      char : {
        mario : mario
      }
    }
  }).select('char', 'mario');
  bemario(selected);

});

it('.atlas()/.texture()', function() {
  var Cut, atlas, obj, selected;

  Cut = sandboxed.require('../lib/');
  atlas = Cut.atlas({
    name : 'name',
    textures : {
      'mario' : mario,
      'walk' : [ 'mario', 'mario', 'mario' ]
    }
  });

  selected = Cut.texture('name:mario');
  bemario(selected);

  selected = Cut.texture('mario');
  bemario(selected);

  selected = Cut.texture('mario', obj = []);
  expect(selected).be(obj);
  expect(selected.length).be(1);
  bemario(selected[0]);

  selected = Cut.texture('walk', obj = []);
  expect(selected).be(obj);
  expect(selected.length).be(3);
  bemario(selected[0]);

  selected = Cut.texture('walk');
  bemario(selected);
});

describe('Cut.cutouts', function() {
  // TODO: test cutouts
  return;

  var atlas = new Atlas({
    name : "main",
    imagePath : "main.png",
    imageRatio : 4,
    trim : 0.1,
    cutouts : [ {
      name : "color_dark",
      x : 0,
      y : 0,
      width : 16,
      height : 16
    }, {
      name : "color_light",
      x : 16,
      y : 16,
      width : 16,
      height : 16
    } ]
  });

  it('class', function() {

    var dark = atlas.select("color_dark");
    var both = atlas.select("color_", true);

    // console.log(dark);
    // console.log(both);

    expect(dark).be.an('object');
    expect(both).be.an('array');
    expect(both.length).be(2);
    expect(both[0]).be.an('object');
    expect(both[1]).be.an('object');

    expect(atlas.select("missing")).be.an('undefined');
    expect(atlas.select("missing", true)).be.an('undefined');

  });

  it('texture', function() {
    Cut.atlas(atlas);

    var dark = Cut.texture("base:color_dark");
    var both = Cut.texture("base:color_", true);

    // console.log(dark);
    // console.log(both);

    expect(dark).be.an('object');
    expect(both).be.an('array');
    expect(both.length).be(2);
    expect(both[0]).be.an('object');
    expect(both[1]).be.an('object');

    var dark = Cut.texture("color_dark");
    var both = Cut.texture("color_", true);

    expect(dark).be.an('object');
    expect(both).be.an('array');
    expect(both.length).be(2);
    expect(both[0]).be.an('object');
    expect(both[1]).be.an('object');

    expect(Cut.texture("color_dark")).be(dark);
    expect(Cut.texture("color_", true)[0]).be(both[0]);
    expect(Cut.texture("color_", true)[1]).be(both[1]);

  });
});