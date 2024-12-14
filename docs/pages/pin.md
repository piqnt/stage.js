### Pinning

Pinning specifies how an component is attached to its parent.
Pinning consists of size, transformation, positioning and transparency.

```javascript
// Get a pinning value
component.pin(name);

// Set a pinning value
component.pin(name, value);

// Set one or more pinning values
component.pin({
  name : value,
  ...
});
```

When `nameX` equals `nameY`, `name` shorthand can be used instead.

#### Size

For some components, such as images, strings, rows and columns, size is set automatically.

```javascript
component.pin({
  height: height,
  width: width,
});

// Shortcut for setting size:
component.size(width, height);
component.width(width);
component.height(height);

// Shortcut for getting size:
component.width();
component.height();
```

#### Transformation

The transformation consists of scaling, skewing and rotating. Rotation is applied after scaling and skewing.

```javascript
component.pin({
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  rotation: 0,
});

// Shortcut for setting transformation:
component.scale(x, (y = x));
component.scale({ x: x, y: y });
component.skew(x, (y = x));
component.skew({ x: x, y: y });
component.rotate(angle);
```

#### Positioning

When positioning, _handle_ point on self is positioned at _offset_ distance from _align_ point on the parent.
Handle and align are defined as a ratio of width/height, 0 is top/left and 1 is bottom/right.
Handle defaults to the align value when it is not specified.

```javascript
component.pin({
  alignX: 0,
  alignY: 0,
  handleX: 0,
  handleY: 0,
  offsetX: 0,
  offsetY: 0,
});

// Shortcut methods for setting positioning:
component.offset(x, y);
component.offset({ x: x, y: y });
```

By default an axis-aligned bounding box (AABB) after transformation is used for positioning,
however it is possible to use a non-transformed box by setting a pivot location.
Pivot location is defined as ratio of non-transformed width/height and is used as central point on self for scale, skew and rotation.

```javascript
component.pin({
  pivotX: 0,
  pivotY: 0,
});
```

#### Transparency

Transparency can be applied to both component textures and subtree components or only component textures.

```javascript
component.pin({
  alpha: 1,
  textureAlpha: 1,
});

// Shortcut methods for setting transparency:
component.alpha(alpha);
component.alpha(alpha, textureAlpha);
```

#### Fit

Fit to given size. Valid modes are:

- `contain`: like `in`, but evenly pads component to fill the entire scaleWidth/Height
- `cover`: like `out`, but evenly crops it to scaleWidth/Height
- `in`: maximum scale which keeps component edges inside the scaleWidth/Height
- `out`: minimum scale which keeps component edges outside scaleWidth/Height

```javascript
component.pin({
  scaleMode: mode,
  scaleWidth: width,
  scaleHeight: height,
});

// Shortcut method:
component.fit(width, height, mode);
```
