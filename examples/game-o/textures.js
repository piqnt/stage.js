Cut({
  name : "base",
  imagePath : "media/base.png",
  imageRatio : 8,
  ratio : 16,
  filter : function(cut) {
    cut.y = 8 - (cut.y + cut.height);
    return cut;
  },
  cutouts : [
    { name : "coin_1_",    x : 0,    y : 5,    width : 1,    height : 1 },
    { name : "coin_2_",    x : 1,    y : 5,    width : 1,    height : 1 },
    { name : "coin_5_",    x : 2,    y : 5,    width : 1,    height : 1 },
    { name : "coin_10_",   x : 3,    y : 5,    width : 1,    height : 1 },
    { name : "coin_20_",   x : 4,    y : 5,    width : 1,    height : 1 },
    { name : "coin_50_",   x : 5,    y : 5,    width : 1,    height : 1 },
    { name : "coin_100_",  x : 6,    y : 5,    width : 1,    height : 1 },
    { name : "coin_1000_", x : 7,    y : 5,    width : 1,    height : 1 },
    { name : "coin_10000_",x : 8,    y : 5,    width : 1,    height : 1 },

    { name : "player_",    x : 0,    y : 1,    width : 1,    height : 1 },
    { name : "player_",    x : 1,    y : 1,    width : 1,    height : 1 },
    { name : "player_",    x : 2,    y : 1,    width : 1,    height : 1 },
    { name : "player_",    x : 3,    y : 1,    width : 1,    height : 1 },
    { name : "player_",    x : 4,    y : 1,    width : 1,    height : 1 },
    { name : "player_",    x : 3,    y : 1,    width : 1,    height : 1 },
    { name : "player_",    x : 2,    y : 1,    width : 1,    height : 1 },
    { name : "player_",    x : 1,    y : 1,    width : 1,    height : 1 },

    { name : "cursor",     x : 1,    y : 0,    width : 1,    height : 1 },

    { name : "tombstone",  x :12+3/8,y :4+3/8, width : 4-3/8,height : 4-3/8 },
    
    { name : "energy",     x : 2,    y : 0.4,  width : 2,    height : 0.3, left: 0.125, right: 0.125 },
    { name : "dot",        x : 4,    y : 0,    width : 1,    height : 1 },
    { name : "power",      x : 5,    y : 0,    width : 1,    height : 1 },
    
    { name : "up_power",   x : 6,    y : 4,    width : 1,    height : 1 },
    { name : "up_energy",  x : 7,    y : 4,    width : 1,    height : 1 },
    { name : "up_speed",   x : 8,    y : 4,    width : 1,    height : 1 },
    { name : "up_pull",    x : 9,    y : 4,    width : 1,    height : 1 },
    { name : "up_push",    x : 10,   y : 4,    width : 1,    height : 1 },
    { name : "up_slow",    x : 11,   y : 4,    width : 1,    height : 1 },

    { name : "up_0",       x : 9.50, y : 1.35, width : 1,    height : 0.3 },
    { name : "up_1",       x : 9.25, y : 1.35, width : 1,    height : 0.3 },
    { name : "up_2",       x : 9.00, y : 1.35, width : 1,    height : 0.3 },
    { name : "up_3",       x : 8.75, y : 1.35, width : 1,    height : 0.3 },
    { name : "up_4",       x : 8.50, y : 1.35, width : 1.25, height : 0.3 },
    { name : "up_5",       x : 8.25, y : 1.35, width : 1.50, height : 0.3 },
    { name : "up_6",       x : 8.00, y : 1.35, width : 1.50, height : 0.3 },

    { name : "die_",       x : 2,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 6,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 5,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 2,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 6,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 5,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 2,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 6,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 5,    y : 1,    width : 1,    height : 1 },
    { name : "die_",       x : 5,    y : 1,    width : 1,    height : 1 },
                           
    { name : "unbox",      x : 5,    y: 2,     width : 1,    height : 1 },
                           
    { name : "box_",       x : 1,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 0,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 0,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 1,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 2,    y: 2,     width : 1,    height : 1 },
                           
    { name : "boxz_",      x : 6,    y: 2,     width : 1,    height : 1 },
    { name : "boxz_",      x : 7,    y: 2,     width : 1,    height : 1 },
    { name : "boxz_",      x : 8,    y: 2,     width : 1,    height : 1 },
                           
    { name : "box_",       x : 3,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 4,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 4,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 3,    y: 2,     width : 1,    height : 1 },
    { name : "box_",       x : 2,    y: 2,     width : 1,    height : 1 },
                           
    { name : "boxz_",      x : 9,    y: 2,     width : 1,    height : 1 },
    { name : "boxz_",      x : 10,   y: 2,     width : 1,    height : 1 },
    { name : "boxz_",      x : 11,   y: 2,     width : 1,    height : 1 },
                           
    { name : "untri",      x : 5,    y : 3,    width : 1,    height : 1 },
                           
    { name : "tri_",       x : 1,    y : 3,    width : 1,    height : 1 },
    { name : "tri_",       x : 0,    y : 3,    width : 1,    height : 1 },
    { name : "tri_",       x : 1,    y : 3,    width : 1,    height : 1 },
    { name : "tri_",       x : 2,    y : 3,    width : 1,    height : 1 },
                           
    { name : "triz_",      x : 6,    y : 3,    width : 1,    height : 1 },
    { name : "triz_",      x : 7,    y : 3,    width : 1,    height : 1 },
    { name : "triz_",      x : 8,    y : 3,    width : 1,    height : 1 },
                           
    { name : "tri_",       x : 3,    y : 3,    width : 1,    height : 1 },
    { name : "tri_",       x : 4,    y : 3,    width : 1,    height : 1 },
    { name : "tri_",       x : 3,    y : 3,    width : 1,    height : 1 },
    { name : "tri_",       x : 2,    y : 3,    width : 1,    height : 1 },
                           
    { name : "triz_",      x : 9,    y : 3,    width : 1,    height : 1 },
    { name : "triz_",      x : 10,   y : 3,    width : 1,    height : 1 },
    { name : "triz_",      x : 11,   y : 3,    width : 1,    height : 1 },
                           
    { name : "d_0",        x : 6+0* 0.5, y : 0.3,   width : (1+3.7)/16, height : 0.4 },
    { name : "d_1",        x : 6+1* 0.5, y : 0.3,   width : (1+2.1)/16, height : 0.4 },
    { name : "d_2",        x : 6+2* 0.5, y : 0.3,   width : (1+3.5)/16, height : 0.4 },
    { name : "d_3",        x : 6+3* 0.5, y : 0.3,   width : (1+3.3)/16, height : 0.4 },
    { name : "d_4",        x : 6+4* 0.5, y : 0.3,   width : (1+4.0)/16, height : 0.4 },
    { name : "d_5",        x : 6+5* 0.5, y : 0.3,   width : (1+3.4)/16, height : 0.4 },
    { name : "d_6",        x : 6+6* 0.5, y : 0.3,   width : (1+3.7)/16, height : 0.4 },
    { name : "d_7",        x : 6+7* 0.5, y : 0.3,   width : (1+3.5)/16, height : 0.4 },
    { name : "d_8",        x : 6+8* 0.5, y : 0.3,   width : (1+3.8)/16, height : 0.4 },
    { name : "d_9",        x : 6+9* 0.5, y : 0.3,   width : (1+3.8)/16, height : 0.4 },
    { name : "d_-",        x : 6+10*0.5, y : 0.3,   width : (1+2.0)/16, height : 0.4 },
    { name : "d_.",        x : 6+11*0.5, y : 0.3,   width : (1+1.0)/16, height : 0.4 },
    { name : "d_k",        x : 6+12*0.5, y : 0.3,   width : (1+3.0)/16, height : 0.4 },
    { name : "d_M",        x : 6+13*0.5, y : 0.3,   width : (1+6.0)/16, height : 0.4 },
    { name : "d_$",        x : 6+14*0.5, y : 0.3,   width : (1+5.0)/16, height : 0.4 },
    { name : "d_ ",        x : 6+15*0.5, y : 0.3,   width : (1+4.0)/16, height : 0.4 },
                           
    { name : "playbg",     x : 0.1,      y : 7.1,   width : 0.8,        height : 0.8 },
    { name : "homebg",     x : 1.1,      y : 7.1,   width : 0.8,        height : 0.8 },
                           
    { name : "c_10",       x : 2.1,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_20",       x : 2.1,      y : 7.6,   width : 0.3,        height : 0.3 },
                           
    { name : "c_11",       x : 2.6,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_12",       x : 3.1,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_13",       x : 3.6,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_14",       x : 4.1,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_15",       x : 4.6,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_16",       x : 5.1,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_17",       x : 5.6,      y : 7.1,   width : 0.3,        height : 0.3 },
    { name : "c_18",       x : 6.1,      y : 7.1,   width : 0.3,        height : 0.3 },
                           
    { name : "c_21",       x : 2.6,      y : 7.6,   width : 0.3,        height : 0.3 },
    { name : "c_22",       x : 3.1,      y : 7.6,   width : 0.3,        height : 0.3 },
    { name : "c_23",       x : 3.6,      y : 7.6,   width : 0.3,        height : 0.3 },
    { name : "c_24",       x : 4.1,      y : 7.6,   width : 0.3,        height : 0.3 },
    { name : "c_25",       x : 4.6,      y : 7.6,   width : 0.3,        height : 0.3 },
    { name : "c_26",       x : 5.1,      y : 7.6,   width : 0.3,        height : 0.3 },
    { name : "c_27",       x : 5.6,      y : 7.6,   width : 0.3,        height : 0.3 },
    { name : "c_28",       x : 6.1,      y : 7.6,   width : 0.3,        height : 0.3 },
                           
    { name : "shadow",     x : 6.6,      y : 7.9,   width : 0.3,        height : 0.1 },
                           
    { name : "option",     x : 9.5,      y : 6.25,  width : 1.5,        height : 1.5 },
    { name : "play",       x : 7.5,      y : 6.25,  width : 1.5,        height : 1.5 },
                           
    { name : "border",     x : 14,       y : 0,     width : 1,          height : 1 , top: 1/8, bottom: 1/8, left: 1/8, right: 1/8}
  ]
});