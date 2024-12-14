import Stage from "../../src";

// Textures
await Stage.atlas({
  textures: {
    bg: Stage.canvas(function (ctx) {
      let ratio = 20;
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
      ctx.lineCap = "round";
      ctx.strokeStyle = "#999";
      ctx.stroke();
    }),
    x: Stage.canvas(function (ctx) {
      let ratio = 20;
      this.size(10, 10, ratio);
      ctx.scale(ratio, ratio);
      ctx.moveTo(2, 2);
      ctx.lineTo(8, 8);
      ctx.moveTo(2, 8);
      ctx.lineTo(8, 2);
      ctx.lineWidth = 0.5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.stroke();
    }),
    o: Stage.canvas(function (ctx) {
      let ratio = 20;
      this.size(10, 10, ratio);
      ctx.scale(ratio, ratio);
      ctx.arc(5, 5, 2.4, 0, 2 * Math.PI);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#000";
      ctx.stroke();
    }),
    "-": Stage.canvas(function (ctx) {
      let ratio = 20;
      this.size(10, 10, ratio);
    }),
  },
});

// Game logic

function Game(ui) {
  let cells = [];
  let turn = -1;

  this.ready = function () {
    return turn >= 0 && turn < 9;
  };

  this.init = function () {
    console.log("game init");
    cells = [];
    for (let i = -1; i <= 1; i++) {
      cells[i] = [];
      for (let j = -1; j <= 1; j++) {
        let cell = (cells[i][j] = {
          i: i,
          j: j,
        });
        cell.ui = ui.cell(cell);
      }
    }
  };

  this.start = function () {
    console.log("game start");
    if (cells.length == 0) {
      this.init();
    }
    turn = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        cells[i][j].sign = null;
        cells[i][j].ui.update();
      }
    }
  };

  this.click = function (cell) {
    console.log("game click");
    if (turn < 0 || cell.sign) {
      return;
    }
    cell.sign = turn++ % 2 == 0 ? "o" : "x";
    cell.ui.update();
    let row = test(cell.i, cell.j, cell.sign);
    if (row) {
      turn = -1;
      ui.win(row, cell.sign);
    } else if (turn >= 9) {
      turn = -1;
      ui.draw();
    }
  };

  function test(i, j, sign) {
    console.log("game test");
    if (cells[-1][j].sign == sign && cells[0][j].sign == sign && cells[+1][j].sign == sign)
      return [cells[-1][j], cells[0][j], cells[+1][j]];
    if (cells[i][-1].sign == sign && cells[i][0].sign == sign && cells[i][+1].sign == sign)
      return [cells[i][-1], cells[i][0], cells[i][+1]];
    if (
      i == j &&
      cells[-1][-1].sign == sign &&
      cells[0][0].sign == sign &&
      cells[+1][+1].sign == sign
    )
      return [cells[-1][-1], cells[0][0], cells[+1][+1]];
    if (
      i == -j &&
      cells[-1][+1].sign == sign &&
      cells[0][0].sign == sign &&
      cells[+1][-1].sign == sign
    )
      return [cells[-1][+1], cells[0][0], cells[+1][-1]];
  }
}

// UI

let stage = Stage.mount();

stage.viewbox(50, 50).pin("handle", -0.5);

Stage.sprite("bg").pin("handle", 0.5).appendTo(stage);

const game = new Game({
  cell: function (obj) {
    console.log("ui new cell");
    let img = Stage.sprite("x")
      .appendTo(stage)
      .pin({
        offsetX: obj.i * 10,
        offsetY: obj.j * 10,
        handle: 0.5,
      })
      .on("click", function () {
        if (game.ready()) {
          game.click(obj);
        } else {
          game.start();
        }
      });
    return {
      update: function () {
        console.log("ui update cell");
        img.texture(obj.sign || "-").pin({
          alpha: 0.8,
          scale: 1,
        });
      },
      win: function () {
        img.tween(200).pin({
          alpha: 1,
          scale: 1.2,
        });
      },
    };
  },
  win: function (row, sign) {
    console.log("ui win");
    for (let i = 0; i < row.length; i++) {
      row[i].ui.win();
    }
  },
  draw: function () {
    console.log("ui draw");
  },
});

game.start();
