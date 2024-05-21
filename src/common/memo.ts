export class Memo {
  static init() {
    return new Memo();
  }

  memory: any = [];

  recall(...rest: any[]) {
    let equal = this.memory.length === rest.length;
    for (let i = 0; equal && i < rest.length; i++) {
      equal = equal && this.memory[i] === rest[i];
      this.memory[i] = rest[i];
    }
    this.memory.length = rest.length;
    return equal;
  }

  reset() {
    this.memory.length = 0;
    // void 0;
  }
}
