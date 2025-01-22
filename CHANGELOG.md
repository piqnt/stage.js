# Changelog

## 1.0.0-alpha.17

### Patch Changes

- dcbcf12: Rename Node to Component
- b2dc48b: Fix aliasing legacy class names

## 1.0.0-alpha.16

### Patch Changes

- 7cf63f6: Patch types

## 1.0.0-alpha.14

### Patch Changes

- Use @changesets/cli

## v1.0 alpha

- rewrite with typescript
- change package type to module
- all classes are exported under Stage namespace
- Stage is not callable, and is not a class anymore
- removed Stage.app(callback)
- added Stage.mount() to create a new app
- added await Stage.atlas({ }) to preload images
- added Component class as the base class
- removed Stage.internal namespace
- removed cordova/fastcontext loader and build
- removed script loader `preload(url)`
- removed relative path resolver for texture images
- removed Stage.config()
- removed \_create, \_extend
- renamed Image/image to Sprite/sprite, and sprite.image() to sprite.texture()
- renamed Str/string to Monotype/monotype
- renamed create()/layer()/box() to component()/maximize()/minimize()
- renamed component.sequence() to component.align()
- replaced Stage.Math with Stage.math with different function names
- removed Matrix.reverse (use inverse)
- renamed Mouse to Pointer and made it internal
- added CanvasTexture
- changed canvas() signature
- dropped texture.draw(x, y) sub-signature
- removed cutouts, sprites, factory fields from atlas definition
- replaced Ease() with Ease.get()
- scaleTo renamed to fit

#### v0.8.2

- `render.js` renamed to `loop.js`
- `node.js` renamed to `tree.js`
- cordova starts by mousemove

#### v0.8.1

- `node.scaleTo()` shortcut pinning method added
- `node.matrix(true)` returns relative matrix instead of absolute

#### v0.8.0

- **default `.tween()` behavior changed from append to replace**
- `.tween(duration, delay)` changed to `.tween(duration, delay, append = false)`
- `tween.clear()` deprecated and no-op
- `tween.end()` replaced by `tween.done()`

#### v0.7.1

- `tween.then()` replaced by `tween.end()`
- `tween.remove/hide()` are added

#### v0.7.0

- **images and script urls starting with `./` are resolved as relative**

#### v0.6.7

- Stage.Math extends native Math

#### v0.6.6

- lookup atlas by name before textures
- `node.width/height()` pinning shortcuts return value
- preloadScript('url') removed

#### v0.6.5

- **.preload('url.js') added**

#### v0.6.4

- pinning shortcuts are added to nodes
- entire atlas can be referenced

#### v0.6.2

- `atlas.image.url` renamed to `src`
- pining shorthand methods added to node
- tick-based `timeout(fn, delay)` method added to node
- entire atlas can be used as texture

#### v0.6.0

- **Cut/CutJS renamed to Stage/Stage.js**

#### v0.5.0

- atlas spec changed
- **.preload(fn) added**
- node.insert/append/prepend() methods accept array
- node.id() renamed to node.label()
- Cut.addTexture() removed
- image.cropY/cropY() removed
- anim.gotoLabel() removed
- Cut.Anim.FPS is not public anymore
- drawing() replaced with .canvas()
- **Texture renamed to Atlas, new Texture class replaced Cut.Out**
- node.\_cutouts and Cut.cutout() replaced with node.\_textures and Cut.texture()
- Cut.texture() returns selection object
- image-loader spec changed

#### v0.4.12

- root.background method added

#### v0.4.10

- **game loop continues if any tick returns true, but only renders if touched**

#### v0.4.9

- texture.ratio renamed to texture.ppu

#### v0.4.8

- new drawing (experimental) and cutout (internal) api

#### v0.4.3

- pin set/get is refactored
- resize in/out replace with scale in-pad/out-crop
- default viewbox mode is 'in-pad'

#### v0.4.0

- **CommonJS/Node.js files and project structure**
- Source files moved to `lib` and platform files to `platform`
- extension files moved to ext
- `lib/main` set as npm `main`
- texture name made optional in cutout selector: `"[texture:]cutout"`
- FastContext support added to Cordova, FastCanvas loader removed

- `Cut.Out.select` replaced with `Cut.cutout`
- `Cut.config` and `Cut.start(configs)` are added
- `Cut.init` and `Loader.loadImage` replaced with `"app-loader"` and `"image-loader"` configs
- `Loader` merged with `Root`
- `Loader.start/pause/resume` replaced with `Cut.start/pause/resume`
- `root._ratio` replaced with `root.viewport().ratio`
- `_isCut` replaced with `Cut._ensure`
- `Texture` reorganized
- `root.resize()` renamed to `viewport()`

#### v0.3.1

- Remove `Mouse(..., captureAnyMove)` and use flag instead
- Refactoring easing class and moving tween/ease to another file

#### v0.3.0

- **Browserified**
- Synthetic `Mouse` clicks instead of browser clicks
- New `off` method to remove listeners
- New `data` parameter for `visit` methods
- `_listens` renamed to `_flag`
- `_isFunc`, `_function`, `_options` and `_status` are removed
- `_extend` signature changed

#### v0.2.1

- `setImage/Value/Frames/Font` deprecated and replaced by `image/value/frames`

#### v0.2.0

- mouse event listener signature changed from `(rawEvent, {x, y})` to `({x, y, raw})`
- `viewport` listener signature changed from `(width, height)` to `({width, height})`
- `Cut.addTexture(...)` is replaced with `Cut(...)`
- `spy(true)` is replaced with `attr('spy', true)`
- tweening support for pinning XY-shorthands added
- `drawing` signature changed from `([name], width, height, [ratio], callback, [def])` to `([name], width, height, [ratio], [callback])` and `(def, [callback])`
- node.trigger() method added, calls .publish() and returns `this`
- using deep listeners count instead of `spy` to optimized mouse event distribution
