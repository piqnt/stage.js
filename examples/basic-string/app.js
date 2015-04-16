Cut(function(root, container) {

  Cut.Mouse(root, container);

  root.viewbox(300, 200);

  var box = Cut.image('box').box().stretch().padding(10).pin('align', 0.5).appendTo(root);

  var number = Cut.string('digit').value('0123456789').pin('align', 0.5)
      .appendTo(box);

  root.on(Cut.Mouse.CLICK, function(point) {
    var range = Math.pow(10, Cut.Math.random(0, 10) | 0);
    number.value(Cut.Math.random(0, range) | 0);
  });

});