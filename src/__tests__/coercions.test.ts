import {
  fromNumber,
  unsafeFromNumber,
  toNumber,
  unsafeToNumber,
  toString,
  unsafeToString,
  fromString,
  unsafeFromString,
  fromStringParsingRegex,
} from '../coercions';
import { pow10 } from '../utils/math';
import { roundAwayFromZero } from '../roundings';

describe('fromNumber()', () => {
  it('returns the same value as unsafeFromNumber()', () => {
    fc.assert(
      fc.property(
        fc.number(Number.MIN_SAFE_INTEGER / 1e4),
        fc.currency(),
        fc.precision(4),
        (number, currency, precision) => {
          expect(
            fromNumber(number, currency, precision),
          ).toBeIdenticalToMonetaryValue(
            unsafeFromNumber(number, currency, precision),
          );
        },
      ),
    );
  });
  it('throws a RangeError when the precision is not valid', () => {
    fc.assert(
      fc.property(
        fc.double(),
        fc.currency(),
        fc.invalidPrecision(),
        (number, currency, precision) => {
          expect(() => fromNumber(number, currency, precision)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
  it('throws a RangeError when the amount would not be safe', () => {
    expect(() => fromNumber(Number.MAX_SAFE_INTEGER / 1e4, 'EUR', 5)).toThrow(
      RangeError,
    );
    expect(() => fromNumber(Number.MIN_SAFE_INTEGER / 1e4, 'EUR', 5)).toThrow(
      RangeError,
    );
  });
});

describe('unsafeFromNumber()', () => {
  it('returns a monetary value whose currency is the provided one', () => {
    fc.assert(
      fc.property(
        fc.number(),
        fc.currency(),
        fc.precision(),
        (number, currency, precision) => {
          expect(unsafeFromNumber(number, currency, precision)).toHaveProperty(
            'currency',
            currency,
          );
        },
      ),
    );
  });
  it('returns a monetary value whose precision is the provided one', () => {
    fc.assert(
      fc.property(
        fc.number(),
        fc.currency(),
        fc.precision(),
        (number, currency, precision) => {
          expect(unsafeFromNumber(number, currency, precision)).toHaveProperty(
            'precision',
            precision,
          );
        },
      ),
    );
  });
  it('returns a monetary value whose amount is the provided number when the provided number is an integer and the precision is zero', () => {
    fc.assert(
      fc.property(fc.integer(), fc.currency(), (number, currency) => {
        expect(unsafeFromNumber(number, currency, 0)).toHaveProperty(
          'amount',
          number,
        );
      }),
    );
  });
  it('returns a monetary value whose amount is the coefficient of the provided number up to the relevant digit, rounded according to the provided rounding function', () => {
    expect(unsafeFromNumber(3.14, 'EUR', 1, roundAwayFromZero)).toHaveProperty(
      'amount',
      32,
    );
  });
  it('uses the rounding function', () => {
    const mockRoundingFunction = jest.fn(() => NaN);
    fc.assert(
      fc.property(
        fc.number(),
        fc.currency(),
        fc.precision(),
        (number, currency, precision) => {
          expect(
            unsafeFromNumber(number, currency, precision, mockRoundingFunction),
          ).toHaveProperty('amount', NaN);
          expect(mockRoundingFunction).toHaveBeenCalledTimes(1);
          mockRoundingFunction.mockClear();
        },
      ),
    );
  });
});

describe('toNumber()', () => {
  it('returns the same value as unsafeToNumber()', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(toNumber(mv)).toBe(unsafeToNumber(mv));
      }),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(fc.invalidMonetaryValue(), (mv) => {
        expect(() => toNumber(mv)).toThrow(RangeError);
      }),
    );
  });
});

describe('unsafeToNumber()', () => {
  it('returns zero when the amount is 0', () => {
    expect(
      unsafeToNumber({
        amount: 0,
        currency: 'EUR',
        precision: 2,
      }),
    ).toBe(0);
  });
  it('returns negative zero when the amount is -0', () => {
    expect(
      unsafeToNumber({
        amount: -0,
        currency: 'EUR',
        precision: 2,
      }),
    ).toBe(-0);
  });
  it('returns the amount when the precision is 0', () => {
    fc.assert(
      fc.property(fc.amount(), (amount) => {
        expect(
          unsafeToNumber({
            amount,
            currency: 'EUR',
            precision: 0,
          }),
        ).toBe(amount);
      }),
    );
  });
  it('returns the decimal value of the monetary value as a float', () => {
    expect(
      unsafeToNumber({
        amount: 42,
        currency: 'EUR',
        precision: 4,
      }),
    ).toBe(0.0042);
    expect(
      unsafeToNumber({
        amount: 314,
        currency: 'EUR',
        precision: 2,
      }),
    ).toBe(3.14);
  });
});

describe('fromString()', () => {
  it('returns the same monetary value as unsafeFromString()', () => {
    fc.assert(
      fc.property(
        fc.unicodeString(1, 512),
        fc.number(1e9),
        fc.precision(6),
        (currency, decimalValue, precision) => {
          const str = `${currency} ${decimalValue.toFixed(precision)}`;
          expect(fromString(str)).toBeIdenticalToMonetaryValue(
            unsafeFromString(str),
          );
        },
      ),
    );
  });
});

describe('unsafeFromString()', () => {
  it('extracts the currency at the beginning of the string', () => {
    fc.assert(
      fc.property(
        fc.unicodeString(1, 512),
        fc.number(),
        fc.precision(),
        (currency, decimalValue, precision) => {
          expect(
            unsafeFromString(`${currency} ${decimalValue.toFixed(precision)}`),
          ).toHaveProperty('currency', currency);
        },
      ),
    );
  });
  it('extracts the amount after the last space', () => {
    fc.assert(
      fc.property(fc.unicodeString(1, 512), (currency) => {
        expect(unsafeFromString(`${currency} 3.14`)).toHaveProperty(
          'amount',
          314,
        );
      }),
    );
  });
  it('extracts a positive amount when the sign is omitted', () => {
    expect(unsafeFromString(`EUR 3.14`).amount).toBeGreaterThan(0);
  });
  it('extracts a positive amount when the sign is +', () => {
    expect(unsafeFromString(`EUR +3.14`).amount).toBeGreaterThan(0);
  });
  it('extracts a negative amount when the sign is -', () => {
    expect(unsafeFromString(`EUR -3.14`).amount).toBeLessThan(0);
  });
  it('extracts an amount of zero when the decimal value in the string is 0', () => {
    expect(unsafeFromString(`EUR 0`)).toHaveProperty('amount', 0);
  });
  it('extracts an amount of zero when the decimal value in the string is +0', () => {
    expect(unsafeFromString(`EUR +0`)).toHaveProperty('amount', 0);
  });
  it('extracts an amount of zero when the decimal value in the string is .0', () => {
    expect(unsafeFromString(`EUR .0`)).toHaveProperty('amount', 0);
  });
  it('extracts an amount of zero when the decimal value in the string is +.0', () => {
    expect(unsafeFromString(`EUR .0`)).toHaveProperty('amount', 0);
  });
  it('extracts an amount of negative zero when the decimal value in the string is -0', () => {
    expect(unsafeFromString(`EUR -0`)).toHaveProperty('amount', -0);
  });
  it('extracts an amount of negative zero when the decimal value in the string is -.0', () => {
    expect(unsafeFromString(`EUR -.0`)).toHaveProperty('amount', -0);
  });
  it('extracts a precision of zero when there are no decimal places', () => {
    fc.assert(
      fc.property(fc.string(1, 512), (currency) => {
        const str = `${currency} 42`;
        expect(unsafeFromString(str)).toHaveProperty('precision', 0);
      }),
    );
  });
  it('extracts a precision equal to the number of trailing zeros when the decimal value is an integer', () => {
    fc.assert(
      fc.property(fc.string(1, 512), fc.precision(), (currency, precision) => {
        fc.pre(precision > 0);
        const trailingZeros = Array(precision)
          .fill(0)
          .join('');
        let str = `${currency} 42.${trailingZeros}`;
        expect(unsafeFromString(str)).toHaveProperty('precision', precision);
      }),
    );
  });
  it('extracts a precision equal to the number of decimal places, with trailing zeros', () => {
    fc.assert(
      fc.property(
        fc.string(1, 512),
        fc.precision(),
        fc.number(),
        (currency, precision, decimalValue) => {
          const str = `${currency} ${decimalValue.toFixed(precision)}`;
          expect(unsafeFromString(str)).toHaveProperty('precision', precision);
        },
      ),
    );
  });
  it('allows the absence of a leading zero when the decimal value is strictly less than 1 and strictly greater than -1', () => {
    fc.assert(
      fc.property(fc.integer(0, 1e15 - 1), (decimalPart) => {
        const withLeadingZero = `EUR 0.${decimalPart}`;
        const withoutLeadingZero = `EUR .${decimalPart}`;
        expect(unsafeFromString(withLeadingZero)).toBeIdenticalToMonetaryValue(
          unsafeFromString(withoutLeadingZero),
        );
      }),
    );
  });
  it('throws a SyntaxError when the provided string does not match the proper regular expression', () => {
    fc.assert(
      fc.property(fc.unicodeString(), (str) => {
        fc.pre(!fromStringParsingRegex.test(str));
        expect(() => unsafeFromString(str)).toThrow(SyntaxError);
      }),
    );
  });
  it('returns a number that, when provided to fromNumber() with the same currency and precision, returns the monetary value back', () => {
    fc.assert(
      fc.property(fc.smallMonetaryValue(), (mv) => {
        const n = unsafeToNumber(mv);
        const mv2 = unsafeFromNumber(n, mv.currency, mv.precision);
        expect(mv2).toBeIdenticalToMonetaryValue(mv);
      }),
    );
  });
});

describe('toString()', () => {
  it('returns the same string as unsafeToString()', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(toString(mv)).toBe(unsafeToString(mv));
      }),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(fc.invalidMonetaryValue(), (mv) => {
        expect(() => toString(mv)).toThrow(RangeError);
      }),
    );
  });
});

