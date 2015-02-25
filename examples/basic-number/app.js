Cut(function(root, container) {

  Cut.Mouse(root, container);

  root.viewbox(300, 200);

  var popup = Cut.image('box').box().stretch().pin('align', 0.5).id('bg')
      .padding(10).appendTo(root);

  var number = Cut.string('d_').value('0123456789').pin('align', 0.5).id('str')
      .appendTo(popup);

  root.on(Cut.Mouse.CLICK,
      function(point) {
        number.value(Cut.Math.random(0, Math
            .pow(10, Cut.Math.random(0, 10) | 0)) | 0);
        return true;
      });

  function confirm(string) {
    popup.empty().appendTo(root);

    var column = Cut.column(0).pin('align', 0.5).spacing(20).appendTo(popup);

    for (var i = 0; i < string.length; i++) {
      var str = string[i];
      Cut.string('d_').value(str).appendTo(column);
    }

    var row = Cut.row().appendTo(column).spacing(25);

    var yes = Cut.string('d_').value('012345').pin('align', 0.5);
    var no = Cut.string('d_').value('6789').pin('align', 0.5);

    Cut.image('box').box().stretch().appendTo(row).append(yes).on(
        Cut.Mouse.CLICK, function() {
          popup.remove();
          return true;
        });

    Cut.image('box').box().stretch().appendTo(row).append(no).on(
        Cut.Mouse.CLICK, function() {
          popup.remove();
          return true;
        });
  }

});