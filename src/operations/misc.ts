import { MonetaryValue } from '../monetary-value';
import {
  assertValidMonetaryValue,
  assertSafeInteger,
  assertNonZeroSafeInteger,
  assertStrictlyPositiveSafeInteger,
  assertValidPrecision,
} from '../utils/assertions';
import { RoundingFunction, roundHalfToEven } from '../roundings';
import { allocate as numberAllocate, sum, pow10 } from '../utils/math';

/**
 * @public
 * Returns a monetary value whose amount is the product of the monetary value's amount and the decimal factor.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link unsafeMultiply} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value to multiply
 * @param factor - The coefficient of the number that `monetaryValue` will be multiplied by; must be a safe integer
 * @param factorPrecision - The precision of the number that `monetaryValue` will be multiplied by
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half-to-even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` whose decimal value is the product of the ones of `monetaryValue` and `factor / (10 ** factorPrecision)`, with the same `currency` as `monetaryValue`
 */
export function multiply<C extends string>(
  monetaryValue: MonetaryValue<C>,
  factor: number,
  factorPrecision: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue);
  assertSafeInteger(factor);
  assertValidPrecision(factorPrecision);
  return unsafeMultiply(
    monetaryValue,
    factor,
    factorPrecision,
    roundingFunction,
  );
}

/**
 * @public
 * Returns a monetary value whose amount is the product of the monetary value's amount and the decimal factor.
 * Does not check the validity of the arguments.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link multiply} for an implementation that validates the arguments.
 * @param factor - The coefficient of the number that `monetaryValue` will be multiplied by
 * @param factorPrecision - The precision of the number that `monetaryValue` will be multiplied by
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half-to-even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` whose decimal value is the product of the ones of `monetaryValue` and `factor / (10 ** factorPrecision)`, with the same `currency` as `monetaryValue`
 */
export function unsafeMultiply<C extends string>(
  monetaryValue: MonetaryValue<C>,
  factor: number,
  factorPrecision: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  return unsafeIntegerDivide(
    {
      amount: monetaryValue.amount * factor,
      currency: monetaryValue.currency,
      precision: monetaryValue.precision,
    },
    pow10(factorPrecision),
    roundingFunction,
  );
}

/**
 * @public
 * Returns a monetary value whose amount is the quotient of the monetary value's amount and the divider.
 * @remarks
 * The operation may cause overflows or imprecisions depending on the provided rounding function.
 * See {@link unsafeIntegerDivide} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value to divide
 * @param divider - The number that `monetaryValue` will be divided by; must be a safe integer different than `0`
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` whose decimal value is the whole quotient of the ones of `monetaryValue` and `divider`, with the same `currency` as `monetaryValue`
 */
export function integerDivide<C extends string>(
  monetaryValue: MonetaryValue<C>,
  divider: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue);
  assertNonZeroSafeInteger(divider);
  return unsafeIntegerDivide(monetaryValue, divider, roundingFunction);
}

/**
 * @public
 * Returns a monetary value whose amount is the quotient of the monetary value's amount and the divider.
 * Does not check the validity of the arguments.
 * @remarks
 * The operation may cause overflows or imprecisions depending on the provided rounding function.
 * See {@link integerDivide} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value to divide
 * @param divider - The number that `monetaryValue` will be divided by
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` whose decimal value is the whole quotient of the ones of `monetaryValue` and `divider`, with the same `currency` as `monetaryValue`
 */
export function unsafeIntegerDivide<C extends string>(
  monetaryValue: MonetaryValue<C>,
  divider: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  const wholePart = Math.floor(monetaryValue.amount / divider);
  const numerator = monetaryValue.amount % divider;
  return {
    amount: roundingFunction(wholePart, numerator, divider),
    currency: monetaryValue.currency,
    precision: monetaryValue.precision,
  };
}

/**
 * @public
 * Returns a monetary value whose amount is the division of the provided monetary value's amount and the decimal divider.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link unsafeDivide} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value to divide
 * @param divider - The coefficient of the number that `monetaryValue` will be divided by; must be a safe integer different than `0`
 * @param dividerPrecision - The precision of the number that `monetaryValue` will be divided by
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` whose decimal value is the division of the ones of `monetaryValue` and `divider / (10 ** dividerPrecision)`, with the same `currency` as `monetaryValue`
 */