describe('unsafeToString()', () => {
  it('returns a string that starts with the currency, followed by a space', () => {
    fc.assert(
      fc.property(fc.string(1, 512), (currency) => {
        const str = unsafeToString({ amount: 314, currency, precision: 2 });
        expect(str).toMatch(/.+ [^ ]*/);
        expect(str.startsWith(`${currency} `)).toBe(true);
      }),
    );
  });
  it('returns a string that ends with the decimal value of the monetary value', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        const segments = unsafeToString(mv).split(' ');
        const decimalValueStr = segments[segments.length - 1];
        expect(parseFloat(decimalValueStr)).toBe(unsafeToNumber(mv));
      }),
    );
  });
  it('returns a string that ends with a decimal value that starts with "0." when the number of digits of the amount is less than or equal to the precision', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 1e6 - 1),
        fc.integer(6, 15),
        (amount, precision) => {
          const mv = { amount, currency: 'EUR', precision };
          const segments = unsafeToString(mv).split(' ');
          const decimalValueStr = segments[segments.length - 1];
          expect(decimalValueStr.substring(0, 2)).toBe('0.');
        },
      ),
    );
  });
  it("returns a string that ends with a decimal value with enough trailing zeros so that there are as many decimal places as the monetary value's precision", () => {
    fc.assert(
      fc.property(fc.precision(), (precision) => {
        const mv = {
          amount: 42 * pow10(precision),
          currency: 'EUR',
          precision,
        };
        const segments = unsafeToString(mv).split(' ');
        const decimalValueStr = segments[segments.length - 1];
        const decimalPartStr = decimalValueStr.split('.')[1] || '';
        expect(decimalPartStr).toHaveLength(precision);
      }),
    );
  });
  it('returns a string that, when provided to fromString(), returns the monetary value back', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        const str = unsafeToString(mv);
        const mv2 = unsafeFromString(str);
        expect(mv2).toBeIdenticalToMonetaryValue(mv);
      }),
    );
  });
});
