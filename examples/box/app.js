Cut.Loader.load(function(root, container) {

  Cut.Mouse.subscribe(root, container, true);

  var frame = Cut.create().id("frame").appendTo(root);

  frame.listen("resize", function(width, height) {
    this.pin({
      width : 300,
      height : 200,
      resizeMode : "in",
      resizeWidth : width,
      resizeHeight : height,
    });
  });

  var popup = Cut.image("base:box").box().stretch().pin("align", 0.5).id("bg")
      .padding(10).appendTo(frame);

  Cut.string("base:d_").setValue("0123456789").pin("align", 0.5).id("str")
      .appendTo(popup);

  function confirm(string) {
    popup.empty().appendTo(frame);

    var column = Cut.column(0).pin("align", 0.5).spacing(20).appendTo(popup);

    for ( var i = 0; i < string.length; i++) {
      var str = string[i];
      Cut.string("base:d_").setValue(str).appendTo(column);
    }

    var row = Cut.row().appendTo(column).spacing(25);

    var yes = Cut.string("base:d_").setValue("012345").pin("align", 0.5);
    var no = Cut.string("base:d_").setValue("6789").pin("align", 0.5);

    Cut.image("base:box").box().stretch().appendTo(row).append(yes).listen(
        Cut.Mouse.CLICK, function() {
          popup.remove();
          return true;
        });

    Cut.image("base:box").box().stretch().appendTo(row).append(no).listen(
        Cut.Mouse.CLICK, function() {
          popup.remove();
          return true;
        });
  }
  
});