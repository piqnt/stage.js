Cut(function(root, container) {

  Cut.Mouse(root, container, true);

  root.viewbox(400, 100);

  var turn = false;

  Cut.image("base:color_dark").appendTo(root).pin("align", 0.5).on(
      Cut.Mouse.CLICK, function(point) {
        turn = !turn;
        this.tween(500, 500).clear().pin({
          scaleX : turn ? 2 : 1,
          scaleY : turn ? 1 : 2
        });
        return true;
      });

});
