function Game() {
  var cells = [], turn = 0, ready = false;

  this.ready = function() {
    return ready;
  };

  this.init = function() {
    console.log('Game.init');
    cells = [];
    for (var i = -1; i <= 1; i++) {
      cells[i] = [];
      for (var j = -1; j <= 1; j++) {
        cells[i][j] = {
          i : i,
          j : j
        };
        this.uiNewCell(cells[i][j]);
      }
    }
  };

  this.start = function() {
    console.log('Game.start');
    if (cells.length == 0) {
      this.init();
    }
    turn = 0, ready = true;
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        cells[i][j].sign = null;
        this.uiUpdateCell(cells[i][j]);
      }
    }
  };

  this.click = function(cell) {
    console.log('Game.click');
    if (!ready || cell.sign) {
      return;
    }
    cell.sign = (turn++ % 2 == 0) ? 'o' : 'x';
    this.uiUpdateCell(cell);
    var row = test(cell.i, cell.j, cell.sign);
    if (row) {
      ready = false;
      this.uiWin(row, cell.sign);
    } else if (turn >= 9) {
      ready = false;
      this.uiDraw(row, cell.sign);
    }
  };

  function test(i, j, sign) {
    console.log('Game.test');
    if (cells[-1][j].sign == sign && cells[0][j].sign == sign
        && cells[+1][j].sign == sign)
      return [ cells[-1][j], cells[0][j], cells[+1][j] ];
    if (cells[i][-1].sign == sign && cells[i][0].sign == sign
        && cells[i][+1].sign == sign)
      return [ cells[i][-1], cells[i][0], cells[i][+1] ];
    if (i == j && cells[-1][-1].sign == sign && cells[0][0].sign == sign
        && cells[+1][+1].sign == sign)
      return [ cells[-1][-1], cells[0][0], cells[+1][+1] ];
    if (i == -j && cells[-1][+1].sign == sign && cells[0][0].sign == sign
        && cells[+1][-1].sign == sign)
      return [ cells[-1][+1], cells[0][0], cells[+1][-1] ];
  }

}

Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(50, 50).pin('handle', -0.5);

  Cut.image('bg').pin('handle', 0.5).appendTo(root);

  var game = new Game();

  game.uiNewCell = function(cell) {
    console.log('Game.uiNewCell');
    cell.ui = Cut.image('x').appendTo(root).pin({
      offsetX : cell.i * 10,
      offsetY : cell.j * 10,
      handle : 0.5
    }).on('click', function() {
      if (game.ready()) {
        game.click(cell);
      } else {
        game.start();
      }
    });
  };

  game.uiUpdateCell = function(cell) {
    console.log('Box.uiUpdateCell');
    cell.ui.image(cell.sign || '-');
    cell.ui.pin({
      alpha : 0.8,
      scale : 1
    });
  };

  game.uiWin = function name(row, sign) {
    console.log('Game.uiWin');
    for (var i = 0; i < row.length; i++) {
      var tween = row[i].ui.tween(200).pin({
        alpha : 1,
        scaleX : 1.2,
        scaleY : 1.2
      });
    }
  };

  game.uiDraw = function() {
    console.log('Game.uiDraw');
  };

  game.start();
});

Cut({
  cutouts : [ Cut.drawing('bg', function(ctx) {
    var ratio = 20;
    this.size(30, 30, ratio);
    ctx.scale(ratio, ratio);
    ctx.moveTo(10, 1);
    ctx.lineTo(10, 29);
    ctx.moveTo(20, 1);
    ctx.lineTo(20, 29);
    ctx.moveTo(1, 10);
    ctx.lineTo(29, 10);
    ctx.moveTo(1, 20);
    ctx.lineTo(29, 20);
    ctx.lineWidth = 0.3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#999';
    ctx.stroke();

  }), Cut.drawing('x', function(ctx) {
    var ratio = 20;
    this.size(10, 10, ratio);
    ctx.scale(ratio, ratio);
    ctx.moveTo(2, 2);
    ctx.lineTo(8, 8);
    ctx.moveTo(2, 8);
    ctx.lineTo(8, 2);
    ctx.lineWidth = 0.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.stroke();

  }), Cut.drawing('o', function(ctx) {
    var ratio = 20;
    this.size(10, 10, ratio);
    ctx.scale(ratio, ratio);
    ctx.arc(5, 5, 2.4, 0, 2 * Math.PI);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#000';
    ctx.stroke();

  }), Cut.drawing('-', function(ctx) {
    var ratio = 20;
    this.size(10, 10, ratio);

  }) ]
});