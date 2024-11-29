let expect = require("./util/expect");

let Stage = require("../src/");

describe("Tween", function () {
  it("node.tween()", function () {
    let node = Stage.component();
    let m = node.tween();
    expect(node._transitions[0]).be(m);
    expect(m._duration).be(400);
    expect(m._delay).be(0);

    let n = node.tween(500, 100);
    expect(node._transitions[0]).be(n);
    expect(n._duration).be(500);
    expect(n._delay).be(100);

    let o = node.tween(true);
    expect(node._transitions[0]).be(n);
    expect(node._transitions[1]).be(o);
  });

  it("tween.tween()", function () {
    let node = Stage.component();
    let m = node.tween();

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
