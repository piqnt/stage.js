/** @internal */
const objectToString = Object.prototype.toString;

// todo: remove this function

/** @internal */
export function isHash(value: any) {
  return objectToString.call(value) === "[object Object]" && value.constructor === Object;
}