export function divide<C extends string>(
  monetaryValue: MonetaryValue<C>,
  divider: number,
  dividerPrecision: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue);
  assertNonZeroSafeInteger(divider);
  assertValidPrecision(dividerPrecision);
  return unsafeDivide(
    monetaryValue,
    divider,
    dividerPrecision,
    roundingFunction,
  );
}

/**
 * @public
 * Returns a monetary value whose amount is the division of the provided monetary value's amount and the decimal divider.
 * Does not check the validity of the arguments.
 * @remarks
 * The operation may cause overflows or imprecisions.
 * See {@link divide} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value to divide
 * @param divider - The coefficient of the number that `monetaryValue` will be divided by
 * @param dividerPrecision - The precision of the number that `monetaryValue` will be divided by
 * @param roundingFunction - The rounding method to apply to the result's amount (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` whose decimal value is the division of the ones of `monetaryValue` and `divider / (10 ** dividerPrecision)`, with the same `currency` as `monetaryValue`
 */
export function unsafeDivide<C extends string>(
  monetaryValue: MonetaryValue<C>,
  divider: number,
  dividerPrecision: number,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  return unsafeIntegerDivide(
    {
      amount: monetaryValue.amount * pow10(dividerPrecision),
      currency: monetaryValue.currency,
      precision: monetaryValue.precision,
    },
    divider,
    roundingFunction,
  );
}

/**
 * @public
 * Splits a monetary value in shares of given weights, preserving the precision.
 * Useful when you want to perform successive divisions but must ensure that the sum of the quotients is equal to the provided monetary value.
 * Does not check the validity of the arguments.
 * @remarks
 * A 1-dimension Brensenham algorithm is used to handle rounding.
 * When the division of the amount by a given weight results to a non-integer number, the decimal part is reported to the next share.
 * This ensures, in a single pass over the weights, that the sum of the shares is equal to the provided monetary value.
 * It is however unpredictable as the order of the weights will change the result.
 * You may need to a implement a similar function yourself if you need control over the rounding.
 * The operation may cause of overflows or imprecisions if negative weights are provided.
 * See {@link unsafeAllocate} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value that will be split
 * @param weights - An array of numbers, positive or negative, that will determine the allocation; their sum must be different than `0`
 */
export function allocate<C extends string>(
  monetaryValue: MonetaryValue<C>,
  weights: number[],
): MonetaryValue<C>[] {
  assertValidMonetaryValue(monetaryValue);
  const total = sum(weights);
  assertStrictlyPositiveSafeInteger(total);
  return internalAllocate(monetaryValue, weights, total);
}

/**
 * @public
 * Splits a monetary value in shares of given weights, preserving the precision.
 * Useful when you want to perform successive divisions but must ensure that the sum of the quotients is equal to the provided monetary value.
 * @remarks
 * A 1-dimension Brensenham algorithm is used to handle rounding.
 * When the division of the amount by a given weight results to a non-integer number, the decimal part is reported to the next share.
 * This ensures, in a single pass over the weights, that the sum of the shares is equal to the provided monetary value.
 * It is however unpredictable as the order of the weights will change the result.
 * You may need to a implement a similar function yourself if you need control over the rounding.
 * The operation may cause of overflows or imprecisions if negative weights are provided.
 * See {@link allocate} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value that will be split
 * @param weights - An array of numbers, positive or negative, that will determine the allocation
 */
export function unsafeAllocate<C extends string>(
  monetaryValue: MonetaryValue<C>,
  weights: number[],
): MonetaryValue<C>[] {
  return internalAllocate(monetaryValue, weights, sum(weights));
}

function internalAllocate<C extends string>(
  monetaryValue: MonetaryValue<C>,
  weights: number[],
  total: number,
): MonetaryValue<C>[] {
  const { amount, currency, precision } = monetaryValue;
  const shares = numberAllocate(amount, weights, total);
  return shares.map((share) => ({
    amount: share,
    currency,
    precision,
  }));
}
