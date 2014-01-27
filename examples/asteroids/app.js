var SHIP = Math.pow(2, 1);
var BULLET = Math.pow(2, 2);
var ASTEROID = Math.pow(2, 3);

var spaceWidth = 16;
var spaceHeight = 9;

var shipSize = 0.3;
var shipReloadTime = 0.1;
var shipTurnSpeed = 4;

var bulletRadius = 0.03;
var bulletLifeTime = 2;

var asteroidRadius = 0.9;
var asteroidSpeed = 2;
var asteroidLevels = 4;

var initSpace = asteroidRadius * 2;

var allowShipCollision = true;
var hideShip = false;

var world;

var asteroidShapes = [];
var asteroidBodies = [];

var bulletShape;
var bulletBodies = [];

var shipShape;
var shipBody;

var level, lives, lastShootTime = 0, gameover;

Cut.Loader
    .load(function(root, container) {

      Cut.Mouse.subscribe(root, container, true);

      space = root.viewbox(spaceWidth, spaceHeight).pin("handle", -0.5);

      function addBullet(bulletBody) {
        bulletBody.ui = Cut.image("base:bullet").appendTo(space).pin("handle",
            0.5);
      }

      function removeBullet(bulletBody) {
        bulletBody.ui.remove();
      }

      function updateBullet(bulletBody) {
        warp(bulletBody);
        bulletBody.ui.pin({
          offsetX : bulletBody.position[0],
          offsetY : -bulletBody.position[1]
        });
      }

      function addAsteroid(asteroidBody) {
        asteroidBody.ui = Cut.image("base:asteroid_1").appendTo(space).pin(
            "handle", 0.5);
      }

      function removeAsteroid(asteroidBody) {
        asteroidBody.ui.remove();
      }

      function updateAsteroid(asteroidBody) {
        warp(asteroidBody);
        asteroidBody.ui.pin({
          offsetX : asteroidBody.position[0],
          offsetY : -asteroidBody.position[1],
          scale : bulletRadius * 70,
          rotation : asteroidBody.angle
        }).setImage("base:asteroid_" + asteroidBody.level);
      }

      function updateShip(shipBody) {
        warp(shipBody);
        shipBody.ui.pin({
          offsetX : shipBody.position[0],
          offsetY : -shipBody.position[1],
          rotation : -shipBody.angle,
          alpha : allowShipCollision ? 1 : 0.5
        }).visible(!hideShip);
      }

      // Init p2.js
      world = new p2.World({
        gravity : [ 0, 0 ],
      });

      // Add ship physics
      shipShape = new p2.Circle(shipSize);
      shipShape.collisionGroup = SHIP;
      shipShape.collisionMask = ASTEROID;

      // Create bullet shape
      bulletShape = new p2.Circle(bulletRadius);
      bulletShape.collisionGroup = BULLET;
      bulletShape.collisionMask = ASTEROID;

      // Init asteroid shapes
      for (var i = 0; i < asteroidLevels; i++) {
        var r = (asteroidLevels - i) / asteroidLevels;
        asteroidShapes[i] = new p2.Circle(r * asteroidRadius);
        asteroidShapes[i].collisionGroup = ASTEROID;
        asteroidShapes[i].collisionMask = BULLET | SHIP;
      }

      shipBody = new p2.Body({
        mass : 1,
        position : [ 0, 0 ],
        angularVelocity : 1
      });
      shipBody.addShape(shipShape);
      shipBody.ui = Cut.image("base:ship").appendTo(space).pin("handle", 0.5);

      newGame();

      function newGame() {
        level = 1;
        lives = 3;
        // Update the text boxes
        uiLevel();
        uiLives();
        start(true);
        addAsteroids();
        uiStart();
      }

      root.tick(function() {

        // Set velocities
        if (key.left)
          shipBody.angularVelocity = shipTurnSpeed;
        else if (key.right)
          shipBody.angularVelocity = -shipTurnSpeed;
        else
          shipBody.angularVelocity = 0;

        // Thrust: add some force in the ship direction
        if (key.up) {
          var magnitude = 2, angle = shipBody.angle + Math.PI / 2;
          shipBody.force[0] += magnitude * Math.cos(angle);
          shipBody.force[1] += magnitude * Math.sin(angle);
        }

        // Shoot
        if (key.shoot && !hideShip
            && world.time > lastShootTime + shipReloadTime) {

          // Create a bullet body
          var bulletBody = new p2.Body({
            mass : 0.05,
            position : shipBody.position
          });
          bulletBody.addShape(bulletShape);
          bulletBodies.push(bulletBody);
          addBullet(bulletBody);
          var magnitude = 2, angle = shipBody.angle + Math.PI / 2;

          // Give it initial velocity in the ship direction
          bulletBody.velocity[0] += magnitude * Math.cos(angle)
              + shipBody.velocity[0];
          bulletBody.velocity[1] += magnitude * Math.sin(angle)
              + shipBody.velocity[1];
          bulletBody.position[0] = shipShape.radius * Math.cos(angle)
              + shipBody.position[0];
          bulletBody.position[1] = shipShape.radius * Math.sin(angle)
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
            removeBullet(bulletBody);
            world.removeBody(bulletBody);
            i--;
            continue;
          }

          // If any body is out of bounds, move it to the other end
          updateBullet(bulletBody);
        }

        // Warp all asteroids
        for (var i = 0; i !== asteroidBodies.length; i++) {
          var asteroidBody = asteroidBodies[i];
          updateAsteroid(asteroidBody);
        }

        // Warp the ship
        updateShip(shipBody);

        // Move physics bodies forward in time
        world.step(1 / 60);
      });

      // Adds some asteroids to the scene.
      function addAsteroids() {
        while (asteroidBodies.length) {
          var asteroidBody = asteroidBodies.shift();
          world.removeBody(asteroidBody);
          removeAsteroid(asteroidBody);
        }

        for (var i = 0; i < level; i++) {
          var x = rand(spaceWidth);
          var y = rand(spaceHeight);
          var vx = rand(asteroidSpeed);
          var vy = rand(asteroidSpeed);
          var va = rand(asteroidSpeed);

          // Aviod the ship!
          if (Math.abs(x - shipBody.position[0]) < initSpace) {
            if (y - shipBody.position[1] > 0) {
              y += initSpace;
            } else {
              y -= initSpace;
            }
          }

          // Create asteroid body
          var asteroidBody = new p2.Body({
            mass : 10,
            position : [ x, y ],
            velocity : [ vx, vy ],
            angularVelocity : va,
          });
          asteroidBody.addShape(asteroidShapes[0]);
          asteroidBodies.push(asteroidBody);
          addAsteroid(asteroidBody);
          world.addBody(asteroidBody);
          asteroidBody.level = 1;
        }
      }

      // Catch impacts in the world
      // Todo: check if several bullets hit the same asteroid in the same time
      // step
      world.on("impact", function(evt) {
        var bodyA = evt.bodyA, bodyB = evt.bodyB;

        if ((bodyA.id == shipBody.id || bodyB.id == shipBody.id)) {
          // Ship collided with something
          if (!hideShip && allowShipCollision) {
            collide(bodyA, bodyB);
          }

        } else if (bodyA.shapes[0].collisionGroup == BULLET
            || bodyB.shapes[0].collisionGroup == BULLET) {
          // Bullet collided with something
          var bulletBody = bodyA.shapes[0].collisionGroup == BULLET ? bodyA
              : bodyB, otherBody = bodyB == bulletBody ? bodyA : bodyB;

          if (otherBody.shapes[0].collisionGroup == ASTEROID) {
            explode(otherBody, bulletBody);
          }
        }
      });

      function collide(bodyA, bodyB) {
        var ship = bodyA.shapes[0].collisionGroup == SHIP ? bodyA : bodyB;
        var asteroid = bodyB == ship ? bodyA : bodyB;

        if (asteroid.shapes[0].collisionGroup == ASTEROID) {
          lives--;
          uiLives();

          // Remove the ship body for a while
          world.removeBody(shipBody);
          hideShip = true;

          if (lives <= 0) {
            uiEnd();
            return;
          }
          setTimeout(function() {
            // Add ship again
            start();
          }, 1000);
        }
      }

      function start(position) {
        world.removeBody(shipBody);

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

      function explode(asteroidBody, bulletBody) {
        var aidx = asteroidBodies.indexOf(asteroidBody);
        var bidx = bulletBodies.indexOf(bulletBody);
        if (aidx != -1 && bidx != -1) {

          // Remove asteroid
          world.removeBody(asteroidBody);
          asteroidBodies.splice(aidx, 1);
          removeAsteroid(asteroidBody);

          // Remove bullet
          world.removeBody(bulletBody);
          bulletBodies.splice(bidx, 1);
          removeBullet(bulletBody);

          // Add new sub-asteroids
          var x = asteroidBody.position[0], y = asteroidBody.position[1];
          if (asteroidBody.level < 4) {
            var angleDisturb = Math.PI / 2 * Math.random();
            for (var i = 0; i < 4; i++) {
              var angle = Math.PI / 2 * i + angleDisturb;
              var r = asteroidBody.shapes[0].radius
                  - asteroidShapes[asteroidBody.level].radius;
              var sx = x + r * Math.cos(angle);
              var sy = y + r * Math.sin(angle);
              var vx = rand(asteroidSpeed);
              var vy = rand(asteroidSpeed);
              var va = rand(asteroidSpeed);
              var subAsteroidBody = new p2.Body({
                mass : 10,
                position : [ sx, sy ],
                velocity : [ vx, vy ],
                angularVelocity : va
              });
              subAsteroidBody.addShape(asteroidShapes[asteroidBody.level]);
              subAsteroidBody.level = asteroidBody.level + 1;
              subAsteroidBody.angle = rand() * Math.PI;
              world.addBody(subAsteroidBody);
              asteroidBodies.push(subAsteroidBody);
              addAsteroid(subAsteroidBody);
            }
          }
        }

        if (asteroidBodies.length == 0) {
          level++;
          uiLevel();
          addAsteroids();
        }
      }

      // If the body is out of space bounds, warp it to the other side
      function warp(body) {
        var p = body.position;
        p[0] = Cut.Math.rotate(p[0], -spaceWidth / 2, spaceWidth / 2);
        p[1] = Cut.Math.rotate(p[1], -spaceHeight / 2, spaceHeight / 2);
      }

      // Returns a random number between -0.5 and 0.5
      function rand(value) {
        return (Math.random() - 0.5) * (value || 1);
      }

      // Catch key down events
      window.onkeydown = function(evt) {
        gameover && newGame();
        key[keyName[evt.keyCode]] = true;
      };

      // Catch key up events
      window.onkeyup = function(evt) {
        key[keyName[evt.keyCode]] = false;
      };

      var key = {}, keyName = {
        32 : "shoot",
        37 : "left",
        38 : "up",
        39 : "right",
        40 : "down"
      };

      function uiLevel() {
        document.getElementById("level").innerHTML = "Level " + level;
      }

      function uiLives() {
        document.getElementById("lives").innerHTML = "Lives " + lives;
      }

      function uiEnd() {
        gameover = true;
        document.getElementById('gameover').classList.remove('hidden');
      }

      function uiStart() {
        gameover = false;
        document.getElementById('gameover').classList.add('hidden');
      }
    });