import Stage from "../../src";

// Textures
await Stage.atlas({
  textures: {
    bg: Stage.canvas(function (ctx) {
      const ratio = this.getOptimalPixelRatio() * 2;
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
      const ratio = this.getOptimalPixelRatio() * 2;
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
      const ratio = this.getOptimalPixelRatio() * 2;
      this.size(10, 10, ratio);
      ctx.scale(ratio, ratio);
      ctx.arc(5, 5, 2.4, 0, 2 * Math.PI);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#000";
      ctx.stroke();
    }),
    "-": Stage.canvas(function (ctx) {
      const ratio = this.getOptimalPixelRatio() * 2;
      this.size(10, 10, ratio);
    }),
  },
});

// Game logic

interface CellUiInterface {
  update(): void;
  win(): void;
}

interface GameUiInterface {
  cell(cell: Cell): CellUiInterface;
  win(row: Cell[], sign: any): void;
  draw(): void;
}

class Cell {
  i: number;
  j: number;
  sign?: "x" | "o";
  ui?: CellUiInterface;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }
}

class Game {
  _cells: Cell[][] = [];
  _turn = -1;
  _ui: GameUiInterface;

  constructor(ui: GameUiInterface) {
    this._ui = ui;
  }

  ready() {
    return this._turn >= 0 && this._turn < 9;
  }

  init() {
    console.log("game init");
    this._cells = [];
    for (let i = -1; i <= 1; i++) {
      this._cells[i] = [];
      for (let j = -1; j <= 1; j++) {
        this._cells[i][j] = new Cell(i, j);
        const cell = this._cells[i][j];
        cell.ui = this._ui.cell(cell);
      }
    }
  }

  start() {
    console.log("game start");
    if (this._cells.length == 0) {
      this.init();
    }
    this._turn = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        this._cells[i][j].sign = null;
        this._cells[i][j].ui.update();
      }
    }
  }

  click(cell: Cell) {
    console.log("game click");
    if (this._turn < 0 || cell.sign) {
      return;
    }
    cell.sign = this._turn++ % 2 == 0 ? "o" : "x";
    cell.ui.update();
    const row = this.test(cell);
    if (row) {
      this._turn = -1;
      this._ui.win(row, cell.sign);
    } else if (this._turn >= 9) {
      this._turn = -1;
      this._ui.draw();
    }
  }

  test({ i, j, sign }: Cell) {
    console.log("game test");
    if (
      this._cells[-1][j].sign == sign &&
      this._cells[0][j].sign == sign &&
      this._cells[+1][j].sign == sign
    )
      return [this._cells[-1][j], this._cells[0][j], this._cells[+1][j]];
    if (
      this._cells[i][-1].sign == sign &&
      this._cells[i][0].sign == sign &&
      this._cells[i][+1].sign == sign
    )
      return [this._cells[i][-1], this._cells[i][0], this._cells[i][+1]];
    if (
      i == j &&
      this._cells[-1][-1].sign == sign &&
      this._cells[0][0].sign == sign &&
      this._cells[+1][+1].sign == sign
    )
      return [this._cells[-1][-1], this._cells[0][0], this._cells[+1][+1]];
    if (
      i == -j &&
      this._cells[-1][+1].sign == sign &&
      this._cells[0][0].sign == sign &&
      this._cells[+1][-1].sign == sign
    )
      return [this._cells[-1][+1], this._cells[0][0], this._cells[+1][-1]];
  }
}

// UI

const stage = Stage.mount();
stage.viewbox(50, 50).pin("handle", -0.5);

Stage.sprite("bg").pin("handle", 0.5).appendTo(stage);

const game = new Game({
  cell: function (cell) {
    console.log("ui new cell");
    const sign = Stage.sprite("x");
    sign.appendTo(stage);
    sign.pin({
      offsetX: cell.i * 10,
      offsetY: cell.j * 10,
      handle: 0.5,
    });
    sign.on("click", function () {
      console.log("click", cell);
      console.log("ready", game.ready());
      if (game.ready()) {
        game.click(cell);
      } else {
        game.start();
      }
    });

    return {
      update: function () {
        console.log("ui update cell");
        sign.texture(cell.sign || "-").pin({
          alpha: 0.8,
          scale: 1,
        });
      },
      win: function () {
        sign.tween(200).pin({
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
