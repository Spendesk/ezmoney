import { MonetaryValue } from './monetary-value';
import { abs, pow10 } from './utils/math';
import {
  assertValidMonetaryValue,
  assertValidPrecision,
  assertSafeInteger,
} from './utils/assertions';
import { RoundingFunction, roundHalfToEven } from './roundings';

/**
 * @public
 * Turns a number and a currency into a monetary value.
 * @remarks
 * See {@link unsafeFromNumber} for an implementation that does not validate the arguments.
 * @param number - The number that will be used to define the amount of monetary value
 * @param currency - The currency of the monetary value
 * @param precision - The precision of the monetary value; defaults to `0`
 * @param roundingFunction - The rounding method to apply when setting the precision (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a valid `MonetaryValue` object with the provided currency and whose decimal value is the provided number, up to the provided precision
 */
export function fromNumber<C extends string>(
  number: number,
  currency: C,
  precision: number = 0,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  // Does not use unsafeFromNumber because we need to validate mid-computation
  assertValidPrecision(precision);
  const scaled = number * pow10(precision);
  const wholePart = Math.floor(scaled);
  assertSafeInteger(wholePart);
  const fractionalPart = scaled - wholePart;
  const amount = roundingFunction(wholePart, fractionalPart * 100, 100);
  return { amount, currency, precision };
}

/**
 * @public
 * Turns a number and a currency into a monetary value.
 * Does not check the validity of the input.
 * @remarks
 * See {@link fromNumber} for an implementation that validates the arguments.
 * @param number - The number that will be used to define the amount of monetary value
 * @param currency - The currency of the monetary value
 * @param precision - The precision of the monetary value; defaults to `0`
 * @param roundingFunction - The rounding method to apply when setting the precision (by default {@link roundHalfToEven | round half to even}); see {@link RoundingFunction}
 * @returns a `MonetaryValue` object with the provided currency and whose decimal value is the provided number, up to the provided precision
 */
export function unsafeFromNumber<C extends string>(
  number: number,
  currency: C,
  precision: number = 0,
  roundingFunction: RoundingFunction = roundHalfToEven,
): MonetaryValue<C> {
  const scaled = number * pow10(precision);
  const wholePart = Math.floor(scaled);
  const fractionalPart = scaled - wholePart;
  const amount = roundingFunction(wholePart, fractionalPart * 100, 100);
  return { amount, currency, precision };
}

/**
 * @public
 * Returns the decimal value of the provided monetary value.
 * @remarks
 * See {@link unsafeToNumber} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value to coerce to a number
 */
export function toNumber<C extends string>(
  monetaryValue: MonetaryValue<C>,
): number {
  assertValidMonetaryValue(monetaryValue);
  return unsafeToNumber(monetaryValue);
}

/**
 * @public
 * @param monetaryValue - The monetary value to coerce to a number
 */
export function unsafeToNumber<C extends string>(
  monetaryValue: MonetaryValue<C>,
): number {
  return monetaryValue.amount / pow10(monetaryValue.precision);
}

/**
 * @public
 * Parses a string into a monetary value.
 * The string must be the currency, followed by a space, followed by the decimal value.
 * @remarks
 * See {@link unsafeFromString} for an implementation that does not validate the return value.
 * @param str - The string to parse into a `MonetaryValue ` object; must match the regular expression `/^.+ [+-]?\d*\.?\d+$/ms`
 * @returns a valid `MonetaryValue` object
 */
export function fromString(str: string): MonetaryValue {
  const monetaryValue = unsafeFromString(str);
  assertValidMonetaryValue(monetaryValue);
  return monetaryValue;
}

/**
 * @public
 * Parses a string into a monetary value.
 * The string must be the currency, followed by a space, followed by the decimal value.
 * Does not check the validity of the output.
 * @remarks
 * See {@link fromString} for an implementation that validates the return value.
 * @param str - The string to parse into a `MonetaryValue ` object; must match the regular expression `/^.+ [+-]?\d*\.?\d+$/ms`
 * @returns a `MonetaryValue` object
 */
export function unsafeFromString(str: string): MonetaryValue {
  const result = fromStringParsingRegex.exec(str);
  if (!result) {
    throw new SyntaxError('Cannot parse monetary value');
  }
  const [, currency, sign, wholePartStr, decimalPoint, decimalPartStr] = result;
  const precision = decimalPoint ? decimalPartStr.length : 0;
  // When there is no decimal point, there is no decimal part either
  // The last group in the regex captures the last digit of the whole part
  let amount = parseInt(wholePartStr + decimalPartStr, 10);
  if (sign === '-') {
    amount *= -1;
  }
  return { amount, currency, precision };
}

/**
 * @internal
 */
export const fromStringParsingRegex = /^([\s\S]+) ([+-])?(\d*)(\.?)(\d+)$/m;

/**
 * @public
 * Turns a monetary value into a predictable string.
 * It is formed of the currency, followed by a space, followed by the decimal value.
 * @remarks
 * See {@link unsafeToString} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value to turn into a `string`
 * @returns a predictable string representation of the provided `MonetaryValue` object
 */
export function toString(monetaryValue: MonetaryValue): string {
  assertValidMonetaryValue(monetaryValue);
  return unsafeToString(monetaryValue);
}

/**
 * @public
 * Turns a monetary value into a predictable string.
 * It is formed of the currency, followed by a space, followed by the decimal value.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link toString} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value to turn into a `string`
 * @returns a predictable string representation of the provided `MonetaryValue` object
 */
export function unsafeToString<C extends string>(
  monetaryValue: MonetaryValue<C>,
): string {
  const { amount, precision, currency } = monetaryValue;
  const signStr = amount < 0 ? '-' : '';
  const absoluteAmountStr = abs(amount).toString();
  if (precision === 0) {
    return `${currency} ${signStr}${absoluteAmountStr}`;
  }
  if (absoluteAmountStr.length <= precision) {
    const leadingZeros = new Array(precision - absoluteAmountStr.length)
      .fill(0)
      .join('');
    return `${currency} ${signStr}0.${leadingZeros}${absoluteAmountStr}`;
  }
  const splitIndex = absoluteAmountStr.length - precision;
  const wholePartStr = absoluteAmountStr.substring(0, splitIndex);
  const decimalPartStr = absoluteAmountStr.substring(splitIndex);
  return `${currency} ${signStr}${wholePartStr}.${decimalPartStr}`;
}
