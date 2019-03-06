/**
 * @internal
 * Computes the minimum of two numbers.
 * @param a - First number
 * @param b - Second number
 * @returns the smallest number between `a` and `b`
 */
export function min(a: number, b: number): number {
  return Math.min(a, b);
}

/**
 * @internal
 * Computes the maximum of two numbers.
 * @param a - First number
 * @param b - Second number
 * @returns the largest number between `a` and `b`
 */
export function max(a: number, b: number): number {
  return Math.max(a, b);
}

/**
 * @internal
 * Computes the sign of a number.
 * @param n - A number
 * @returns `1` if `n` is positive or null; `-1` otherwise
 */
export function sign(n: number): 1 | -1 {
  return Object.is(Math.abs(n), n) ? 1 : -1;
}

/**
 * @internal
 * Computes the absolute value of a number.
 * @param n - A number
 * @returns the absolute value of `n`
 */
export function abs(n: number): number {
  return Math.abs(n);
}

/**
 * @internal
 * Computes the sum of an array of numbers.
 * @param ns - An array of numbers
 * @returns the sum of all the numbers in `ns`; `0` if `ns` is empty
 */
export function sum(ns: number[]): number {
  const { length } = ns;
  let total = 0;
  for (let i = 0; i < length; i++) {
    total += ns[i];
  }
  return total;
}

/**
 * @internal
 * Raises 10 to the power of the provided number.
 * @param e - The exponent
 * @returns `10 ** e`
 */
export function pow10(e: number): number {
  return 10 ** e;
}

/**
 * @internal
 * Splits a number in whole shares of given weights.
 * @remarks
 * A 1-dimension Brensenham algorithm is used to handle rounding: shares are rounded down but the decimal part contributes to an incremental error that is added to the shares as they are computed.
 * Negative and non-integer weights are supported, as long as their sum is a strictly positive safe integer.
 * The operation may cause overflows or imprecisions if some weights are negative and the provided amount is great enough.
 * @param n - The number to split
 * @param weights - The weights according to which `n` should be split
 * @param total - The sum of the weights; must be a strictly positive safe integer
 * @returns an array of integers of the same length as `weights` and whose sum is equal to `n`
 */
export function allocate(
  n: number,
  weights: number[],
  total: number,
): number[] {
  const { length } = weights;
  const shares = new Array(length);
  let crumbs = 0;
  let sum = 0;
  let i = 0;
  while (i < length - 1) {
    const share = (weights[i] / total) * n + crumbs;
    const wholeShare = Math.floor(share);
    crumbs = share - wholeShare;
    sum += wholeShare;
    shares[i] = wholeShare;
    ++i;
  }
  shares[i] = n - sum;
  return shares;
}
