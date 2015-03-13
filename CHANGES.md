#### v0.4.8
* new drawing (experimental) and cutout (internal) api

#### v0.4.3
* pin set/get is refactored
* resize in/out is replace with scale in-pad/out-crop 
* default viewbox mode is 'in-pad'

#### v0.4.0
* `Cut.config` and `Cut.start(configs)` added
* `Cut.init` and `Loader.loadImage` replaced with `"app-loader"` and `"image-loader"` configs
* `Loader` merged with `Root`, `Loader.start/pause/resume` replaced with `Cut.start/pause/resume`
* `root._ratio` replaced with `root.viewport().ratio`
* `_isCut` replaced with `Cut._ensure`
* `Cut.Out.select` replace with `Cut.cutout`
* `Texture` is reorganized
* `Root`'s `resize` renamed to `viewport`
* Source files moved to `lib` and platform files to `platform`
* Assumed CommonJS by default
* `lib/main` is set as npm `main`
* extension files moved to ext
* In cutout selector, texture name is made optional: `"[texture:]cutout"`
* FastContext support added to Cordova, FastCanvas loader removed

#### v0.3.1
* Remove `Mouse(..., captureAnyMove)` and use flag instead
* Refactoring easing class and moving tween/ease to another file

#### v0.3.0
* Browserified
* Synthetic `Mouse` clicks instead of browser clicks
* New `off` method to remove listeners
* New `data` parameter for `visit` methods
* `_listens` renamed to `_flag`
* `_isFunc`, `_function`, `_options` and `_status` are removed and `_extend`'s signature is changed

#### v0.2.1
* `setImage/Value/Frames/Font` deprecated and replaced by `image/value/frames`

#### v0.2.0
* `Mouse` events signature changed from `(rawEvent, point)` to `(point)` where new `point.raw` is old `rawEvent`
* support pinning shorthands for tweening
* replaced `spy(true)` with `attr('spy', true)`
* replaced `Cut.addTexture(...)` with `Cut(...)`
* using deep listeners count instead of `spy` to optimized mouse event distribution
* `drawing` signature changed from `([name], width, height, [ratio], callback, [def])` to `([name], width, height, [ratio], [callback])` and `(def, [callback])`
* `publish` method is replaced with `trigger` which return `this`
* `viewport` callback signature changed from `(width, height)` to `(viewport)`
