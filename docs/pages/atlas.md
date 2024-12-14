### Texture Atlas

A texture atlas (sprite sheet) consists of a set of named textures that are referenced by name in an application.

Atlases are usually created using static image files. Images referenced in atlases are automatically preloaded.

```javascript
// Adding texture atlas
Stage.atlas({
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

Stage.sprite('mario:stand');

Stage.anim('mario:walk').play();

Stage.monotype('mario:number').value(100);
```
