### Row and Column

A row/column is a component that aligns its children in a horizontal/vertical direction.

```javascript
// Create a new row/column
const row = Stage.row((childrenAlignY = 0));
const column = Stage.column((childrenAlignX = 0));

// Layout a component's children row/column
component.row((childrenAlignY = 0));
component.column((childrenAlignX = 0));

// Add spacing between row/column cells
component.spacing(space);
```

### Minimize (experimental)

To minimize a component to fit its children call minimize(). It can be applied to tiled/stretched images, for example, to create variable-size components such as windows and buttons.

```javascript
// Create a minimized component
const component = Stage.minimize();

// Minimize component
component.minimize();
```

### Maximize (experimental)

Use maximize to resize an component to cover its parent.

```javascript
// Create and maximize a component
const component = Stage.maximize();

// Maximize an component
component.maximize();
```
