/**
 * @packageDocumentation
 * Ezmoney is a library that helps in manipulating monetary values.
 * It defines the interface {@link MonetaryValue} on which functions such as {@link add} and {@link format} can be called.
 */

export {
  fromNumber,
  unsafeFromNumber,
  toNumber,
  unsafeToNumber,
  fromString,
  unsafeFromString,
  toString,
  unsafeToString,
} from './coercions';

export {
  Comparison,
  equivalent,
  unsafeEquivalent,
  identical,
  unsafeIdentical,
  compare,
  unsafeCompare,
  lessThan,
  unsafeLessThan,
  lessThanOrEqual,
  unsafeLessThanOrEqual,
  equal,
  unsafeEqual,
  greaterThanOrEqual,
  unsafeGreaterThanOrEqual,
  greaterThan,
  unsafeGreaterThan,
} from './comparisons';

export {
  LocaleMatcher,
  type CurrencyDisplay,
  SignDisplay,
  CurrencySign,
  type MonetaryValueFormatOptions,
  format,
  unsafeFormat,
  isFormatSupported,
} from './formatting';

export {
  type MonetaryValue,
  isMonetaryValue,
  create,
  unsafeCreate,
} from './monetary-value';

export {
  maximum,
  unsafeMaximum,
  minimum,
  unsafeMinimum,
  add,
  unsafeAdd,
  subtract,
  unsafeSubtract,
} from './operations/binary';

export {
  multiply,
  unsafeMultiply,
  integerDivide,
  unsafeIntegerDivide,
  divide,
  unsafeDivide,
  allocate,
  unsafeAllocate,
} from './operations/misc';

export {
  negate,
  unsafeNegate,
  absolute,
  unsafeAbsolute,
} from './operations/unary';

export {
  matchPrecision,
  setPrecision,
  unsafeMatchPrecision,
  unsafeSetPrecision,
} from './precision';

export {
  type RoundingFunction,
  roundDown,
  roundUp,
  roundTowardsZero,
  roundAwayFromZero,
  roundHalfUp,
  roundHalfDown,
  roundHalfTowardsZero,
  roundHalfAwayFromZero,
  roundHalfToEven,
  roundHalfToOdd,
} from './roundings';
