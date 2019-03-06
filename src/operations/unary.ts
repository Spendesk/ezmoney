import { MonetaryValue } from '../monetary-value';
import { assertValidMonetaryValue } from '../utils/assertions';
import { abs } from '../utils/math';

/**
 * @public
 * Returns the provided monetary value with an amount of the opposite sign.
 * @remarks
 * See {@link unsafeNegate} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value whose sign will be changed
 * @returns a `MonetaryValue` object with the same `currency` and `precision` as `monetaryValue` but whose `amount` is `-monetaryValue.amount`
 */
export function negate<C extends string>(
  monetaryValue: MonetaryValue<C>,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue);
  return unsafeNegate(monetaryValue);
}

/**
 * @public
 * Returns the provided monetary value with an amount of the opposite sign.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link negate} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value whose sign will be changed
 * @returns a `MonetaryValue` object with the same `currency` and `precision` as `monetaryValue` but whose `amount` is `-monetaryValue.amount`
 */
export function unsafeNegate<C extends string>(
  monetaryValue: MonetaryValue<C>,
): MonetaryValue<C> {
  return {
    amount: -monetaryValue.amount,
    currency: monetaryValue.currency,
    precision: monetaryValue.precision,
  };
}

/**
 * @public
 * Returns the provided monetary value with an amount that is positive.
 * @remarks
 * See {@link unsafeAbsolute} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value whose sign will be removed
 * @returns a `MonetaryValue` object with the same `currency` and `precision` as `monetaryValue` but whose `amount` is `abs(monetaryValue.amount)`
 */
export function absolute<C extends string>(
  monetaryValue: MonetaryValue<C>,
): MonetaryValue<C> {
  assertValidMonetaryValue(monetaryValue);
  return unsafeAbsolute(monetaryValue);
}

/**
 * @public
 * Returns the provided monetary value with an amount that is positive.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link absolute} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value whose sign will be removed
 * @returns a `MonetaryValue` object with the same `currency` and `precision` as `monetaryValue` but whose `amount` is `abs(monetaryValue.amount)`
 */
export function unsafeAbsolute<C extends string>(
  monetaryValue: MonetaryValue<C>,
): MonetaryValue<C> {
  return {
    amount: abs(monetaryValue.amount),
    currency: monetaryValue.currency,
    precision: monetaryValue.precision,
  };
}
