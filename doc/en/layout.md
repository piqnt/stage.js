### Row and Column
A row/column is a node which organizes its children as a horizontal/vertical sequence.

```javascript
// Create a new row/column
var row = Stage.row(childrenAlignY = 0);
var column = Stage.column(childrenAlignX = 0);

// Make node a row/column
node.row(childrenAlignY = 0);
node.column(childrenAlignX = 0);

// Add spacing between row/column cells
node.spacing(space);
```

### Box (experimental)
A box resizes to wrap its children. It can be applied to tiled/stretched
images to create variable size components such as windows and buttons.

```javascript
// Create a new box
var box = Stage.box();

// Make node a box
node = node.box();
```
