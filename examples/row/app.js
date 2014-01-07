Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var frame = Cut.create().id("frame").appendTo(root);

  frame.listen("resize", function(width, height) {
    this.pin({
      width : 500,
      height : 300,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  }).listen(Cut.Mouse.CLICK, function(ev, point) {
    cell1.pin("width", Cut.Math.random(20, 100) | 0);
    cell2.pin("width", Cut.Math.random(20, 100) | 0);
  });

  var cell1 = Cut.image("base:box").stretch().id("r1");
  var cell2 = Cut.image("base:box").stretch().id("r2");

  Cut.column(1).append(cell1, cell2).appendTo(frame).pin({
    alignX : 1,
    alignY : 0,
    offsetX : -10,
    offsetY : 10
  }).id("column");
  
});
