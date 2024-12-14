
### Tree Model

Every application consists of a tree. The tree's root is created and returned by `Stage.mount()`.

```javascript
// Create a new component
const component = Stage.component();

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
parent.first((onlyVisible = false));
parent.last((onlyVisible = false));

// Get immediate parent
child.parent();

// Get child's next/prev (visible) sibling
child.next((onlyVisible = false));
child.prev((onlyVisible = false));

// Get visibility
component.visible();
// Set visibility
component.visible(visible);
component.hide();
component.show();

// Iterate over parent's children, child can not be removed
for (let child = parent.first(); child; child = child.next()) {
  // use child
}

// Iterate over parent's children, child can be removed
let child,
  next = parent.first();
while ((child = next)) {
  next = child.next();
  // use child
}

// Visit component's sub-tree including component itself
component.visit({
  start: function (component) {
    return skipChildren;
  },
  end: function (component) {
    return stopVisit;
  },
  reverse: false, // traverse children in reverse order
  visible: false, // only visible children
});
```