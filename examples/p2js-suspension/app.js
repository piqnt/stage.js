// Create the physics world
var world = new p2.World({
  doProfiling : true,
  gravity : [ 0, -10 ],
});

// Set high friction so the wheels don't slip
world.defaultFriction = 100;

// Create ground
var planeShape = new p2.Plane();
var plane = new p2.Body();
plane.addShape(planeShape);
world.addBody(plane);

// Create chassis
var chassisBody = new p2.Body({
  mass : 1,
  position : [ -4, 1 ]
}), chassisShape = new p2.Rectangle(1, 0.5);
chassisBody.addShape(chassisShape);
world.addBody(chassisBody);

// Create wheels
var wheelShape = new p2.Circle(0.3);

var wheelBody1 = new p2.Body({
  mass : 1,
  position : [ chassisBody.position[0] - 0.5, 0.7 ]
});
wheelBody1.addShape(wheelShape);
world.addBody(wheelBody1);

var wheelBody2 = new p2.Body({
  mass : 1,
  position : [ chassisBody.position[0] + 0.5, 0.7 ]
});
wheelBody2.addShape(wheelShape);
world.addBody(wheelBody2);

// Disable collisions between chassis and wheels
// Define bits for each shape type
var WHEELS = 1, CHASSIS = 2, GROUND = 4, OTHER = 8;

// Assign groups
wheelShape.collisionGroup = WHEELS;
chassisShape.collisionGroup = CHASSIS;
planeShape.collisionGroup = GROUND;

// Wheels can only collide with ground
wheelShape.collisionMask = GROUND | OTHER;

// Chassis can only collide with ground
chassisShape.collisionMask = GROUND | OTHER;

// Ground can collide with wheels and chassis
planeShape.collisionMask = WHEELS | CHASSIS | OTHER;

// Constrain wheels to chassis
var c1 = new p2.PrismaticConstraint(chassisBody, wheelBody1, {
  localAnchorA : [ -0.5, -0.3 ],
  localAnchorB : [ 0, 0 ],
  localAxisA : [ 0, 1 ],
  disableRotationalLock : true,
});
var c2 = new p2.PrismaticConstraint(chassisBody, wheelBody2, {
  localAnchorA : [ 0.5, -0.3 ],
  localAnchorB : [ 0, 0 ],
  localAxisA : [ 0, 1 ],
  disableRotationalLock : true,
});
c1.upperLimitEnabled = c2.upperLimitEnabled = true;
c1.upperLimit = c2.upperLimit = 0.2;
c1.lowerLimitEnabled = c2.lowerLimitEnabled = true;
c1.lowerLimit = c2.lowerLimit = -0.4;
world.addConstraint(c1);
world.addConstraint(c2);

// Add springs for the suspension
var stiffness = 100, damping = 5, restLength = 0.5;

// Left spring
world.addSpring(new p2.Spring(chassisBody, wheelBody1, {
  restLength : restLength,
  stiffness : stiffness,
  damping : damping,
  localAnchorA : [ -0.5, 0 ],
  localAnchorB : [ 0, 0 ],
}));

// Right spring
world.addSpring(new p2.Spring(chassisBody, wheelBody2, {
  restLength : restLength,
  stiffness : stiffness,
  damping : damping,
  localAnchorA : [ 0.5, 0 ],
  localAnchorB : [ 0, 0 ],
}));

// Apply current engine torque after each step
var torque = 0;
world.on("postStep", function(evt) {
  var max = 100;
  if (wheelBody1.angularVelocity * torque < max)
    wheelBody1.angularForce += torque;
  if (wheelBody2.angularVelocity * torque < max)
    wheelBody2.angularForce += torque;
});

world.on("addBody", function(evt) {
  evt.body.setDensity(1);
});

// Change the current engine torque with the left/right keys
window.onkeydown = function(evt) {
  t = 5;
  switch (evt.keyCode) {
  case 39: // right
    torque = -t;
    break;
  case 37: // left
    torque = t;
    break;
  }
};
window.onkeyup = function() {
  torque = 0;
};

Cut(function(root, container) {
  Cut.Mouse(root, container);
  root.viewbox(8, 6).pin("handle", -0.5);
  new Cut.P2(world).appendTo(root);
});
