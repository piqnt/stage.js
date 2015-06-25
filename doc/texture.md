### Texture
Textures are drawable objects which are used by tree nodes to draw graphics on the Canvas surface.

### Texture Atlas
A texture atlas (sprite sheet) consists of a set of named textures which are referenced by name in an application.

Atlases are usually created using static image files. Images referenced in atlases are automatically preloaded.

```javascript
// Adding texture atlas
Stage({
  name : 'mario', // optional
  image : {
    src : 'mario.png',
    ratio : 1, // optional, for high-res images
  }
  textures : {
    stand : { x : 0,   y : 0, width : 40, height : 60 },
    walk : [
      { x : 40,  y : 0, width : 40, height : 60 },
      { x : 80,  y : 0, width : 40, height : 60 },
      { x : 120, y : 0, width : 40, height : 60 }
    ],
    number : {
      '0' : { x : 0,  y : 60, width : 10, height : 14 },
      '1' : { x : 10, y : 60, width : 10, height : 14 },
      '2' : { x : 20, y : 60, width : 10, height : 14 },
      '3' : { x : 30, y : 60, width : 10, height : 14 },
      '4' : { x : 40, y : 60, width : 10, height : 14 },
      '5' : { x : 50, y : 60, width : 10, height : 14 },
      '6' : { x : 60, y : 60, width : 10, height : 14 },
      '7' : { x : 70, y : 60, width : 10, height : 14 },
      '8' : { x : 80, y : 60, width : 10, height : 14 },
      '9' : { x : 90, y : 60, width : 10, height : 14 }
    }
  }
});

Stage.image('mario:stand');

Stage.anim('mario:walk').play();

Stage.string('mario:number').value(100);
```

If image src starts with `./` it will be resolved relative to current script URL.
