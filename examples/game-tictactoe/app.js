Cut.Loader.load(function(root, container) {
  Cut.Mouse.subscribe(root, container);
  root.viewbox(50, 50).pin("handle", -0.5);

  Cut.image("base:bg").pin("handle", 0.5).appendTo(root);

  var cells = [], turn = 0, over = false;

  start();

  function start() {
    turn = 0, over = false;
    for (var i = -1; i <= 1; i++) {
      cells[i] = cells[i] || [];
      for (var j = -1; j <= 1; j++) {
        cells[i][j] = cells[i][j] || Cut.image().appendTo(root).pin({
          offsetX : i * 10,
          offsetY : j * 10,
          handle : 0.5
        }).on("click", function() {
          if (over) {
            start();
            return;
          }
          this.sign = (turn++ % 2 == 0) ? "o" : "x";
          this.setImage("base:" + this.sign);
          var line = test(this.i, this.j, this.sign);
          if (line) {
            over = true;
            for (var i = 0; i < line.length; i++) {
              var tween = line[i].tween(200).pin({
                alpha : 1,
                scaleX : 1.2,
                scaleY : 1.2
              });
            }
          }
        });
        cells[i][j].setImage("base:-").tween().clear().pin({
          alpha : 0.8,
          scale : 1
        });
        cells[i][j].i = i, cells[i][j].j = j, cells[i][j].sign = null;
      }
    }
  }

  function test(i, j, sign) {
    if (cells[-1][j].sign == sign && cells[0][j].sign == sign
        && cells[+1][j].sign == sign)
      return [ cells[-1][j], cells[0][j], cells[+1][j] ];
    if (cells[i][-1].sign == sign && cells[i][0].sign == sign
        && cells[i][+1].sign == sign)
      return [ cells[i][-1], cells[i][0], cells[i][+1] ];
    if (i == j && cells[-1][-1].sign == sign && cells[0][0].sign == sign
        && cells[+1][+1].sign == sign)
      return [ cells[-1][-1], cells[0][0], , cells[+1][+1] ];
    if (i == -j && cells[-1][+1].sign == sign && cells[0][0].sign == sign
        && cells[+1][-1].sign == sign)
      return [ cells[-1][+1], cells[0][0], cells[+1][-1] ];
  }
});