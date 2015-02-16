Cut(function(root, container) {

  Cut.Mouse(root, container);

  root.viewbox(100, 100);

  var toggle = true;
  Cut.anim("base:color_").appendTo(root).pin("align", 0.5).fps(4).on(
      Cut.Mouse.CLICK, function(point) {
        if (toggle) {
          console.log('play');
          this.play();
        } else {
          console.log('stop');
          this.stop();
        }
        toggle = !toggle;
      });

});