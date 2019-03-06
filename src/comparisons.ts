import { MonetaryValue } from './monetary-value';
import { unsafeMatchPrecision } from './precision';
import {
  assertSameCurrency,
  assertValidMonetaryValue,
} from './utils/assertions';

/**
 * @public
 * Return values for {@link compare}.
 */
export const enum Comparison {
  /**
   * Less than
   */
  LT = -1,
  /**
   * Equal
   */
  EQ = 0,
  /**
   * Greater than
   */
  GT = 1,
}

/**
 * @public
 * Returns whether the two monetary values are equivalent.
 * @remarks
 * Contrary to most other binary operators, `equivalent` does not throw when the provided monetary values have different currencies.
 * Use {@link equal} if you want to determine the equality of monetary values that always have the same currency.
 * See {@link unsafeEquivalent} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` if the objects hold the same decimal value and have the same `currency`; `false` otherwise
 */
export function equivalent<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  return unsafeEquivalent(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns whether the two monetary values are equivalent.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link equivalent} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` if the objects hold the same decimal value and have the same `currency`; `false` otherwise
 */
export function unsafeEquivalent<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  if (monetaryValue1.currency !== monetaryValue2.currency) {
    return false;
  }
  const a = unsafeMatchPrecision(monetaryValue1, monetaryValue2.precision);
  const b = unsafeMatchPrecision(monetaryValue2, monetaryValue1.precision);
  return a.amount === b.amount;
}

/**
 * @public
 * Returns whether the two monetary values are identical.
 * @remarks
 * Contrary to most other binary operators, `identical` does not throw when the provided monetary values have different currencies.
 * See {@link unsafeIdentical} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` if the objects have the same `amount`, the same `currency` and the same `precision`; `false` otherwise
 */
export function identical<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  return unsafeIdentical(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns whether the two monetary values are identical.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link identical} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` if the objects have the same `amount`, the same `currency` and the same `precision`; `false` otherwise
 */
export function unsafeIdentical<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  return (
    monetaryValue1.currency === monetaryValue2.currency &&
    monetaryValue1.amount === monetaryValue2.amount &&
    monetaryValue1.precision === monetaryValue2.precision
  );
}

/**
 * @public
 * Returns a number whose sign represents whether the first monetary value is less than, equal to or greater than the second monetary value.
 * @remarks
 * See {@link unsafeCompare} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency as `monetaryValue1`
 * @returns respectively `-1`, `0` or `1` when `monetaryValue1` is less than, equal to or greater than `monetaryValue2`
 */
export function compare<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): Comparison {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeCompare(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns a number whose sign represents whether the first monetary value is less than, equal to or greater than the second monetary value.
 * Does not check the validity of the arguments.
 * @remarks
 * This comparison ignores the currencies.
 * See {@link compare} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns respectively `-1`, `0` or `1` when `monetaryValue1` is less than, equal to or greater than `monetaryValue2`
 */
export function unsafeCompare<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): Comparison {
  const a = unsafeMatchPrecision(monetaryValue1, monetaryValue2.precision);
  const b = unsafeMatchPrecision(monetaryValue2, monetaryValue1.precision);
  if (a.amount < b.amount) {
    return Comparison.LT;
  }
  if (a.amount > b.amount) {
    return Comparison.GT;
  }
  return Comparison.EQ;
}

/**
 * @public
 * Returns whether the first monetary value is strictly less than the second monetary value.
 * @remarks
 * See {@link unsafeLessThan} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency as `monetaryValue1`
 * @returns `true` when `monetaryValue1` holds a decimal value strictly less than `monetaryValue2`; `false` otherwise
 */
export function lessThan<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeLessThan(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns whether the first monetary value is strictly less than the second monetary value.
 * Does not check the validity of the arguments.
 * @remarks
 * This comparison ignores the currencies.
 * See {@link lessThan} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` when `monetaryValue1` holds a decimal value strictly less than `monetaryValue2`; `false` otherwise
 */
export function unsafeLessThan<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  return unsafeCompare(monetaryValue1, monetaryValue2) === Comparison.LT;
}

/**
 * @public
 * Returns whether the first monetary value is less than or equal to the second monetary value.
 * @remarks
 * See {@link unsafeLessThanOrEqual} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency as `monetaryValue1`
 * @returns `true` when `monetaryValue1` holds a decimal value less than or equivalent to `monetaryValue2`; `false` otherwise
 */
export function lessThanOrEqual<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeLessThanOrEqual(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns whether the first monetary value is less than or equal to the second monetary value.
 * Does not check the validity of the arguments.
 * @remarks
 * This comparison ignores the currencies.
 * See {@link lessThanOrEqual} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` when `monetaryValue1` holds a decimal value less than or equivalent to `monetaryValue2`; `false` otherwise
 */
export function unsafeLessThanOrEqual<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  const comparison = unsafeCompare(monetaryValue1, monetaryValue2);
  return comparison === Comparison.LT || comparison === Comparison.EQ;
}

/**
 * @public
 * Returns whether the two monetary values are equal.
 * @remarks
 * As with most of the other binary operators, `equal` throws when the provided monetary values have different currencies.
 * Use {@link equivalent} if you want to determine the equality of monetary values that may have a different currency.
 * See {@link unsafeEqual} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency as `monetaryValue1`
 * @returns `true` if the objects hold the same decimal value; `false` otherwise
 */
export function equal<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeEqual(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns whether the two monetary values are equal.
 * Does not check the validity of the arguments.
 * @remarks
 * This comparison ignores the currencies.
 * See {@link equal} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` if the objects hold the same decimal value; `false` otherwise
 */
export function unsafeEqual<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  const a = unsafeMatchPrecision(monetaryValue1, monetaryValue2.precision);
  const b = unsafeMatchPrecision(monetaryValue2, monetaryValue1.precision);
  return a.amount === b.amount;
}

/**
 * @public
 * Returns whether the first monetary value is greater than or equal to the second monetary value.
 * @remarks
 * This comparison ignores the currencies.
 * See {@link unsafeGreaterThanOrEqual} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency as `monetaryValue1`
 * @returns `true` when `monetaryValue1` holds a decimal value greater than or equivalent to `monetaryValue2`; `false` otherwise
 */
export function greaterThanOrEqual<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeGreaterThanOrEqual(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns whether the first monetary value is greater than or equal to the second monetary value.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link greaterThanOrEqual} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` when `monetaryValue1` holds a decimal value greater than or equivalent to `monetaryValue2`; `false` otherwise
 */
export function unsafeGreaterThanOrEqual<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  const comparison = unsafeCompare(monetaryValue1, monetaryValue2);
  return comparison === Comparison.GT || comparison === Comparison.EQ;
}

/**
 * @public
 * Returns whether the first monetary value is strictly greater than the second monetary value.
 * @remarks
 * This comparison ignores the currencies.
 * See {@link unsafeGreaterThan} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency as `monetaryValue1`
 * @returns `true` when `monetaryValue1` holds a decimal value greater than `monetaryValue2`; `false` otherwise
 */
export function greaterThan<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeGreaterThan(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns whether the first monetary value is strictly greater than the second monetary value.
 * Does not check the validity of the arguments.
 * @remarks
 * This comparison ignores the currencies.
 * See {@link greaterThan} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare the first with
 * @returns `true` when `monetaryValue1` holds a decimal value greater than `monetaryValue2`; `false` otherwise
 */
export function unsafeGreaterThan<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): boolean {
  return unsafeCompare(monetaryValue1, monetaryValue2) === Comparison.GT;
}
