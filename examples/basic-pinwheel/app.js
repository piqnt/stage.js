Cut(function(root, container) {
  Cut.Mouse.subscribe(root, container, true);
  root.viewbox(1000, 1000).pin("handle", -0.5);

  var clicked = false;
  var logo = Cut.image("pin:wheel").appendTo(root).pin("handle", 0.5).on(
      Cut.Mouse.CLICK, function() {
        clicked = true;
        then();
      });

  function then() {
    logo.pin("rotation", logo.pin("rotation") % (Math.PI * 2));
    if (clicked) {
      logo.tween(1000).clear().pin("rotation",
          logo.pin("rotation") - Math.PI * 2).then(then);
    } else {
      logo.tween(2000).clear().pin("rotation",
          logo.pin("rotation") - Math.PI * 2).ease(function(t) {
        return Math.sin(t * Math.PI / 2);
      });
    }
    clicked = false;
  }
});

Cut({
  name : "pin",
  imagePath : "pinwheel.png",
  cutouts : [ {
    name : "wheel",
    x : 0,
    y : 0,
    width : 200,
    height : 200
  } ]
});
