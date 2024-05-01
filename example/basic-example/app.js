import Stage from "../../src";
import imageUrl from "./sample.png";

// Add texture atlas
await Stage.atlas({
  image: imageUrl,
  textures: {
    box: { x: 0, y: 0, width: 30, height: 30 },
  },
});

// Create new app
const stage = Stage.mount();

// Set view box
stage.viewbox(300, 200);

// Create an sprite and append it to stage
let box = Stage.sprite("box").appendTo(stage);

// Align box to center
box.pin("align", 0.5);

// On mouse click...
box.on("click", function (point) {
  // ...tween scale values of this component
  this.tween()
    .ease("bounce")
    .pin({
      scaleX: Math.random() + 0.5,
      scaleY: Math.random() + 0.5,
    });
});
