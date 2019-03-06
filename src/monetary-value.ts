import { assertValidMonetaryValue } from './utils/assertions';

/**
 * @public
 * A decimal value with a currency.
 */
export interface MonetaryValue<C extends string = string> {
  /**
   * The coefficient part of the decimal value.
   */
  readonly amount: number;
  /**
   * A string representation of the currency.
   * Currencies are deemed equal if and only if they have the same string representation.
   */
  readonly currency: C;
  /**
   * The "exponent" part of the decimal value.
   * This is number of decimal places that the monetary value must have.
   */
  readonly precision: number;
}

/**
 * @public
 * Returns whether the provided argument is a monetary value.
 * Validates both the shape of the object and whether it is a valid monetary value.
 * Can be used as a type guard.
 * @remarks
 * Must be chained to another type guard if you want a more specific type for currency.
 * @param arg - Value to check
 * @returns `true` if `arg` is a of type `MonetaryValue` and has a valid `amount` and a valid `precision`; `false` otherwise
 */
export function isMonetaryValue(arg: unknown): arg is MonetaryValue {
  const hasRightShape =
    typeof arg === 'object' &&
    arg !== null &&
    typeof (arg as { amount: unknown }).amount === 'number' &&
    typeof (arg as { currency: unknown }).currency === 'string' &&
    typeof (arg as { precision: unknown }).precision === 'number' &&
    (arg as { currency: string }).currency.length > 0;
  if (!hasRightShape) {
    return false;
  }
  const { amount, precision } = arg as MonetaryValue;
  return (
    precision >= 0 &&
    precision <= 15 &&
    Number.isInteger(precision) &&
    Number.isSafeInteger(amount)
  );
}

/**
 * @public
 * A convenience function to build a monetary value.
 * @remarks
 * See {@link unsafeCreate} for an implementation that does not validate the arguments.
 * @param amount - The amount that will be given to the monetary value; must be a safe integer
 * @param currency - The currency that will be given to the monetary value
 * @param precision - The precision that will be given to the monetary value; must a positive safe integer; defaults to `0`
 * @returns a `MonetaryValue` object whose `amount`, `currency` and `precision` are the ones provided
 */
export function create<C extends string>(
  amount: number,
  currency: C,
  precision: number = 0,
): MonetaryValue<C> {
  const monetaryValue = unsafeCreate(amount, currency, precision);
  assertValidMonetaryValue(monetaryValue);
  return monetaryValue;
}

/**
 * @public
 * A convenience function to build a monetary value.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link create} for an implementation that validates the arguments.
 * @param amount - The amount that will be given to the monetary value
 * @param currency - The currency that will be given to the monetary value
 * @param precision - The precision that will be given to the monetary value; defaults to `0`
 * @returns a `MonetaryValue` object whose `amount`, `currency` and `precision` are the ones provided
 */
export function unsafeCreate<C extends string>(
  amount: number,
  currency: C,
  precision: number = 0,
): MonetaryValue<C> {
  return { amount, currency, precision };
}
