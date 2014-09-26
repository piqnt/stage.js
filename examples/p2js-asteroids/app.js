(function() {

  var SHIP = Math.pow(2, 1);
  var BULLET = Math.pow(2, 2);
  var ASTEROID = Math.pow(2, 3);

  var spaceWidth = 16;
  var spaceHeight = 9;

  var shipSize = 0.30;
  var shipReloadTime = 0.1;
  var shipTurnSpeed = 4;

  var bulletLifeTime = 2;

  var asteroidRadius = 0.9;
  var asteroidSpeed = 2;
  var asteroidLevels = 4;

  var allowShipCollision = true;
  var hideShip = false;

  var world;

  var asteroidBodies = [];

  var bulletShape;
  var bulletBodies = [];

  var shipBody;

  var level, lives, lastShootTime = 0, gameover;

  var key = {}, keyName = {
    32 : "shoot",
    37 : "left",
    38 : "up",
    39 : "right",
    40 : "down"
  };

  document.onkeydown = function(evt) {
    gameover && start();
    key[keyName[evt.keyCode]] = true;
  };

  document.onkeyup = function(evt) {
    key[keyName[evt.keyCode]] = false;
  };

  function init() {
    // Init p2.js
    world = new p2.World({
      gravity : [ 0, 0 ],
    });

    // Create bullet shape
    bulletShape = new p2.Particle();
    bulletShape.collisionGroup = BULLET;
    bulletShape.collisionMask = ASTEROID;

    // Add ship physics

    var path = [ [ -0.15, -0.15 ], [ 0, -0.1 ], [ 0.15, -0.15 ], [ 0, 0.2 ] ];

    shipBody = new p2.Body({
      mass : 1,
      position : [ 0, 0 ],
      angularVelocity : 1
    }).noDamping();

    shipBody.fromPolygon(path);
    shipBody.shapes[0].collisionGroup = SHIP;
    shipBody.shapes[0].collisionMask = ASTEROID;

    // Catch impacts in the world
    // Todo: check if several bullets hit the same asteroid in the same time
    // step
    world.on("impact", function(evt) {
      var bodyA = evt.bodyA, bodyB = evt.bodyB;

      if ((bodyA.id == shipBody.id || bodyB.id == shipBody.id)) {
        // Ship collided with something
        if (!hideShip && allowShipCollision) {
          var aship = bodyA.shapes[0].collisionGroup == SHIP;
          var ship = aship ? bodyA : bodyB;
          var asteroid = !aship ? bodyA : bodyB;

          crash(ship, asteroid);
        }

      } else if (bodyA.shapes[0].collisionGroup == BULLET
          || bodyB.shapes[0].collisionGroup == BULLET) {
        // Bullet collided with something
        var abullet = bodyA.shapes[0].collisionGroup == BULLET;
        var bullet = abullet ? bodyA : bodyB;
        var asteroid = !abullet ? bodyA : bodyB;

        if (asteroid.shapes[0].collisionGroup == ASTEROID) {
          hit(asteroid, bullet);
        }
      }
    });
  }

  function start() {
    level = 1;
    lives = 3;
    // Update the text boxes
    uiStatus();
    play(true);
    addAsteroids();
    uiStart();
  }

  function play(position) {
    if (shipBody.world) {
      shipBody.world.removeBody(shipBody);
    }

    if (position) {
      shipBody.position[0] = shipBody.position[1] = 0;
    }
    shipBody.force[0] = shipBody.force[1] = 0;
    shipBody.velocity[0] = shipBody.velocity[1] = 0;
    shipBody.angularVelocity = shipBody.angle = 0;
    world.addBody(shipBody);
    hideShip = false;
    allowShipCollision = false;
    setTimeout(function() {
      allowShipCollision = true;
    }, 2000);
  }

  function tick() {
    // Set velocities
    shipBody.angularVelocity = 0;
    if (key.left) {
      shipBody.angularVelocity += shipTurnSpeed;
    }
    if (key.right) {
      shipBody.angularVelocity -= shipTurnSpeed;
    }

    // Thrust: add some force in the ship direction
    if (key.up) {
      var magnitude = 2, angle = shipBody.angle + Math.PI / 2;
      shipBody.force[0] += magnitude * Math.cos(angle);
      shipBody.force[1] += magnitude * Math.sin(angle);
    }

    // Shoot
    if (key.shoot && !hideShip && world.time > lastShootTime + shipReloadTime) {

      // Create a bullet body
      var bulletBody = new p2.Body({
        mass : 0.05,
        position : shipBody.position
      }).noDamping();
      bulletBody.addShape(bulletShape);
      bulletBodies.push(bulletBody);
      var magnitude = 2, angle = shipBody.angle + Math.PI / 2;

      // Give it initial velocity in the ship direction
      bulletBody.velocity[0] += magnitude * Math.cos(angle)
          + shipBody.velocity[0];
      bulletBody.velocity[1] += magnitude * Math.sin(angle)
          + shipBody.velocity[1];
      bulletBody.position[0] = shipSize * Math.cos(angle)
          + shipBody.position[0];
      bulletBody.position[1] = shipSize * Math.sin(angle)
          + shipBody.position[1];

      world.addBody(bulletBody);

      // Keep track of the last time we shot
      lastShootTime = world.time;

      // Remember when we should delete this bullet
      bulletBody.dieTime = world.time + bulletLifeTime;
    }

    for (var i = 0; i !== bulletBodies.length; i++) {
      var bulletBody = bulletBodies[i];

      // If the bullet is old, delete it
      if (bulletBody.dieTime <= world.time) {
        bulletBodies.splice(i, 1);
        world.removeBody(bulletBody);
        i--;
        continue;
      }
      wrap(bulletBody);
    }

    for (var i = 0; i !== asteroidBodies.length; i++) {
      var asteroidBody = asteroidBodies[i];
      wrap(asteroidBody);
    }

    wrap(shipBody);
  }

  // Adds some asteroids to the scene.
  function addAsteroids() {
    while (asteroidBodies.length) {
      var asteroidBody = asteroidBodies.shift();
      world.removeBody(asteroidBody);
      // asteroidBody.uiRemove();
    }

    for (var i = 0; i < level; i++) {
      var x = rand(spaceWidth);
      var y = rand(spaceHeight);
      var vx = rand(asteroidSpeed);
      var vy = rand(asteroidSpeed);
      var va = rand(asteroidSpeed);

      // Aviod the ship!
      if (Math.abs(x - shipBody.position[0]) < asteroidRadius * 2) {
        if (y - shipBody.position[1] > 0) {
          y += asteroidRadius * 2;
        } else {
          y -= asteroidRadius * 2;
        }
      }

      // Create asteroid body
      var asteroidBody = makeAsteroidBody(x, y, vx, vy, va, 0);
      asteroidBodies.push(asteroidBody);
      asteroidBody.level = 1;
      world.addBody(asteroidBody);
    }
  }

  function asteroidLevelRadius(level) {
    return asteroidRadius * (asteroidLevels - level) / asteroidLevels;
  }

  function makeAsteroidBody(x, y, vx, vy, va, level) {
    var asteroidBody = new p2.Body({
      mass : 10,
      position : [ x, y ],
      velocity : [ vx, vy ],
      angularVelocity : va
    }).noDamping();

    var radius = asteroidLevelRadius(level);

    var path = [];
    var n = 8;
    for (var i = 0; i < n; i++) {
      var a = i * 2 * Math.PI / n;
      var x = radius * (Math.sin(a) + rand(0.3));
      var y = radius * (Math.cos(a) + rand(0.3));
      path.push([ x, y ]);
    }

    asteroidBody.fromPolygon(path);

    for (var i = 0; i < asteroidBody.shapes.length; i++) {
      asteroidBody.shapes[i].collisionGroup = ASTEROID;
      asteroidBody.shapes[i].collisionMask = BULLET | SHIP;
    }

    return asteroidBody;
  }

  function crash(ship, asteroid) {

    if (asteroid.shapes[0].collisionGroup == ASTEROID) {
      lives--;
      uiStatus();

      // Remove the ship body for a while
      world.removeBody(shipBody);
      hideShip = true;

      if (lives <= 0) {
        uiEnd();
        return;
      }
      setTimeout(function() {
        // Add ship again
        play();
      }, 1000);
    }
  }

  function hit(asteroidBody, bulletBody) {
    var aidx = asteroidBodies.indexOf(asteroidBody);
    var bidx = bulletBodies.indexOf(bulletBody);
    if (aidx != -1 && bidx != -1) {

      // Remove asteroid
      world.removeBody(asteroidBody);
      asteroidBodies.splice(aidx, 1);
      // asteroidBody.uiRemove();

      // Remove bullet
      world.removeBody(bulletBody);
      bulletBodies.splice(bidx, 1);
      // bulletBody.uiRemove();

      // Add new sub-asteroids
      split(asteroidBody);
    }

    if (asteroidBodies.length == 0) {
      level++;
      uiStatus();
      addAsteroids();
    }
  }

  function split(parent) {
    if (parent.level < 4) {
      var x = parent.position[0], y = parent.position[1];
      var angleDisturb = Math.PI / 2 * Math.random();
      for (var i = 0; i < 4; i++) {
        var angle = Math.PI / 2 * i + angleDisturb;
        var r = asteroidLevelRadius(0) - asteroidLevelRadius(parent.level);
        var sx = x + r * Math.cos(angle);
        var sy = y + r * Math.sin(angle);
        var vx = rand(asteroidSpeed);
        var vy = rand(asteroidSpeed);
        var va = rand(asteroidSpeed);

        var child = makeAsteroidBody(sx, sy, vx, vy, va, parent.level);
        child.level = parent.level + 1;
        child.angle = rand() * Math.PI;
        world.addBody(child);
        asteroidBodies.push(child);
      }
    }
  }

  // If the body is out of space bounds, wrap it to the other side
  function wrap(body) {
    var p = body.position;
    p[0] = Cut.Math.rotate(p[0], -spaceWidth / 2, spaceWidth / 2);
    p[1] = Cut.Math.rotate(p[1], -spaceHeight / 2, spaceHeight / 2);
  }

  // Returns a random number between -0.5 and 0.5
  function rand(value) {
    return (Math.random() - 0.5) * (value || 1);
  }

  var ui = {};

  Cut(function(root, container) {
    Cut.Mouse(root, container);
    root.viewbox(spaceWidth, spaceHeight).pin("handle", -0.5);
    ui.p2 = new Cut.P2(world, {
      lineColor : "#fff",
      fillColor : ""
    }).appendTo(root);
    root.tick(tick);

    ui.status = Cut.string("font:_").pin({
      align : -0.5,
      handle : 0,
      offset : 0.1
    }).appendTo(root);

    ui.gameover = Cut.string("font:_").value("Game Over!").pin({
      handle : 0.5,
      scale : 1.6
    }).appendTo(root);

    start();
  });

  p2.Body.prototype.noDamping = function() {
    this.damping = this.angularDamping = 0;
    return this;
  };

  init();

  function uiStart() {
    gameover = false;
    ui.gameover.hide();
  }

  function uiEnd() {
    gameover = true;
    ui.gameover.show();
  }

  function uiStatus() {
    ui.status.value("Level: " + level + " Lives: " + lives)
  }

})();

var PPU = 64;

Cut({
  name : "font",
  factory : function(name) {
    var prefix = "_";
    if (name.substring(0, prefix.length) === prefix) {
      var d = name.substr(prefix.length, 1);
      return Cut.Out.drawing(prefix + d, 32 / PPU, 18 / PPU, 128, function(ctx,
          ratio) {
        ctx.scale(ratio / PPU, ratio / PPU);
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "#eee";
        ctx.measureText && this.cropX((ctx.measureText(d).width) / PPU);
        ctx.textBaseline = "top";
        ctx.fillText(d, 0, 1);
      });
    }
  }
});