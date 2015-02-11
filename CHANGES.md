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
* `viewport` callback signature changed from `(width, height)` to `(viewbox)`
