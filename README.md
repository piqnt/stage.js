[![Stage](https://s3.amazonaws.com/piqnt.com/stage.js/stage.png)](http://piqnt.com/stage.js/)

Stage.js is a 2D rendering and layout library for HTML5 Canvas. It is lightweight, fast and optimized for web and mobile game development.

Stage.js provides an API similar to DOM to create and animate optimized graphics on HTM5 2D Canvas.

### Features

- Optimized rendering loop
- Texture atlas, sprites, and image preloading
- Pointer events processing, and routing events to target elements
- Positioning and layout

[**Live Examples and Demos**](http://piqnt.com/stage.js/)

### Example

```js
// Define and preload a texture
await Stage.atlas({
  image: "sample.png",
  textures: {
    box: { x: 0, y: 0, width: 30, height: 30 },
  },
});

// Create and mount a new app
const app = Stage.mount();

// Set view box
app.viewbox(300, 200);

// Create an sprite and append it to app
const box = Stage.sprite("box").appendTo(app);

// Align box to center
box.pin("align", 0.5);

// On click...
box.on("click", function (point) {
  // ...tween scale values of this node
  this.tween()
    .ease("bounce")
    .pin({
      scaleX: Math.random() + 0.5,
      scaleY: Math.random() + 0.5,
    });
});
```

## Install

#### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/stage-js@1.0"></script>
<script>
  const app = Stage.mount();
</script>
```

#### NPM

```
npm install --save stage-js
```

```js
const Stage = require("stage-js");
```

```js
import Stage from "stage-js";
```

## v1.0 [Work in Progress] Migration

There are some backward incompatible changes in v1.0, most notably:

- The code is rewritten in TypeScript, and the package type is changed to "module"
- `Stage` now is a namespace, it is not a class or callable function anymore
- The API for starting an application and preloading textures is changed

Please see the [upgrade](./docs/Migration.md) doc for more information.

## Development

To try examples with a live build run the following command and check the output for the URL to open in your browser:

```
npm run dev
```

## License

Copyright 2024 Ali Shakiba
Available under the MIT License
