/** @internal */
const objectToString = Object.prototype.toString;

/** @internal */
export function isFn(value: any) {
  const str = objectToString.call(value);
  return (
    str === "[object Function]" ||
    str === "[object GeneratorFunction]" ||
    str === "[object AsyncFunction]"
  );
}

/** @internal */
export function isHash(value: any) {
  return objectToString.call(value) === "[object Object]" && value.constructor === Object;
  // return value && typeof value === 'object' && !Array.isArray(value) && !isFn(value);
}
