Stage({
  name : "bg",
  image : { src : "bg.png", ratio : 2 }
});

Stage({
  name : "map-1",
  image : { src : "map-1.png", ratio : 2 }
});

Stage({
  image : { src : "main.png", ratio : 4 },
  ppu : 16,
  textures : {
    plane : { x : 0, y : 0, width : 1, height : 1 },
    explode : { x : 1, y : 0, width : 3, height : 3 }
  }
});