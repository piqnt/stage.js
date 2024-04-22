/** @internal */
export function getPixelRatio() {
  // todo: do we need to divide by backingStoreRatio?
  return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
}
