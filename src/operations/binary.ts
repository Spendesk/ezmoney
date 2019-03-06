import { MonetaryValue } from '../monetary-value';
import {
  assertValidMonetaryValue,
  assertSameCurrency,
} from '../utils/assertions';
import { unsafeMatchPrecision } from '../precision';
import { unsafeCompare, Comparison } from '../comparisons';

/**
 * @public
 * Returns the monetary value with the greatest decimal amount.
 * @remarks
 * See {@link unsafeMaximum} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency
 * @returns `monetaryValue1` if its decimal value is greater than the one of `monetaryValue2` or, when they are equal, if its precision is lower than the one of `monetaryValue2`; otherwise, `monetaryValue2`
 */
export function maximum<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeMaximum(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns the monetary value with the greatest decimal amount.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link maximum} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`
 * @returns `monetaryValue1` if its decimal value is greater than the one of `monetaryValue2` or, when they are equal, if its precision is lower than the one of `monetaryValue2`; otherwise, `monetaryValue2`
 */
export function unsafeMaximum<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  const comparison = unsafeCompare(monetaryValue1, monetaryValue2);
  switch (comparison) {
    case Comparison.GT:
      return monetaryValue1;
    case Comparison.LT:
      return monetaryValue2;
    case Comparison.EQ:
      return monetaryValue1.precision <= monetaryValue2.precision
        ? monetaryValue1
        : monetaryValue2;
    /* istanbul ignore next line */
    default:
      throw new TypeError(
        'Unknown comparison value; this should not have happened',
      );
  }
}

/**
 * @public
 * Returns the monetary value with the smallest decimal amount.
 * @remarks
 * See {@link unsafeMinimum} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`; must be of the same currency
 * @returns `monetaryValue2` if its decimal value is greater than the one of `monetaryValue1` or, when they are equal, if its precision is lower than the one of `monetaryValue1`; otherwise, `monetaryValue1`
 */
export function minimum<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeMinimum(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns the monetary value with the smallest decimal amount.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link minimum} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to compare to `monetaryValue1`
 * @returns `monetaryValue2` if its decimal value is greater than the one of `monetaryValue1` or, when they are equal, if its precision is lower than the one of `monetaryValue1`; otherwise, `monetaryValue1`
 */
export function unsafeMinimum<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  const comparison = unsafeCompare(monetaryValue1, monetaryValue2);
  switch (comparison) {
    case Comparison.GT:
      return monetaryValue2;
    case Comparison.LT:
      return monetaryValue1;
    case Comparison.EQ:
      return monetaryValue1.precision >= monetaryValue2.precision
        ? monetaryValue1
        : monetaryValue2;
    /* istanbul ignore next line */
    default:
      throw new TypeError(
        'Unknown comparison value; this should not have happened',
      );
  }
}

/**
 * @public
 * Returns the sum of the two monetary values.
 * If they have a different `precision`, the highest is used.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link unsafeAdd} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to add to `monetaryValue1`; must be of the same currency
 * @returns a `MonetaryValue` object whose decimal value is the sum of the ones of `monetaryValue1` and `monetaryValue2`, with the same `currency` as `monetaryValue1` and `monetaryValue2`
 */
export function add<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeAdd(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns the sum of the two monetary values.
 * Does not check the validity of the arguments.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link add} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to add to `monetaryValue1`
 * @returns a `MonetaryValue` object whose decimal value is the sum of the ones of `monetaryValue1` and `monetaryValue2`, with the same `currency` as `monetaryValue1` and `monetaryValue2`
 */
export function unsafeAdd<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  const a = unsafeMatchPrecision(monetaryValue1, monetaryValue2.precision);
  const b = unsafeMatchPrecision(monetaryValue2, monetaryValue1.precision);
  return {
    amount: a.amount + b.amount,
    currency: a.currency,
    precision: a.precision,
  };
}

/**
 * @public
 * Returns the difference of the two monetary values.
 * If they have a different `precision`, the highest is used.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link unsafeSubtract} for an implementation that does not validate the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to subtract from `monetaryValue1`; must be of the same currency
 * @returns a `MonetaryValue` whose decimal value is the difference between the ones of `monetaryValue1` and `monetaryValue2`, with the same `currency` as `monetaryValue1` and `monetaryValue2`
 */
export function subtract<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue1);
  assertValidMonetaryValue(monetaryValue2);
  assertSameCurrency(monetaryValue1, monetaryValue2);
  return unsafeSubtract(monetaryValue1, monetaryValue2);
}

/**
 * @public
 * Returns the difference of the two monetary values.
 * Does not check the validity of the arguments.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link subtract} for an implementation that validates the arguments.
 * @param monetaryValue1 - A first monetary value
 * @param monetaryValue2 - A second monetary value to subtract to the first
 */
export function unsafeSubtract<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): MonetaryValue<C> {
  const a = unsafeMatchPrecision(monetaryValue1, monetaryValue2.precision);
  const b = unsafeMatchPrecision(monetaryValue2, monetaryValue1.precision);
  return {
    amount: a.amount - b.amount,
    currency: a.currency,
    precision: a.precision,
  };
}
