Cut(function(root, container) {

  Cut.Mouse(root, container, true);

  root.viewbox(500, 300);

  root.on(Cut.Mouse.CLICK, function(point) {
    bar1.tween().clear().pin("width", Cut.Math.random(20, 100) | 0);
    bar2.tween().clear().pin("width", Cut.Math.random(20, 100) | 0);
    bar3.tween().clear().pin("width", Cut.Math.random(20, 100) | 0);
    bar4.tween().clear().pin("width", Cut.Math.random(20, 100) | 0);
    bar5.tween().clear().pin("height", Cut.Math.random(20, 100) | 0);
    bar6.tween().clear().pin("height", Cut.Math.random(20, 100) | 0);
    bar7.tween().clear().pin("height", Cut.Math.random(20, 100) | 0);
    bar8.tween().clear().pin("height", Cut.Math.random(20, 100) | 0);
  });

  var bar1 = Cut.image("base:box").stretch().id("bar1");
  var bar2 = Cut.image("base:box").stretch().id("bar2");
  var bar3 = Cut.image("base:box").stretch().id("bar3");
  var bar4 = Cut.image("base:box").stretch().id("bar4");
  var bar5 = Cut.image("base:box").stretch().id("bar1");
  var bar6 = Cut.image("base:box").stretch().id("bar2");
  var bar7 = Cut.image("base:box").stretch().id("bar3");
  var bar8 = Cut.image("base:box").stretch().id("bar4");

  Cut.column(1).append(bar1, bar2).appendTo(root).pin({
    alignX : 1,
    alignY : 0,
    offsetX : -10,
    offsetY : 10
  }).id("topleft");

  Cut.column(0).append(bar3, bar4).appendTo(root).pin({
    alignX : 0,
    alignY : 1,
    offsetX : 10,
    offsetY : -10
  }).id("bottomright");

  Cut.row(0).append(bar5, bar6).appendTo(root).pin({
    alignX : 0,
    alignY : 0,
    offsetX : 10,
    offsetY : 10
  }).id("topleft");

  Cut.row(1).append(bar7, bar8).appendTo(root).pin({
    alignX : 1,
    alignY : 1,
    offsetX : -10,
    offsetY : -10
  }).id("bottomleft");

});
