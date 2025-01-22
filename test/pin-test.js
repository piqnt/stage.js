let expect = require("./util/expect");

let Stage = require("../src/tree");
let Pin = require("../src/pin");

describe("Pin", function () {
  it(".set()/.get()", function () {
    let pin = {},
      set = {
        alpha: 0.8,
        width: 200,
        height: 300,
        scaleX: 2,
        scaleY: 3,
      };
    for (let key in set) {
      Pin.prototype.set.call(pin, key, set[key]);
    }
    for (let key in set) {
      expect(pin["_" + key]).be(set[key]);
      expect(Pin.prototype.get.call(pin, key)).be(set[key]);
    }
  });

  it(".pin()", function () {
    let foo = Stage.component();
    let pin = foo.pin();
    foo.pin("scale", 2);
    expect(foo.pin("scaleX")).be(2);
    expect(foo.pin("scaleY")).be(2);
    foo.pin({
      width: 200,
      height: 300,
    });
    expect(foo.pin("width")).be(200);
    expect(foo.pin("height")).be(300);
  });

  it(".fit()", function () {
    let component = Stage.component();
    let pin = component.pin();
    component.pin({
      width: 100,
      height: 100,
    });
    component.fit(200, 300);
    expect(component.pin("scaleX")).be(2);
    expect(component.pin("scaleY")).be(3);
    expect(component.pin("width")).be(100);
    expect(component.pin("height")).be(100);

    component.fit(200, 300, "in");
    expect(component.pin("scaleX")).be(2);
    expect(component.pin("scaleY")).be(2);
    expect(component.pin("width")).be(100);
    expect(component.pin("height")).be(100);

    component.fit(200, 300, "out");
    expect(component.pin("scaleX")).be(3);
    expect(component.pin("scaleY")).be(3);
    expect(component.pin("width")).be(100);
    expect(component.pin("height")).be(100);

    component.fit(200, 400, "out-crop");
    expect(component.pin("scaleX")).be(4);
    expect(component.pin("scaleY")).be(4);
    expect(component.pin("width")).be(50);
    expect(component.pin("height")).be(100);

    component.fit(200, 400, "in-pad");
    expect(component.pin("scaleX")).be(2);
    expect(component.pin("scaleY")).be(2);
    expect(component.pin("width")).be(100);
    expect(component.pin("height")).be(200);
  });
});
