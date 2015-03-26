Cut({
  imagePath : "bg.png",
  imageRatio : 2 * ppu,
  ppu : 1 / ppu,
  cutouts : [
    { name : "board", x : 0, y : 0,  width : 320, height : 416 }
  ]
});

Cut({
  imagePath : "base.png",
  imageRatio : 2 * ppu,
  ppu : 1 / ppu,
  filter : function(cut) {
    cut.y = 256 - (cut.y + cut.height);
    return cut;
  },
  cutouts : [
    { name : "br",        x : 32*0,  y : 0,   width : 32,  height : 32 },
    { name : "bg",        x : 32*1,  y : 0,   width : 32,  height : 32 },
    { name : "bb",        x : 32*2,  y : 0,   width : 32,  height : 32 },
    { name : "by",        x : 32*3,  y : 0,   width : 32,  height : 32 },
    { name : "bp",        x : 32*4,  y : 0,   width : 32,  height : 32 },
    
    { name : "brs",       x : 160,   y : 0,    width : 16,  height : 16 },
    { name : "bgs",       x : 176,   y : 0,    width : 16,  height : 16 },
    { name : "bbs",       x : 192,   y : 0,    width : 16,  height : 16 },
    { name : "bys",       x : 208,   y : 0,    width : 16,  height : 16 },
    { name : "bps",       x : 224,   y : 0,    width : 16,  height : 16 },
    
    { name : "paddleFull",x : 0,     y : 32,  width : 48,  height : 16 },
    { name : "paddleMini",x : 48,    y : 32,  width : 32,  height : 16 },
    { name : "ball",      x : 80,    y : 32,  width : 16,  height : 16 },
    { name : "+",         x : 96,    y : 32,  width : 16,  height : 16 },
    { name : "-",         x : 112,   y : 32,  width : 16,  height : 16 },
    
    { name : "restart",   x : 192,   y : 48,  width : 64,  height : 64 },

    { name : "d_0",       x : 16*0,  y : 48,  width : 16,  height : 16 },
    { name : "d_1",       x : 16*1,  y : 48,  width : 16,  height : 16 },
    { name : "d_2",       x : 16*2,  y : 48,  width : 16,  height : 16 },
    { name : "d_3",       x : 16*3,  y : 48,  width : 16,  height : 16 },
    { name : "d_4",       x : 16*4,  y : 48,  width : 16,  height : 16 },
    { name : "d_5",       x : 16*5,  y : 48,  width : 16,  height : 16 },
    { name : "d_6",       x : 16*6,  y : 48,  width : 16,  height : 16 },
    { name : "d_7",       x : 16*7,  y : 48,  width : 16,  height : 16 },
    { name : "d_8",       x : 16*8,  y : 48,  width : 16,  height : 16 },
    { name : "d_9",       x : 16*9,  y : 48,  width : 16,  height : 16 },
    { name : "d_ ",       x : 16*10, y : 48,  width : 16,  height : 16 }
  ]
});