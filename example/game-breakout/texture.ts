import Stage from "../../src";

await Stage.atlas({
  image: { src: "./bg.png", ratio: 2 },
  textures: {
    board: { x: 0, y: 0, width: 320, height: 416 },
  },
});

await Stage.atlas({
  image: { src: "./main.png", ratio: 2 },
  map: function (tex) {
    tex.y = 256 - (tex.y + tex.height);
    return tex;
  },
  textures: {
    br: { x: 32 * 0, y: 0, width: 32, height: 32 },
    bg: { x: 32 * 1, y: 0, width: 32, height: 32 },
    bb: { x: 32 * 2, y: 0, width: 32, height: 32 },
    by: { x: 32 * 3, y: 0, width: 32, height: 32 },
    bp: { x: 32 * 4, y: 0, width: 32, height: 32 },

    brs: { x: 160, y: 0, width: 16, height: 16 },
    bgs: { x: 176, y: 0, width: 16, height: 16 },
    bbs: { x: 192, y: 0, width: 16, height: 16 },
    bys: { x: 208, y: 0, width: 16, height: 16 },
    bps: { x: 224, y: 0, width: 16, height: 16 },

    paddleFull: { x: 0, y: 32, width: 48, height: 16 },
    paddleMini: { x: 48, y: 32, width: 32, height: 16 },
    ball: { x: 80, y: 32, width: 16, height: 16 },
    "+": { x: 96, y: 32, width: 16, height: 16 },
    "-": { x: 112, y: 32, width: 16, height: 16 },

    restart: { x: 192, y: 48, width: 64, height: 64 },

    d_: {
      0: { x: 16 * 0, y: 48, width: 16, height: 16 },
      1: { x: 16 * 1, y: 48, width: 16, height: 16 },
      2: { x: 16 * 2, y: 48, width: 16, height: 16 },
      3: { x: 16 * 3, y: 48, width: 16, height: 16 },
      4: { x: 16 * 4, y: 48, width: 16, height: 16 },
      5: { x: 16 * 5, y: 48, width: 16, height: 16 },
      6: { x: 16 * 6, y: 48, width: 16, height: 16 },
      7: { x: 16 * 7, y: 48, width: 16, height: 16 },
      8: { x: 16 * 8, y: 48, width: 16, height: 16 },
      9: { x: 16 * 9, y: 48, width: 16, height: 16 },
      " ": { x: 16 * 10, y: 48, width: 16, height: 16 },
    },
  },
});
