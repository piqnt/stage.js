var expect = require('./expect');
var rewire = require("rewire");
var sinon = require('sinon');
var sandbox = require('./sandbox');

var Cut = require('../lib/core');
var Texture = Cut.Texture;

describe('Texture', function() {

  var texture = new Texture({
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

  it('Instance', function() {

    var dark = texture.select("color_dark");
    var both = texture.select("color_", true);

    // console.log(dark);
    // console.log(both);

    expect(dark).be.an('object');
    expect(both).be.an('array');
    expect(both.length).be(2);
    expect(both[0]).be.an('object');
    expect(both[1]).be.an('object');

    expect(texture.select("missing")).be.an('undefined');
    expect(texture.select("missing", true)).be.an('undefined');

  });

  it('Class', function() {
    Texture.add(texture);

    var dark = Texture.select("base:color_dark");
    var both = Texture.select("base:color_", true);

    // console.log(dark);
    // console.log(both);

    expect(dark).be.an('object');
    expect(both).be.an('array');
    expect(both.length).be(2);
    expect(both[0]).be.an('object');
    expect(both[1]).be.an('object');

    var dark = Texture.select("color_dark");
    var both = Texture.select("color_", true);

    expect(dark).be.an('object');
    expect(both).be.an('array');
    expect(both.length).be(2);
    expect(both[0]).be.an('object');
    expect(both[1]).be.an('object');

    expect(Texture.select("color_dark")).not.be(dark);
    expect(Texture.select("color_dark")).eql(dark);
    expect(Texture.select("color_", true)[0]).not.be(both[0]);
    expect(Texture.select("color_", true)[1]).not.be(both[1]);
    expect(Texture.select("color_", true)[0]).eql(both[0]);
    expect(Texture.select("color_", true)[1]).eql(both[1]);

  });
});