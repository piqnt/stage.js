Stage({
  name : "bg",
  image : {
    url : "bg.png",
    ratio : 2
  }
});

Stage({
  image : {
    url : "main.png",
    ratio : 4
  },
  ppu : 16,
  textures : {
    plane : { x : 0, y : 0, width : 1, height : 1 },
    explode : { x : 1, y : 0, width : 3, height : 3 }
  }
});