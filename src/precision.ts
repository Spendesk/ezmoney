import { MonetaryValue } from './monetary-value';
import {
  assertValidMonetaryValue,
  assertValidPrecision,
} from './utils/assertions';
import { pow10 } from './utils/math';
import { RoundingFunction, roundHalfToEven } from './roundings';

/**
 * @public
 * Returns an equivalent monetary value, whose precision is the provided one if it is equal or higher.
 * @remarks
 * The operation may cause overflows or imprecisions if the provided precision is big enough.
 * See {@link unsafeMatchPrecision} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value whose precision may be changed
 * @param precision - The precision that the monetary value shall match; must be a positive safe integer
 * @returns a `MonetaryValue` object equivalent to `monetaryValue` and whose `precision` may be equal to `precision`
 */
export function matchPrecision<C extends string>(
  monetaryValue: MonetaryValue<C>,
  precision: number,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue);
  assertValidPrecision(precision);
  return unsafeMatchPrecision(monetaryValue, precision);
}

/**
 * @public
 * Returns an equivalent monetary value, whose precision is the provided one if it is equal or higher.
 * Does not check the validity of the arguments.
 * @remarks
 * The operation may cause overflows or imprecisions if the provided precision is big enough.
 * See {@link matchPrecision} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value whose precision may be changed
 * @param precision - The precision that the monetary value shall match
 * @returns a `MonetaryValue` object equivalent to `monetaryValue` and whose `precision` may be equal to `precision`
 */
export function unsafeMatchPrecision<C extends string>(
  monetaryValue: MonetaryValue<C>,
  precision: number,
): MonetaryValue<C> {
  if (monetaryValue.precision >= precision) {
    return monetaryValue;
  }
  return {
    amount: monetaryValue.amount * pow10(precision - monetaryValue.precision),
    currency: monetaryValue.currency,
    precision,
  };
}

/**
 * @public
 * Returns a monetary value whose precision is the provided one.
 * It is equivalent to the provided monetary value if the precision is equal or higher than the one of the provided monetary value.
 * Otherwise, it rounds the amount.
 * @remarks
 * The operation may cause overflows or imprecisions if the provided precision is big enough.
 * Also, note that the operation may be destructive if the precision is lower than the one of the provided monetary value.
 * See {@link unsafeSetPrecision} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value whose precision will be changed
 * @param precision - The precision that the monetary value shall be set to; must be a positive safe integer
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` object whose `precision` is equal to `precision` and that may be equivalent to `monetaryValue`
 */
export function setPrecision<C extends string>(
  monetaryValue: MonetaryValue<C>,
  precision: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue);
  assertValidPrecision(precision);
  return unsafeSetPrecision(monetaryValue, precision, roundingFunction);
}

/**
 * @public
 * Returns a monetary value whose precision is the provided one.
 * It is equivalent to the provided monetary value if the precision is equal or higher than the one of the provided monetary value.
 * Otherwise, it rounds the amount.
 * Does not check the validity of the arguments.
 * @remarks
 * The operation may cause overflows or imprecisions if the provided precision is big enough.
 * Also, note that the operation may be destructive if the precision is lower than the one of the provided monetary value.
 * See {@link setPrecision} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value whose precision will be changed
 * @param precision - The precision that the monetary value shall be set to
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` object whose `precision` is equal to `precision` and that may be equivalent to `monetaryValue`
 */
export function unsafeSetPrecision<C extends string>(
  monetaryValue: MonetaryValue<C>,
  precision: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  if (monetaryValue.precision >= precision) {
    const divider = pow10(monetaryValue.precision - precision);
    const wholePart = Math.floor(monetaryValue.amount / divider);
    const numerator = monetaryValue.amount % divider;
    return {
      amount: roundingFunction(wholePart, numerator, divider),
      currency: monetaryValue.currency,
      precision,
    };
  }
  return {
    amount: monetaryValue.amount * pow10(precision - monetaryValue.precision),
    currency: monetaryValue.currency,
    precision,
  };
}
