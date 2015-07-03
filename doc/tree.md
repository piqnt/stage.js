### Tree Model
Every app consists of a tree, tree's root is provided as `stage`.

```javascript
// Create a new node instance (with no textures)
var node = Stage.create();

// Append/prepend child to parent's children (accepts array)
parent.append(child);
parent.prepend(child);

// Append/prepend child to parent's children
child.appendTo(parent);
child.prependTo(parent);

// Insert sibling after/before child (accepts array)
child.insertNext(sibling);
child.insertPrev(sibling);

// Insert sibling after/before child
sibling.insertAfter(child);
sibling.insertBefore(child);

// Remove child from its parent
child.remove();

// Remove child from parent (accepts array)
parent.remove(child);

// Remove all of parent's children
parent.empty();

// Get parent's first/last (visible) child
parent.first(onlyVisible = false);
parent.last(onlyVisible = false);

// Get immediate parent
child.parent();

// Get child's next/prev (visible) sibling
child.next(onlyVisible = false);
child.prev(onlyVisible = false);

// Get node's visiblity
node.visible();
// Set node's visiblity
node.visible(visible);
node.hide();
node.show();

// Iterate over parent's children, child can not be removed
for (var child = parent.first(); child; child = child.next()) {
  // use child
}

// Iterate over parent's children, child can be removed
var child, next = parent.first();
while (child = next) {
  next = child.next();
  // use child
}

// Visit node's sub-tree including node itself
node.visit({
  start : function(node) {
    return skipChildren;
  },
  end : function(node) {
    return stopVisit;
  },
  reverse : reverseChildrenOrder = false,
  visible : onlyVisibleNodes = false
});
```
