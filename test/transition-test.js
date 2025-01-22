let expect = require("./util/expect");

let Stage = require("../src/");

describe("Tween", function () {
  it("component.tween()", function () {
    let component = Stage.component();
    let m = component.tween();
    expect(component._transitions[0]).be(m);
    expect(m._duration).be(400);
    expect(m._delay).be(0);

    let n = component.tween(500, 100);
    expect(component._transitions[0]).be(n);
    expect(n._duration).be(500);
    expect(n._delay).be(100);

    let o = component.tween(true);
    expect(component._transitions[0]).be(n);
    expect(component._transitions[1]).be(o);
  });

  it("tween.tween()", function () {
    let component = Stage.component();
    let m = component.tween();

    {
      let n = m.tween();
      expect(m._next).be(n);
      expect(n._duration).be(400);
      expect(n._delay).be(0);
    }
    {
      let n = m.tween(500, 100);
      expect(m._next).be(n);
      expect(n._duration).be(500);
      expect(n._delay).be(100);
    }
  });
});
