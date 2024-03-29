import {
  Arbitrary,
  oneof,
  subarray,
  record,
  tuple,
  constant,
  boolean,
  integer,
  double,
  unicodeString,
} from 'fast-check';
import { MonetaryValue } from '../../monetary-value';
import * as Roundings from '../../roundings';
import { MonetaryValueFormatOptions } from '../../formatting';
import { alphabeticCodes } from './iso4217';
import {
  localeMatchers,
  currencyDisplays,
  signDisplays,
  currencySigns,
} from './enum-values';

export function number(
  maxAbs: number = Number.MAX_SAFE_INTEGER,
): Arbitrary<number> {
  return double(-maxAbs, maxAbs);
}

export function unsafeInteger(): Arbitrary<number> {
  return oneof(
    double(-Number.MAX_VALUE, Number.MIN_SAFE_INTEGER - 1),
    double(Number.MAX_SAFE_INTEGER + 2, Number.MAX_VALUE),
  );
}

export function amount(
  maxAbs: number = Number.MAX_SAFE_INTEGER,
): Arbitrary<number> {
  return integer(-maxAbs, maxAbs);
}

export function invalidAmount(): Arbitrary<number> {
  return oneof(
    double().filter((n) => !Number.isInteger(n)),
    unsafeInteger(),
    oneof(constant(NaN), constant(-Infinity), constant(Infinity)),
  );
}

interface CurrencyOptions {
  isoCodes?: boolean;
  maxLength?: number;
}

export function currency(options: CurrencyOptions = {}): Arbitrary<string> {
  const { isoCodes = false, maxLength = 3 } = options;
  if (isoCodes) {
    if (maxLength !== 3) {
      throw new RangeError(
        'Cannot specify a maximum length different than 3 for currency because ISO codes are always 3 characters long',
      );
    }
    return element(alphabeticCodes);
  }
  if (!(maxLength >= 1 && Number.isInteger(maxLength))) {
    throw new TypeError(
      'Max length of currency arbitrary is not an integer or not greater than or equal to 1',
    );
  }
  return unicodeString({ minLength: 1, maxLength });
}

// Limiting to 15 because 10 ** 16 > Number.MAX_SAFE_INTEGER
export function precision(max = 15): Arbitrary<number> {
  return integer(0, max);
}

export function invalidPrecision(): Arbitrary<number> {
  return oneof(
    double().filter((n) => !Number.isInteger(n)),
    double(-Number.MAX_VALUE, -1),
    double(16, Number.MAX_VALUE),
    oneof(constant(NaN), constant(-Infinity), constant(Infinity)),
  );
}

interface ArbitraryAmountAndPrecisionOptions {
  maxAbsAmount?: number;
  maxPrecision?: number;
}

interface ArbitraryMonetaryValueOptions
  extends ArbitraryAmountAndPrecisionOptions {
  maxAbsAmount?: number;
  maxPrecision?: number;
  currencyWithIsoCodes?: boolean;
}

export function monetaryValue(
  options: ArbitraryMonetaryValueOptions = {},
): Arbitrary<MonetaryValue> {
  return record({
    amount: amount(options.maxAbsAmount),
    currency: currency({ isoCodes: Boolean(options.currencyWithIsoCodes) }),
    precision: precision(options.maxPrecision),
  });
}

export function invalidMonetaryValue(): Arbitrary<MonetaryValue> {
  return tuple(amountAndPrecisionWithAnyInvalid(), currency()).map(
    ([[amount, precision], currency]) => ({
      amount,
      precision,
      currency,
    }),
  );
}

const DEFAULT_OPTIONS_SMALL: ArbitraryMonetaryValueOptions = {
  maxAbsAmount: 1e10,
  maxPrecision: 4,
};

// A version to generate smaller amounts in order to avoid overflows
export function smallMonetaryValue(
  options?: ArbitraryMonetaryValueOptions,
): Arbitrary<MonetaryValue> {
  const mergedOptions = Object.assign({}, DEFAULT_OPTIONS_SMALL, options);
  return monetaryValue(mergedOptions);
}

export function pairOfMonetaryValuesWithSameCurrency(
  options: ArbitraryMonetaryValueOptions = {},
): Arbitrary<[MonetaryValue, MonetaryValue]> {
  return tuple(
    currency(),
    amountAndPrecision(options),
    amountAndPrecision(options),
  ).map(buildPair);
}

export function pairOfSmallMonetaryValuesWithSameCurrency(
  options?: ArbitraryMonetaryValueOptions,
): Arbitrary<[MonetaryValue, MonetaryValue]> {
  const mergedOptions = Object.assign({}, DEFAULT_OPTIONS_SMALL, options);
  return pairOfMonetaryValuesWithSameCurrency(mergedOptions);
}

export function pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(): Arbitrary<
  [MonetaryValue, MonetaryValue]
> {
  return tuple(
    currency(),
    amountAndPrecisionWithAnyInvalid(),
    amountAndPrecisionWithAnyInvalid(),
  ).map(buildPair);
}

function buildPair(
  values: [string, [number, number], [number, number]],
): [MonetaryValue, MonetaryValue] {
  const [commonCurrency, [amount1, precision1], [amount2, precision2]] = values;
  return [
    {
      amount: amount1,
      currency: commonCurrency,
      precision: precision1,
    },
    {
      amount: amount2,
      currency: commonCurrency,
      precision: precision2,
    },
  ];
}

function amountAndPrecision(
  options: ArbitraryAmountAndPrecisionOptions = {},
): Arbitrary<[number, number]> {
  const { maxAbsAmount, maxPrecision } = options;
  return tuple(amount(maxAbsAmount), precision(maxPrecision));
}

function amountAndPrecisionWithAnyInvalid(): Arbitrary<[number, number]> {
  return oneof(
    tuple(amount(), invalidPrecision()),
    tuple(invalidAmount(), precision()),
    tuple(invalidAmount(), invalidPrecision()),
  );
}

function valuesOfMapObject<T>(object: { [key: string]: T }): T[] {
  return Object.keys(object).map((key) => object[key]);
}

const allRoundingFunctions: Roundings.RoundingFunction[] = valuesOfMapObject(
  Roundings,
);

export function roundingFunction(): Arbitrary<Roundings.RoundingFunction> {
  return element(allRoundingFunctions);
}

export function monetaryValueFormatOptions(): Arbitrary<
  MonetaryValueFormatOptions
> {
  return record({
    localeMatcher: element([...localeMatchers, undefined]),
    currencyDisplay: element([...currencyDisplays, undefined]),
    useGrouping: oneof(boolean(), constant(undefined)),
    signDisplay: element([...signDisplays, undefined]),
    currencySign: element([...currencySigns, undefined]),
  });
}

function first<T>(array: T[]): T {
  return array[0];
}

function element<T>(array: T[]): Arbitrary<T> {
  return subarray(array, { minLength: 1, maxLength: 1 }).map(first);
}
