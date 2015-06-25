### Tree Model
Every app consists of a tree, tree's root is provided as `stage`.

```javascript
// Create a new node instance (with no textures)
var foo = Stage.create();

// Append/prepend bar to foo's children (accepts array)
foo.append(bar);
foo.prepend(bar);

// Append/prepend bar to foo's children
bar.appendTo(foo);
bar.prependTo(foo);

// Insert baz after/before bar (accepts array)
bar.insertNext(baz);
bar.insertPrev(baz);

// Insert baz after/before bar
baz.insertAfter(bar);
baz.insertBefore(bar);

// Remove bar from parent
bar.remove();

// Remove bar from foo (accepts array)
foo.remove(bar);

// Remove all foo's children
foo.empty();

// Get foo's first/last (visible) child
foo.first(onlyVisible = false);
foo.last(onlyVisible = false);

// Get immediate parent
bar.parent();

// Get bar's next/prev (visible) sibling
bar.next(onlyVisible = false);
bar.prev(onlyVisible = false);

// Get bar's visiblity
bar.visible();
// Set bar's visiblity
bar.visible(visible);
bar.hide();
bar.show();

// Iterate over foo's children, `child` can not be removed
for (var child = foo.first(); child; child = child.next()) {
  // use child
}

// Iterate over foo's children, `child` can be removed
var child, next = foo.first();
while (child = next) {
  next = child.next();
  // use child
}

// Visit foo's sub-tree including foo
foo.visit({
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