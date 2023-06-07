export class Matrix {
  constructor(a, b, c, d, e, f) {
    this.reset(a, b, c, d, e, f);
  }
  toString() {
    return '[' + this.a + ', ' + this.b + ', ' + this.c + ', ' + this.d + ', '
      + this.e + ', ' + this.f + ']';
  }
  clone() {
    return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
  }
  reset(a, b, c, d, e, f) {
    this._dirty = true;
    if (typeof a === 'object') {
      this.a = a.a, this.d = a.d;
      this.b = a.b, this.c = a.c;
      this.e = a.e, this.f = a.f;
    } else {
      this.a = a || 1, this.d = d || 1;
      this.b = b || 0, this.c = c || 0;
      this.e = e || 0, this.f = f || 0;
    }
    return this;
  }
  identity() {
    this._dirty = true;
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    return this;
  }
  rotate(angle) {
    if (!angle) {
      return this;
    }

    this._dirty = true;

    var u = angle ? Math.cos(angle) : 1;
    // android bug may give bad 0 values
    var v = angle ? Math.sin(angle) : 0;

    var a = u * this.a - v * this.b;
    var b = u * this.b + v * this.a;
    var c = u * this.c - v * this.d;
    var d = u * this.d + v * this.c;
    var e = u * this.e - v * this.f;
    var f = u * this.f + v * this.e;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;

    return this;
  }
  translate(x, y) {
    if (!x && !y) {
      return this;
    }
    this._dirty = true;
    this.e += x;
    this.f += y;
    return this;
  }
  scale(x, y) {
    if (!(x - 1) && !(y - 1)) {
      return this;
    }
    this._dirty = true;
    this.a *= x;
    this.b *= y;
    this.c *= x;
    this.d *= y;
    this.e *= x;
    this.f *= y;
    return this;
  }
  skew(x, y) {
    if (!x && !y) {
      return this;
    }
    this._dirty = true;

    var a = this.a + this.b * x;
    var b = this.b + this.a * y;
    var c = this.c + this.d * x;
    var d = this.d + this.c * y;
    var e = this.e + this.f * x;
    var f = this.f + this.e * y;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }
  concat(m) {
    this._dirty = true;

    var n = this;

    var a = n.a * m.a + n.b * m.c;
    var b = n.b * m.d + n.a * m.b;
    var c = n.c * m.a + n.d * m.c;
    var d = n.d * m.d + n.c * m.b;
    var e = n.e * m.a + m.e + n.f * m.c;
    var f = n.f * m.d + m.f + n.e * m.b;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;

    return this;
  }
  inverse() {
    if (this._dirty) {
      this._dirty = false;
      this.inverted = this.inverted || new Matrix();
      var z = this.a * this.d - this.b * this.c;
      this.inverted.a = this.d / z;
      this.inverted.b = -this.b / z;
      this.inverted.c = -this.c / z;
      this.inverted.d = this.a / z;
      this.inverted.e = (this.c * this.f - this.e * this.d) / z;
      this.inverted.f = (this.e * this.b - this.a * this.f) / z;
    }
    return this.inverted;
  }
  map(p, q) {
    q = q || {};
    q.x = this.a * p.x + this.c * p.y + this.e;
    q.y = this.b * p.x + this.d * p.y + this.f;
    return q;
  }
  mapX(x, y) {
    if (typeof x === 'object')
      y = x.y, x = x.x;
    return this.a * x + this.c * y + this.e;
  }
  mapY(x, y) {
    if (typeof x === 'object')
      y = x.y, x = x.x;
    return this.b * x + this.d * y + this.f;
  }
};
