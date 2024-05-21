let expect = require("./util/expect");
let sinon = require("sinon");

let Stage = require("../src/tree");
require("../src/event");

describe("Event", function () {
  it("on/off", function () {
    let hello = sinon.stub();
    let open = sinon.stub();

    let door = Stage.component();

    expect(door.listeners("knock")).not.ok();

    door.on("knock", hello);
    expect(door.listeners("knock")).eql([hello]);

    door.on("knock", open);
    expect(door.listeners("knock")).eql([hello, open]);

    door.off("knock", open);
    expect(door.listeners("knock")).eql([hello]);

    door.off("knock", hello);
    expect(door.listeners("knock")).not.ok();

    door.on("knock ring", open);
    expect(door.listeners("knock")).eql([open]);
    expect(door.listeners("ring")).eql([open]);

    door.off("knock ring", open);

    expect(door.listeners("knock")).not.ok();
    expect(door.listeners("ring")).not.ok();
  });

  it("flag", function () {
    let foo = Stage.component();
    let bar = Stage.component();
    let baz = Stage.component();
    let qux = Stage.component();

    let ring = sinon.stub();
    baz.on("ring", ring);
    expect(baz._flag("ring")).equal(1);

    baz.off("ring", ring);
    expect(baz._flag("ring")).equal(0);

    baz.on("knock", sinon.stub());
    expect(baz._flag("knock")).equal(1);

    qux.on("knock", sinon.stub());
    qux.on("knock", sinon.stub());
    expect(qux._flag("knock")).equal(2);

    bar.appendTo(foo);

    baz.appendTo(bar);
    qux.appendTo(bar);

    expect(bar._flag("knock")).equal(2);
    expect(foo._flag("knock")).equal(1);

    baz.remove();
    expect(bar._flag("knock")).equal(1);
    expect(foo._flag("knock")).equal(1);

    qux.remove();
    expect(bar._flag("knock")).equal(0);
    expect(foo._flag("knock")).equal(0);

    bar.remove();

    foo.append(bar, baz, qux);
    expect(foo._flag("knock")).equal(2);

    foo.empty();
    expect(foo._flag("knock")).equal(0);
  });
});
