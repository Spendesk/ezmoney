import {
  assertSafeInteger,
  assertNonZeroSafeInteger,
  assertStrictlyPositiveSafeInteger,
  assertValidPrecision,
  assertValidMonetaryValue,
  assertSameCurrency,
} from '../assertions';

describe('assertSafeInteger()', () => {
  it('returns when the number is a random safe integer', () => {
    fc.assert(
      fc.property(
        fc.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        (i) => {
          expect(assertSafeInteger(i)).toBeUndefined();
        },
      ),
    );
  });
  it('returns when the number is zero', () => {
    expect(assertSafeInteger(0)).toBeUndefined();
  });
  it('throws a RangeError when the number is an integer that is not safe', () => {
    expect(() => assertSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      RangeError,
    );
  });
  it('throws a RangeError when the number is a float', () => {
    expect(() => assertSafeInteger(3.14)).toThrow(RangeError);
  });
  it('throws a RangeError when the number is NaN', () => {
    expect(() => assertSafeInteger(NaN)).toThrow(RangeError);
  });
});

describe('assertNonZeroSafeInteger()', () => {
  it('returns when the number is a random strictly positive safe integer', () => {
    fc.assert(
      fc.property(fc.integer(1, Number.MAX_SAFE_INTEGER), (i) => {
        expect(assertNonZeroSafeInteger(i)).toBeUndefined();
      }),
    );
  });
  it('returns when the number is a random strictly negative safe integer', () => {
    fc.assert(
      fc.property(fc.integer(Number.MIN_SAFE_INTEGER, -1), (i) => {
        expect(assertNonZeroSafeInteger(i)).toBeUndefined();
      }),
    );
  });
  it('throws a RangeError when the number is zero', () => {
    expect(() => assertNonZeroSafeInteger(0)).toThrow(RangeError);
    expect(() => assertNonZeroSafeInteger(-0)).toThrow(RangeError);
  });
  it('throws a RangeError when the number is an integer that is not safe', () => {
    expect(() => assertNonZeroSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      RangeError,
    );
  });
  it('throws a RangeError when the number is a float', () => {
    expect(() => assertNonZeroSafeInteger(3.14)).toThrow(RangeError);
  });
  it('throws a RangeError when the number is NaN', () => {
    expect(() => assertNonZeroSafeInteger(NaN)).toThrow(RangeError);
  });
});

describe('assertStrictlyPositiveSafeInteger()', () => {
  it('returns when the number is a random strictly positive safe integer', () => {
    fc.assert(
      fc.property(fc.integer(1, Number.MAX_SAFE_INTEGER), (i) => {
        expect(assertStrictlyPositiveSafeInteger(i)).toBeUndefined();
      }),
    );
  });
  it('throws a RangeError when the number is a strictly positive integer that is not safe', () => {
    expect(() =>
      assertStrictlyPositiveSafeInteger(Number.MAX_SAFE_INTEGER + 1),
    ).toThrow(RangeError);
  });
  it('throws a RangeError when the number is a strictly positive float', () => {
    expect(() => assertStrictlyPositiveSafeInteger(3.14)).toThrow(RangeError);
  });
  it('throws a RangeError when the number is a strictly negative safe integer', () => {
    expect(() => assertStrictlyPositiveSafeInteger(-42)).toThrow(RangeError);
  });
  it('throws a RangeError when the number is zero', () => {
    expect(() => assertStrictlyPositiveSafeInteger(0)).toThrow(RangeError);
  });
  it('throws a RangeError when the number is NaN', () => {
    expect(() => assertStrictlyPositiveSafeInteger(NaN)).toThrow(RangeError);
  });
});

describe('assertValidPrecision()', () => {
  it('throws a RangeError when the precision is a positive integer greater than 15', () => {
    fc.assert(
      fc.property(fc.double(16, Number.MAX_VALUE), (precision) => {
        expect(() => assertValidPrecision(precision)).toThrow(RangeError);
      }),
    );
  });
  it('throws a RangeError when the precision is a positive float', () => {
    expect(() => assertValidPrecision(3.14)).toThrow(RangeError);
  });
  it('throws a RangeError when the precision is a negative integer', () => {
    expect(() => assertValidPrecision(-42)).toThrow(RangeError);
  });
  it('throws a RangeError when the precision is NaN', () => {
    expect(() => assertValidPrecision(NaN)).toThrow(RangeError);
  });
});

describe('assertValidMonetaryValue()', () => {
  it('returns when provided a random valid monetary value', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) =>
        expect(assertValidMonetaryValue(mv)).toBeUndefined(),
      ),
    );
  });
  it('throws a RangeError when the precision is a positive integer greater than 15', () => {
    fc.assert(
      fc.property(fc.double(16, Number.MAX_VALUE), (precision) => {
        const mv = {
          amount: 314,
          currency: 'EUR',
          precision,
        };
        expect(() => assertValidMonetaryValue(mv)).toThrow(RangeError);
      }),
    );
  });
  it('throws a RangeError when the precision is a positive float', () => {
    expect(() =>
      assertValidMonetaryValue({
        amount: 314,
        currency: 'EUR',
        precision: 3.14,
      }),
    ).toThrow(RangeError);
  });
  it('throws a RangeError when the precision is a negative integer', () => {
    expect(() =>
      assertValidMonetaryValue({
        amount: 314,
        currency: 'EUR',
        precision: -42,
      }),
    ).toThrow(RangeError);
  });
  it('throws a RangeError when the precision is NaN', () => {
    expect(() =>
      assertValidMonetaryValue({
        amount: 314,
        currency: 'EUR',
        precision: NaN,
      }),
    ).toThrow(RangeError);
  });
  it('throws a RangeError when the amount is an integer that is not safe', () => {
    expect(() =>
      assertValidMonetaryValue({
        amount: Number.MAX_SAFE_INTEGER + 1,
        currency: 'EUR',
        precision: 0,
      }),
    ).toThrow(RangeError);
  });
  it('throws a RangeError when the amount is a float', () => {
    expect(() =>
      assertValidMonetaryValue({
        amount: 3.14,
        currency: 'EUR',
        precision: 0,
      }),
    ).toThrow(RangeError);
  });
  it('throws a RangeError when the amount is NaN', () => {
    expect(() =>
      assertValidMonetaryValue({
        amount: NaN,
        currency: 'EUR',
        precision: 0,
      }),
    ).toThrow(RangeError);
  });
});

describe('assertSameCurrency()', () => {
  it('returns when provided random valid monetary values with the same currency', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) =>
        expect(assertSameCurrency(mv1, mv2)).toBeUndefined(),
      ),
    );
  });
  it('returns when the currencies are equal', () => {
    expect(
      assertSameCurrency(
        { amount: 314, currency: 'EUR', precision: -42 },
        { amount: 42, currency: 'EUR', precision: 314 },
      ),
    ).toBeUndefined();
  });
  it('throws a TypeError when the currencies are different', () => {
    expect(() =>
      assertSameCurrency(
        { amount: 314, currency: 'EUR', precision: 42 },
        { amount: 42, currency: 'USD', precision: 314 },
      ),
    ).toThrow(TypeError);
  });
});
