### Pinning
Pinning specifies how a node is attached to its parent.
Pinning consists of size, transformation, positioning and transparency.

```javascript
// Get a pinning value
node.pin(name);

// Set a pinning value
node.pin(name, value);

// Set one or more pinning values
node.pin({
  name : value,
  ...
});
```

When `nameX` equals `nameY`, `name` shorthand can be used instead.

#### Size
For some nodes, such as images, strings, rows and columns, size is set automatically.

```javascript
node.pin({
  height : height,
  width : width
});

// Shortcut for setting size:
node.size(width, height);
node.width(width);
node.height(height);

// Shortcut for getting size:
node.width();
node.height();
```

#### Transformation
Transformation consists of scaling, skewing and rotating. Rotation is applied after scaling and skewing.

```javascript
node.pin({
  scaleX : 1,
  scaleY : 1,
  skewX : 0,
  skewY : 0,
  rotation : 0
});

// Shortcut for setting transformation:
node.scale(x, y = x);
node.scale({ x : x, y : y });
node.skew(x, y = x);
node.skew({ x : x, y : y });
node.rotate(angle);
```

#### Positioning
When positioning, *handle* point on self is positioned at *offset* distance from *align* point on parent.
Handle and align are defined as ratio of width/height, 0 is top/left and 1 is bottom/right.
Handle defaults to align value when it is not specified.

```javascript
node.pin({
  alignX : 0,
  alignY : 0,
  handleX : 0,
  handleY : 0,
  offsetX : 0,
  offsetY : 0
});

// Shortcut methods for setting positioning:
node.offset(x, y);
node.offset({ x : x, y : y });
```

By default axis-aligned bounding box (AABB) after transformation is used for positioning, 
however it is possible to use non-transformed box by setting pivot location. 
Pivot location is defined as ratio of non-transformed width/height and is used as central point on self for scale, skew and rotation.

```javascript
node.pin({
  pivotX : 0,
  pivotY : 0
});
```

#### Transparency
Transparency can be applied to both node textures and subtree nodes or only node textures.

```javascript
node.pin({
  alpha : 1,
  textureAlpha : 1
});

// Shortcut methods for setting transparency:
node.alpha(alpha);
node.alpha(alpha, textureAlpha);
```

#### Scale To
Scale to new width/height, if mode is set scale proportionally. Valid modes are:
 - `in`: maximum scale which keeps node edges inside scaleWidth/Height
 - `in-pad`: like `in`, but evenly pads node to fill entire scaleWidth/Height
 - `out`: minimum scale which keeps node edges outside scaleWidth/Height
 - `out-crop`: like `out`, but evenly crops it to scaleWidth/Height

```javascript
node.pin({
  scaleMode : mode,
  scaleWidth : width,
  scaleHeight : height
});

// Shortcut method:
node.scaleTo(width, height, mode);
```
