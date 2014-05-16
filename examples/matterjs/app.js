Cut(function(root, container) {
  Cut.Mouse(root, container, true);

  var Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Body = Matter.Body, Events = Matter.Events;

  root.MAX_ELAPSE = 100;

  var width = 600, height = 600, corner = 75;

  var options = {
    world : {
      gravity : {
        x : 0,
        y : 0
      },
      bounds : {
        min : {
          x : -Infinity,
          y : -Infinity
        },
        max : {
          x : Infinity,
          y : Infinity
        }
      }
    },
    render : {
      controller : {
        create : function(options) {
          return options;
        },
        clear : function() {
        },
        world : function(engine) {
        }
      }
    },
    positionIterations : 6,
    velocityIterations : 4,
    enableSleeping : true
  };

  var engine = Engine.create(options);
  var world = engine.world;

  var frame = {
    isStatic : true,
    restitution : 1
  };
  World.add(world, Bodies.rectangle(width / 2, 0, width, 50, frame));
  World.add(world, Bodies.rectangle(width / 2, height, width, 50, frame));
  World.add(world, Bodies.rectangle(0, height / 2, 50, height, frame));
  World.add(world, Bodies.rectangle(width, height / 2, 50, height, frame));
  World.add(world, Bodies.rectangle(0, 0, corner, corner, frame));
  World.add(world, Bodies.rectangle(0, height, corner, corner, frame));
  World.add(world, Bodies.rectangle(width, 0, corner, corner, frame));
  World.add(world, Bodies.rectangle(width, height, corner, corner, frame));

  var blockId = Body.nextGroupId();
  for (var i = 0; i <= 10; i++) {
    for (var j = 0; j <= 10; j++) {
      World.add(world, Bodies.rectangle(100 + i * 40, 100 + j * 40, 40, 40, {
        groupId : blockId,
        isStatic : true
      }));
    }
  }

  var ball = Bodies.circle(100, 100, 20, {
    frictionAir : 0,
    friction : 0,
    restitution : 1,
    inertia : Infinity,
    mass : 1
  });
  World.add(world, ball);

  var a = Math.random() * Math.PI * 2;
  Body.applyForce(ball, {
    x : 0,
    y : 0
  }, {
    x : 0.05 * Math.cos(a),
    y : 0.05 * Math.sin(a)
  });

  Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      var a = pair.bodyA, b = pair.bodyB;
      var block = (a.groupId == blockId) && a || (b.groupId == blockId) && b;
      block && World.remove(world, block);
    }
  });

  new Cut.Matter(engine).appendTo(root);

});
