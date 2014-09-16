#### v0.2
* replaced `Cut.addTexture(...)` with `Cut(...)`
* using deep listeners count instead of `spy` to optimized mouse event distribution
* `drawing` signature changed from `([name], width, height, [ratio], callback, [def])` to `([name], width, height, [ratio], [callback])` and `(def, [callback])`
* `publish` method is replaced with `trigger` which return `this`
* viewport callback signature changed from `(width, height)` to `(viewbox)`
