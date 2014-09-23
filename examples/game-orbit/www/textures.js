
MEDIAURL = (typeof MEDIAURL !== 'undefined') ? MEDIAURL : 'media';

Cut({
  name : "bg",
  imagePath : MEDIAURL + "/bg.png",
  imageRatio : 8,
  cutouts : [
    { name : "black",    x : 0,    y : 0,   width : 128,    height : 128 }
  ]
});

Cut({
  name : "base",
  imagePath : MEDIAURL + "/base.png",
  imageRatio : 8,
  cutouts : [
    { name : "planet",    x : 0,     y : 0,    width : 12,   height : 12 },
    { name : "play",      x : 0,     y : 16,   width : 12,   height : 12 },
    { name : "explosion", x : 12,    y : 0,    width : 12,   height : 12 },
    { name : "ship",      x : 0,     y : 12,   width : 4,    height : 4 },
    { name : "next",      x : 4,     y : 12,   width : 4,    height : 4 },
    { name : "asteroid",  x : 8,     y : 12,   width : 4,    height : 4 },
    { name : "bullet",    x : 12,    y : 12,   width : 4,    height : 4 }
  ]
});

Cut({
  name : "digit",
  imagePath : MEDIAURL + "/digit.png",
  imageRatio : 8,
  ratio : 8,
  cutouts : [
    { name : "0",    x : 0,     y : 0,    width : 0.7,   height : 1 },
    { name : "1",    x : 1,     y : 0,    width : 0.7,   height : 1 },
    { name : "2",    x : 2,     y : 0,    width : 0.7,   height : 1 },
    { name : "3",    x : 3,     y : 0,    width : 0.7,   height : 1 },
    { name : "4",    x : 4,     y : 0,    width : 0.7,   height : 1 },
    { name : "5",    x : 5,     y : 0,    width : 0.7,   height : 1 },
    { name : "6",    x : 6,     y : 0,    width : 0.7,   height : 1 },
    { name : "7",    x : 7,     y : 0,    width : 0.7,   height : 1 },
    { name : "8",    x : 8,     y : 0,    width : 0.7,   height : 1 },
    { name : "9",    x : 9,     y : 0,    width : 0.7,   height : 1 },
    { name : "-",    x : 10,    y : 0,    width : 0.7,   height : 1 },
    { name : "+",    x : 11,    y : 0,    width : 0.8,   height : 1 }
  ]
});
