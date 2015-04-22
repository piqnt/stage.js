function Game(width, height) {
  var _map = {}, _tiles = [];

  this.start = function(colors) {
    colors = colors || 4;
    while (_tiles.length) {
      _tiles[0].remove();
    }
    _map = {}, _tiles = [];
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        new Tile((Math.random() * colors + 1 | 0)).insert(i, j);
      }
    }
  };

  this.click = function(tile) {
    if (remove(tile)) {
      collapseDown();
      setTimeout(function() {
        collapseLeft();
      }, 200);
    }
  };

  function updateTiles() {
    for (var i = 0, n = _tiles.length; i < n; i++) {
      var tile = _tiles[i];
      if (tile.dirty) {
        tile.uiUpdate();
        tile.dirty = false;
      }
    }
  }

  function remove(tile) {
    var matched = [];
    tile.match(matched);
    if (matched.length <= 1) {
      return false;
    }
    for (var i = 0; i < matched.length; i++) {
      matched[i].remove();
    }
    return true;
  }

  function collapseDown() {
    do { // collapse down
      moved = false;
      for (var i = 0; i < _tiles.length; i++) {
        var tile = _tiles[i];
        if (tile.j + 1 < height && tile.move(tile.i, tile.j + 1)) {
          moved = true;
        }
      }
    } while (moved);
    updateTiles();
  }

  function collapseLeft() {
    do { // collapse left
      moved = false;
      for (var i = 0; i < width - 1; i++) {
        var empty = true;
        for (var j = 0; j < height && empty; j++) {
          empty = !getTile(i, j);
        }
        if (!empty) {
          continue;
        }
        for (var j = 0; j < height; j++) {
          var tile = getTile(i + 1, j);
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
    return _map[i + ':' + j];
  }

  function setTile(i, j, tile) {
    if (_map[i + ':' + j]) {
      throw 'Location unavailable: ' + i + ':' + j;
    }
    _map[i + ':' + j] = tile;
  }

  function unsetTile(i, j, tile) {
    if (_map[i + ':' + j] !== tile) {
      throw 'Invalid location: ' + i + ':' + j;
    }
    delete _map[i + ':' + j];
  }

  function Tile(color) {
    this.color = color;
  }

  Tile.prototype.match = function(list, search, color) {
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
    if (next = getTile(this.i + 1, this.j)) {
      next.match(list, search, color);
    }
    if (next = getTile(this.i - 1, this.j)) {
      next.match(list, search, color);
    }
    if (next = getTile(this.i, this.j + 1)) {
      next.match(list, search, color);
    }
    if (next = getTile(this.i, this.j - 1)) {
      next.match(list, search, color);
    }
  };

  Tile.prototype.insert = function(i, j) {
    setTile(i, j, this);
    this.i = i;
    this.j = j;
    _tiles.push(this);
    this.uiInsert();
  };

  Tile.prototype.move = function(i, j) {
    if (getTile(i, j)) {
      return false;
    }
    unsetTile(this.i, this.j, this);
    setTile(this.i = i, this.j = j, this);
    this.dirty = true;
    return true;
  };

  Tile.prototype.remove = function() {
    unsetTile(this.i, this.j, this);
    _tiles.splice(_tiles.indexOf(this), 1);
    this.uiRemove();
  };

  this.Tile = Tile;
}

Stage(function(stage) {

  stage.viewbox(24, 24);

  var width = 8, height = 8;

  var ui = {};

  ui.board = Stage.create().appendTo(stage).pin({
    width : width * 2,
    height : height * 2,
    align : 0.5
  });

  Stage.image('easy').appendTo(ui.board).pin({
    alignX : 1,
    alignY : 1,
    handleY : 0,
    offsetX : -2,
    offsetY : 0.5
  }).on(Stage.Mouse.CLICK, function() {
    game.start(4);
  });

  Stage.image('hard').appendTo(ui.board).pin({
    alignX : 1,
    alignY : 1,
    handleY : 0,
    offsetX : 0.1,
    offsetY : 0.5
  }).on(Stage.Mouse.CLICK, function() {
    game.start(5);
  });

  var game = new Game(width, height);

  game.Tile.prototype.uiInsert = function() {
    var self = this;
    this.ui = Stage.image('tile-' + this.color).appendTo(ui.board);
    this.ui.pin({
      offsetX : this.i * 2 + 1,
      offsetY : this.j * 2 + 1,
      handle : 0.5
    }).on(Stage.Mouse.CLICK, function(point) {
      game.click(self);
    });
  };

  game.Tile.prototype.uiUpdate = function() {
    this.ui.tween(200).ease('quad-out').clear().pin({
      offsetX : this.i * 2 + 1,
      offsetY : this.j * 2 + 1
    });
  };

  game.Tile.prototype.uiRemove = function() {
    console.log('rm');
    this.ui.tween(150).clear().pin({
      alpha : 0
    }).then(function() {
      this.remove();
    });
  };

  game.start();
});