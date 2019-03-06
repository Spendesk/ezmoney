import { min, max, sign, abs } from './utils/math';

/**
 * @public
 * A rounding function returns an integer from a potentially non-integer value.
 * Such a value is represented as the sum of an integer and a fraction.
 * The fraction is always between -1 and 1, non included, and its denominator is the original divider.
 * Rounding functions are not meant to be used as-is;
 * they are to be passed to functions that may perform rounding, such as {@link divide}.
 * As such, none of them validate their arguments.
 * When a function is expected to perform rounding, it uses {@link roundHalfToEven} by default.
 * This can be overridden by passing a rounding function in the last argument.
 * Most of the common rounding functions are defined and exported in Ezmoney,
 * but you can of course implement your own.
 */
export type RoundingFunction = (
  /**
   * The whole part of the number to be rounded
   */
  wholePart: number,
  /**
   * The numerator of the fractional part of the number to be rounded
   */
  numeratorFractionalPart: number,
  /**
   * The denominator of the fractional part of the number to be rounded
   */
  denominatorFractionalPart: number,
) => number;

/**
 * @public
 * Rounds to the smallest integer
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division; _Unused_
 */
export function roundDown(
  wholePart: number,
  numeratorFractionalPart: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  denominatorFractionalPart?: number,
): number {
  return numeratorFractionalPart === 0
    ? wholePart
    : wholePart + min(0, sign(numeratorFractionalPart));
}

/**
 * @public
 * Rounds to the greatest integer
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division; _Unused_
 */
export function roundUp(
  wholePart: number,
  numeratorFractionalPart: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  denominatorFractionalPart?: number,
): number {
  return numeratorFractionalPart === 0
    ? wholePart
    : wholePart + max(0, sign(numeratorFractionalPart));
}

/**
 * @public
 * Rounds to the integer that is the closest to zero.
 * This is equivalent to truncating to the whole part.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division; _Unused_
 * @param denominatorFractionalPart - The divider of the prior division; _Unused_
 */
export function roundTowardsZero(
  wholePart: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  numeratorFractionalPart?: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  denominatorFractionalPart?: number,
): number {
  return wholePart;
}

/**
 * @public
 * Rounds to the integer that is the farthest from zero.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division; _Unused_
 */
export function roundAwayFromZero(
  wholePart: number,
  numeratorFractionalPart: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  denominatorFractionalPart?: number,
): number {
  return numeratorFractionalPart === 0
    ? wholePart
    : wholePart + sign(numeratorFractionalPart);
}

/**
 * @public
 * Rounds to the closest integer, and up if the number is an exact half.
 * The most common rounding for regular numbers.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division
 */
export function roundHalfUp(
  wholePart: number,
  numeratorFractionalPart: number,
  denominatorFractionalPart: number,
): number {
  const doubleN = 2 * abs(numeratorFractionalPart);
  if (doubleN > denominatorFractionalPart) {
    return roundAwayFromZero(wholePart, numeratorFractionalPart);
  }
  if (doubleN < denominatorFractionalPart) {
    return roundTowardsZero(wholePart);
  }
  return roundUp(wholePart, numeratorFractionalPart);
}

/**
 * @public
 * Rounds to the closest integer, and down if the number is an exact half.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division
 */
export function roundHalfDown(
  wholePart: number,
  numeratorFractionalPart: number,
  denominatorFractionalPart: number,
): number {
  const doubleN = 2 * abs(numeratorFractionalPart);
  if (doubleN > denominatorFractionalPart) {
    return roundAwayFromZero(wholePart, numeratorFractionalPart);
  }
  if (doubleN < denominatorFractionalPart) {
    return roundTowardsZero(wholePart);
  }
  return roundDown(wholePart, numeratorFractionalPart);
}

/**
 * @public
 * Rounds to the closest integer, and towards zero if the number is an exact half.
 * A very common rounding for regular numbers.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division
 */
export function roundHalfTowardsZero(
  wholePart: number,
  numeratorFractionalPart: number,
  denominatorFractionalPart: number,
): number {
  if (2 * abs(numeratorFractionalPart) > denominatorFractionalPart) {
    return roundAwayFromZero(wholePart, numeratorFractionalPart);
  }
  return roundTowardsZero(wholePart);
}

/**
 * @public
 * Rounds to the closest integer, and away zero if the number is an exact half.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division
 */
export function roundHalfAwayFromZero(
  wholePart: number,
  numeratorFractionalPart: number,
  denominatorFractionalPart: number,
): number {
  if (2 * abs(numeratorFractionalPart) >= denominatorFractionalPart) {
    return roundAwayFromZero(wholePart, numeratorFractionalPart);
  }
  return roundTowardsZero(wholePart);
}

/**
 * @public
 * Rounds to the closest integer, and to the closest even integer if the number is an exact half.
 * The most common rounding for monetary value as the tie-breaking rule is not biased towards a particular direction.
 * Also called the Banker's rounding.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division
 */
export function roundHalfToEven(
  wholePart: number,
  numeratorFractionalPart: number,
  denominatorFractionalPart: number,
): number {
  if (2 * abs(numeratorFractionalPart) === denominatorFractionalPart) {
    if (wholePart % 2 === 0) {
      return wholePart;
    }
    return wholePart + sign(numeratorFractionalPart);
  }
  return roundHalfUp(
    wholePart,
    numeratorFractionalPart,
    denominatorFractionalPart,
  );
}

/**
 * @public
 * Rounds to the closest integer, and to the closest odd integer if the number is an exact half.
 * The tie-breaking rule is not biased towards a particular direction.
 * @param wholePart - The whole part of the number to round
 * @param numeratorFractionalPart - The remainder of the prior division
 * @param denominatorFractionalPart - The divider of the prior division
 */
export function roundHalfToOdd(
  wholePart: number,
  numeratorFractionalPart: number,
  denominatorFractionalPart: number,
): number {
  if (2 * abs(numeratorFractionalPart) === denominatorFractionalPart) {
    if (wholePart % 2 === 0) {
      return wholePart + sign(numeratorFractionalPart);
    }
    return wholePart;
  }
  return roundHalfUp(
    wholePart,
    numeratorFractionalPart,
    denominatorFractionalPart,
  );
}
