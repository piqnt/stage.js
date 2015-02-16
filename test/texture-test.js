var expect = require('./expect');
var rewire = require("rewire");
var sinon = require('sinon');
var sandbox = require('./sandbox');

var Cut = require('../cut-core');

it('Visit', function() {
  var texture = new Cut.Texture({
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

  var dark = texture.select("color_dark");
  var both = texture.select("color_", true);

  console.log(dark);
  console.log(both);

  expect(dark).be.an('object');
  expect(both).be.an('array');
  expect(both.length).be(2);
  expect(both[0]).be.an('object');
  expect(both[1]).be.an('object');

  Cut.Texture.add(texture);

  var dark = Cut.Texture.select("base:color_dark");
  var both = Cut.Texture.select("base:color_", true);

  console.log(dark);
  console.log(both);

  expect(dark).be.an('object');
  expect(both).be.an('array');
  expect(both.length).be(2);
  expect(both[0]).be.an('object');
  expect(both[1]).be.an('object');
});
