function Game(width, height) {
  var ID = 0;
  var _map = {}, _blocks = [];

  this.blocks = function() {
    return _blocks;
  };

  this.restart = function(colors) {
    colors = colors || 4;
    _map = {}, _blocks = [];
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        new Block((Math.random() * colors + 1 | 0)).insert(i, j);
      }
    }
    this.uiUpdate();
  };

  this.click = function(block) {
    if (remove(block)) {
      collapseDown();
      this.uiUpdate();
      setTimeout(function() {
        collapseLeft();
        this.uiUpdate();
      }.bind(this), 200);
    }
  };

  function remove(block) {
    var matched = [];
    block.match(matched);
    if (matched.length <= 1) {
      return false;
    }
    for (var b = 0; b < matched.length; b++) {
      matched[b].remove();
    }
    return true;
  }

  function collapseDown() {

    do { // collapse down
      moved = false;
      for (var b = 0; b < _blocks.length; b++) {
        var block = _blocks[b];
        if (block.j + 1 < height && block.move(block.i, block.j + 1)) {
          moved = true;
        }
      }
    } while (moved);
  }

  function collapseLeft() {
    do { // collapse left
      moved = false;
      for (var i = 0; i < width - 1; i++) {
        var empty = true;
        for (var j = 0; j < height && empty; j++) {
          empty = !Block.get(i, j);
        }
        if (!empty) {
          continue;
        }
        for (var j = 0; j < height; j++) {
          var block = Block.get(i + 1, j);
          if (block) {
            block.move(i, j);
            moved = true;
          }
        }
      }
    } while (moved);

  }

  function Block(color) {
    this.id = ID++;
    this.color = color;

    this.match = function(list, search, color) {
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
      if (next = Block.get(this.i + 1, this.j)) {
        next.match(list, search, color);
      }
      if (next = Block.get(this.i - 1, this.j)) {
        next.match(list, search, color);
      }
      if (next = Block.get(this.i, this.j + 1)) {
        next.match(list, search, color);
      }
      if (next = Block.get(this.i, this.j - 1)) {
        next.match(list, search, color);
      }
    };

    this.insert = function(i, j) {
      Block.set(i, j, this);
      this.i = i;
      this.j = j;
      _blocks.push(this);
    };

    this.move = function(i, j) {
      if (Block.get(i, j)) {
        return false;
      }
      Block.unset(this.i, this.j, this);
      Block.set(this.i = i, this.j = j, this);
      this.dirty = true;
      return true;
    };

    this.remove = function() {
      Block.unset(this.i, this.j, this);
      _blocks.splice(_blocks.indexOf(this), 1);
    };
  }

  Block.get = function(i, j) {
    return _map[i + ':' + j];
  };

  Block.set = function(i, j, block) {
    if (_map[i + ':' + j]) {
      throw 'Location unavailable: ' + i + ':' + j;
    }
    _map[i + ':' + j] = block;
  };

  Block.unset = function(i, j, block) {
    if (_map[i + ':' + j] !== block) {
      throw 'Invalid location: ' + i + ':' + j;
    }
    delete _map[i + ':' + j];
  };

}

Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(24, 24);

  var width = 8, height = 8;

  var ui = {}, delta = {};

  ui.board = Cut.create().appendTo(root).pin({
    width : width * 2,
    height : height * 2,
    align : 0.5
  });

  Cut.image('base:easy').appendTo(ui.board).pin({
    alignX : 1,
    alignY : 1,
    handleY : 0,
    offsetX : -2,
    offsetY : 0.5
  }).on(Cut.Mouse.CLICK, function() {
    game.restart(4);
  });

  Cut.image('base:hard').appendTo(ui.board).pin({
    alignX : 1,
    alignY : 1,
    handleY : 0,
    offsetX : 0.1,
    offsetY : 0.5
  }).on(Cut.Mouse.CLICK, function() {
    game.restart(5);
  });

  delta.blocks = new Delta("id");

  var game = new Game(width, height);

  game.uiUpdate = function() {
    delta.blocks.data(game.blocks()).enter(function(block) {
      block.ui = Cut.image('base:block-' + block.color).appendTo(ui.board);
      block.ui.pin({
        offsetX : block.i * 2 + 1,
        offsetY : block.j * 2 + 1,
        handle : 0.5
      }).on(Cut.Mouse.CLICK, function(point) {
        game.click(block);
      });
    }).update(function(block) {
      if (block.dirty) {
        block.ui.tween(200).ease('quad-out').clear().pin({
          offsetX : block.i * 2 + 1,
          offsetY : block.j * 2 + 1
        });
        block.dirty = false;
      }
    }).exit(function(block) {
      block.ui.tween(150).clear().pin({
        alpha : 0
      }).then(function() {
        this.remove();
      });
    });
  };

  game.restart();

});