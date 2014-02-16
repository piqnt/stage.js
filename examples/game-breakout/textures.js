Cut.addTexture({
  name : "bg",
  imagePath : "bg_prerendered.png",
  imageRatio : 16 / p2s,
  ratio : 1 / (16 / p2s),
  cutouts : [
    { name : "prerendered",        x : 0, y : 0,   width : 320, height : 416 }
  ]
});

Cut.addTexture({
  name : "tiles",
  imagePath : "tiles.png",
  imageRatio : 16 / p2s,
  ratio : 1 / (16 / p2s),
  cutouts : [
    { name : "bb_0",      x : 0,   y : 0,   width : 32,  height : 16 },
    { name : "bb_1",      x : 32,  y : 0,   width : 32,  height : 16 },
    { name : "bb_2",      x : 64,  y : 0,   width : 32,  height : 16 },
    { name : "bb_3",      x : 96,  y : 0,   width : 32,  height : 16 },

    { name : "bo_0",      x : 0,   y : 16,  width : 32,  height : 16 },
    { name : "bo_1",      x : 32,  y : 16,  width : 32,  height : 16 },
    { name : "bo_2",      x : 64,  y : 16,  width : 32,  height : 16 },
    { name : "bo_3",      x : 96,  y : 16,  width : 32,  height : 16 },

    { name : "br_0",      x : 0,   y : 32,  width : 32,  height : 16 },
    { name : "br_1",      x : 32,  y : 32,  width : 32,  height : 16 },
    { name : "br_2",      x : 64,  y : 32,  width : 32,  height : 16 },
    { name : "br_3",      x : 96,  y : 32,  width : 32,  height : 16 },

    { name : "bg_0",      x : 0,   y : 48,  width : 32,  height : 16 },
    { name : "bg_1",      x : 32,  y : 48,  width : 32,  height : 16 },
    { name : "bg_2",      x : 64,  y : 48,  width : 32,  height : 16 },
    { name : "bg_3",      x : 96,  y : 48,  width : 32,  height : 16 },

    { name : "ball_0",    x : 48,  y : 64,  width : 16,  height : 16 },
    { name : "ball_1",    x : 64,  y : 64,  width : 16,  height : 16 },
    { name : "ball_2",    x : 80,  y : 64,  width : 16,  height : 16 },
    { name : "ball_3",    x : 96,  y : 64,  width : 16,  height : 16 },
    { name : "ball_4",    x : 112, y : 64,  width : 16,  height : 16 },

    { name : "full",      x : 0,   y : 64,  width : 48,  height : 16 },
    { name : "half",      x : 0,   y : 80,  width : 32,  height : 16 },

    { name : "+",         x : 96,  y : 96,  width : 16,  height : 16 },
    { name : "-",         x : 112, y : 96,  width : 16,  height : 16 },

    { name : "D_3",       x : 0,   y : 96,  width : 32,  height : 48 },
    { name : "D_2",       x : 0,   y : 96,  width : 32,  height : 48 },
    { name : "D_1",       x : 0,   y : 96,  width : 32,  height : 48 },
  ]
});
