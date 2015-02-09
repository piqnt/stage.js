Cut(function(root, container) {

  Cut.Mouse(root, container, true);

  root.viewbox(400, 100).id('root');

  var row = Cut.row().appendTo(root).pin("align", 0.5).spacing(1).id('row');

  Cut.anim("base:color_").appendTo(row).on(Cut.Mouse.CLICK, function(point) {
    this.moveFrame(1);
  }).id('click');

  Cut.anim("base:color_").appendTo(row).on(Cut.Mouse.START, function(point) {
    this.moveFrame(1);
  }).id('start');

  Cut.anim("base:color_").appendTo(row).on(Cut.Mouse.END, function(point) {
    this.moveFrame(1);
  }).id('end');

});