var expect = require('./util/expect');
var rewire = require("rewire");
var sinon = require('sinon');
var sandbox = require('./util/sandbox');

var Cut = require('../lib/node');
var Texture = require('../lib/texture');
var Atlas = require('../lib/atlas');

describe('Atlas', function() {

  var atlas = new Atlas({
    name : "base",
    imagePath : "texture.png",
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