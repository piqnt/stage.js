Cut.addTexture({
  name : "base",
  imagePath : "base.png",
  imageRatio : 4,
  ratio : 16,
  filter : function(cut) {
    cut.y = 1 - (cut.y + cut.height);
    return cut;
  },
  cutouts : [
    { name : "drone", x : 0, y : 0, width : 1, height : 1 }
  ]
}); 