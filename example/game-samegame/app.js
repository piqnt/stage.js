import Stage from "../../src";
import "./textures";

let math = Stage.math;

function Game(ui, width, height) {
  let tiles = [];
  let tilesMap = {};

  this.start = function (colors) {
    colors = colors || 4;
    while (tiles.length) {
      tiles[0].remove();
    }
    tilesMap = {};
    tiles = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        new Tile((math.random() * colors + 1) | 0).insert(i, j);
      }
    }
  };

  this.click = function (tile) {
    if (matchTile(tile)) {
      collapseDown();
      setTimeout(function () {
        collapseLeft();
      }, 200);
    }
  };

  function matchTile(tile) {
    let matched = [];
    tile.match(matched);
    if (matched.length <= 1) {
      return false;
    }
    for (let i = 0; i < matched.length; i++) {
      matched[i].remove();
    }
    return true;
  }

  function collapseDown() {
    let moved = false;
    do {
      moved = false;
      for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        if (tile.j + 1 < height && tile.move(tile.i, tile.j + 1)) {
          moved = true;
        }
      }
    } while (moved);
    updateTiles();
  }

  function collapseLeft() {
    do {
      let moved = false;
      for (let i = 0; i < width - 1; i++) {
        let empty = true;
        for (let j = 0; j < height && empty; j++) {
          empty = !getTile(i, j);
        }
        if (!empty) {
          continue;
        }
        for (let j = 0; j < height; j++) {
          let tile = getTile(i + 1, j);
          if (tile) {
            tile.move(i, j);
            moved = true;
          }
        }
      }
    } while (moved);
    updateTiles();
  }

  function getTile(i, j) {
    return tilesMap[i + ":" + j];
  }

  function setTile(i, j, tile) {
    if (tilesMap[i + ":" + j]) {
      console.log("Location unavailable: " + i + ":" + j);
      return;
    }
    tilesMap[i + ":" + j] = tile;
  }

  function unsetTile(i, j, tile) {
    if (tilesMap[i + ":" + j] !== tile) {
      console.log("Invalid location: " + i + ":" + j);
      return;
    }
    delete tilesMap[i + ":" + j];
  }

  function updateTiles() {
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].update();
    }
  }

  function Tile(color) {
    this.color = color;
    this.ui = ui.tile(this);
  }

  Tile.prototype.match = function (list, search, color) {
    search = search || +new Date();
    if (search == this.search) {
      return;
    }
    this.search = search;
    color = color || this.color;
    if (color != this.color) {
      return;
    }
    list.push(this);
    let next;
    if ((next = getTile(this.i + 1, this.j))) {
      next.match(list, search, color);
    }
    if ((next = getTile(this.i - 1, this.j))) {
      next.match(list, search, color);
    }
    if ((next = getTile(this.i, this.j + 1))) {
      next.match(list, search, color);
    }
    if ((next = getTile(this.i, this.j - 1))) {
      next.match(list, search, color);
    }
  };

  Tile.prototype.insert = function (i, j) {
    setTile(i, j, this);
    this.i = i;
    this.j = j;
    tiles.push(this);
    this.ui.add();
  };

  Tile.prototype.move = function (i, j) {
    if (getTile(i, j)) {
      return false;
    }
    unsetTile(this.i, this.j, this);
    setTile((this.i = i), (this.j = j), this);
    this.dirty = true;
    return true;
  };

  Tile.prototype.update = function (i, j) {
    if (this.dirty) {
      this.dirty = false;
      this.ui.update();
    }
  };

  Tile.prototype.remove = function () {
    unsetTile(this.i, this.j, this);
    tiles.splice(tiles.indexOf(this), 1);
    this.ui.remove();
  };
}

let stage = Stage.mount();

stage.background("#222222");
stage.viewbox(24, 24);

let width = 8,
  height = 8;

let board = Stage.component()
  .appendTo(stage)
  .pin({
    width: width * 2,
    height: height * 2,
    align: 0.5,
  });

Stage.sprite("easy")
  .appendTo(board)
  .pin({
    alignX: 1,
    alignY: 1,
    handleY: 0,
    offsetX: -2,
    offsetY: 0.5,
  })
  .on("click", function () {
    game.start(4);
  });

Stage.sprite("hard")
  .appendTo(board)
  .pin({
    alignX: 1,
    alignY: 1,
    handleY: 0,
    offsetX: 0.1,
    offsetY: 0.5,
  })
  .on("click", function () {
    game.start(5);
  });

// create game with ui callbacks
const game = new Game(
  {
    tile: function (tile) {
      let img = Stage.sprite("tile-" + tile.color)
        .pin({
          handle: 0.5,
        })
        .on("click", function (point) {
          game.click(tile);
        });
      return {
        add: function () {
          img.appendTo(board).offset(tile.i * 2 + 1, tile.j * 2 + 1);
        },
        update: function () {
          img
            .tween(200)
            .ease("quad-out")
            .offset(tile.i * 2 + 1, tile.j * 2 + 1);
        },
        remove: function () {
          img.tween(150).alpha(0).remove();
        },
      };
    },
  },
  width,
  height,
);

game.start();
