const expect = require("./util/expect");
const sandboxed = require("sandboxed-module");

const Atlas = require("../src/atlas");

const mario = {
  x: 1,
  y: 2,
  width: 3,
  height: 4,
};

function bemario(obj) {
  expect(obj.draw).be.a("function");

  expect(obj.width).be(mario.width);
  expect(obj.height).be(mario.height);

  expect(obj._sx).be(mario.x);
  expect(obj._sy).be(mario.y);
  expect(obj._sw).be(mario.width);
  expect(obj._sh).be(mario.height);

  expect(obj._dx).be(0);
  expect(obj._dy).be(0);
  expect(obj._dw).be(mario.width);
  expect(obj._dh).be(mario.height);
}

it("Atlas", function () {
  let selected;

  selected = new Atlas({
    textures: {
      mario: mario,
    },
  })
    .select("mario")
    .one();
  bemario(selected);

  selected = new Atlas({
    textures: {
      mario: function () {
        return mario;
      },
    },
  })
    .select("mario")
    .one();
  bemario(selected);

  selected = new Atlas({
    textures: {
      mario: mario,
      him: "mario",
    },
  })
    .select("mario")
    .one();
  bemario(selected);

  selected = new Atlas({
    textures: {
      mario: mario,
      him: function () {
        return "mario";
      },
    },
  })
    .select("mario")
    .one();
  bemario(selected);

  selected = new Atlas({
    textures: {
      char: {
        mario: mario,
      },
    },
  })
    .select("char")
    .one("mario");
  bemario(selected);

  selected = new Atlas({
    textures: {
      mario: mario,
      char: {
        mario: "mario",
      },
    },
  })
    .select("char")
    .one("mario");
  bemario(selected);

  selected = new Atlas({
    textures: {
      walk: [mario, mario, mario],
    },
  })
    .select("walk")
    .array();
  expect(selected.length).be(3);
  bemario(selected[0]);

  selected = new Atlas({
    textures: {
      mario: mario,
      walk: ["mario", "mario", "mario"],
    },
  })
    .select("walk")
    .array();
  expect(selected.length).be(3);
  bemario(selected[0]);
});

describe("Stage.texture()", function () {
  it("atlas.textures", function () {
    let Stage = sandboxed.require("../src/");

    Stage.atlas({
      name: "name",
      textures: {
        mario: mario,
        walk: ["mario", "mario", "mario"],
      },
    });

    let obj, selected;

    selected = Stage.texture("name:mario").one();
    bemario(selected);

    selected = Stage.texture("mario").one();
    bemario(selected);

    selected = Stage.texture("walk").one();
    bemario(selected);

    selected = Stage.texture("mario").array((obj = []));
    expect(selected).be(obj);
    expect(selected.length).be(1);
    bemario(selected[0]);

    selected = Stage.texture("walk").array((obj = []));
    expect(selected).be(obj);
    expect(selected.length).be(3);
    bemario(selected[0]);
  });

  it("atlas.cutouts", function () {
    const Stage = sandboxed.require("../src/");

    Stage.atlas({
      name: "main",
      // imagePath : "main.png",
      // imageRatio : 4,
      trim: 0.1,
      cutouts: [
        {
          name: "color_dark",
          x: 0,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          name: "color_light",
          x: 16,
          y: 16,
          width: 16,
          height: 16,
        },
      ],
    });

    let dark = Stage.texture("main:color_dark").one();
    let both = Stage.texture("main:color_").array();

    expect(dark).be.an("object");
    expect(both).be.an("array");
    expect(both.length).be(2);
    expect(both[0]).be.an("object");
    expect(both[1]).be.an("object");
  });
});
