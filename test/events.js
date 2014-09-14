var should = require('should');
var Cut = require('../cut-core.js');

describe("Count", function() {
  it("on", function(done) {
    var foo = Cut.create();
    var bar = Cut.create();
    var baz = Cut.create();
    var qux = Cut.create();

    baz.on('test', nop());
    baz._has('test').should.equal(1);

    qux.on('test', nop());
    qux.on('test', nop());
    qux._has('test').should.equal(2);

    bar.appendTo(foo);

    baz.appendTo(bar);
    qux.appendTo(bar);

    bar._has('test').should.equal(2);
    foo._has('test').should.equal(1);

    baz.remove();
    bar._has('test').should.equal(1);
    foo._has('test').should.equal(1);

    qux.remove();
    bar._has('test').should.equal(0);
    foo._has('test').should.equal(0);

    bar.remove();

    foo.append(bar, baz, qux);
    foo._has('test').should.equal(2);
    
    foo.empty();
    foo._has('test').should.equal(0);

    done();
  });

});

function nop() {
  return function() {

  };
}