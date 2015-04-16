Cut(function(root, container) {

  Cut.Mouse(root, container);

  root.viewbox(300, 200);

  var window = Cut.image('dark').box().stretch().pin('align', 0.5).pin(
      'textureAlpha', 0.5).padding(7).appendTo(root);

  var column = Cut.column(1).pin('align', 0.5).spacing(5).appendTo(window);

  var text = Cut.string('digit').value('0123456789').appendTo(column);

  var row = Cut.row().appendTo(column).spacing(1);

  Cut.image('red').box().stretch().appendTo(row).append(
      Cut.string('digit').value('1')).on(Cut.Mouse.CLICK, function() {
    var range = Math.pow(10, Cut.Math.random(0, 10) | 0);
    text.value(Cut.Math.random(0, range) | 0);
  });

  Cut.image('blue').box().stretch().appendTo(row).append(
      Cut.string('digit').value('2')).on(Cut.Mouse.CLICK, function() {
    var range = Math.pow(10, Cut.Math.random(0, 10) | 0);
    text.value(Cut.Math.random(0, range) | 0);
  });

});