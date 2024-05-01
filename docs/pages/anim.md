
### Animation

An animation or anim is an component with an array of textures as frames.

```javascript
// Create a new anim instance
const anim = Stage.anim(textures, (fps = 15));

// Get or set animation frame-per-second
anim.fps();
anim.fps(fps);

// Set animation frames, `textures` can be an array or a texture selector
anim.frames(textures);

// Go to n-th frame
anim.gotoFrame(n);

// Move n frames forward (or backward if n is negative)
anim.moveFrame(n);

// Get number of frames
anim.length();

// Start playing (from `frameName` if specified)
anim.play((frameName = undefined));

// Stop playing (and jump to `frameName` if specified)
anim.stop((frameName = undefined));

// Play `repeat * length` frames and then stop and call `callback`
anim.repeat(repeat, (callback = null));
```