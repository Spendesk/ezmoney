import {
  Comparison,
  identical,
  unsafeIdentical,
  equivalent,
  unsafeEquivalent,
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
} from '../comparisons';

describe('Comparison', () => {
  describe('.LT', () => {
    it('is equal to -1', () => {
      expect(Comparison.LT).toBe(-1);
    });
  });
  describe('.EQ', () => {
    it('is equal to 0', () => {
      expect(Comparison.EQ).toBe(0);
    });
  });
  describe('.GT', () => {
    it('is equal to 1', () => {
      expect(Comparison.GT).toBe(1);
    });
  });
});

describe('identical()', () => {
  it('returns the same result as unsafeIdentical()', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        expect(identical(mv1, mv2)).toBe(unsafeIdentical(mv1, mv2));
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.tuple(fc.invalidMonetaryValue(), fc.monetaryValue()),
          fc.tuple(fc.monetaryValue(), fc.invalidMonetaryValue()),
          fc.tuple(fc.invalidMonetaryValue(), fc.invalidMonetaryValue()),
        ),
        ([mv1, mv2]) => {
          expect(() => identical(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
});

describe('unsafeIdentical()', () => {
  it('returns true when the monetary values have the same amount, the same currency and the same precision', () => {
    expect(
      unsafeIdentical(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 314, currency: 'EUR', precision: 2 },
      ),
    ).toBe(true);
  });
  it('treats 0 and -0 as the same value', () => {
    expect(
      unsafeIdentical(
        { amount: 0, currency: 'EUR', precision: 2 },
        { amount: -0, currency: 'EUR', precision: 2 },
      ),
    ).toBe(true);
    expect(
      unsafeIdentical(
        { amount: 314, currency: 'EUR', precision: 0 },
        { amount: 314, currency: 'EUR', precision: -0 },
      ),
    ).toBe(true);
  });
  it('returns false when the monetary values have a different amount and a different precision, even though they hold the same decimal value and have the same currency', () => {
    expect(
      unsafeIdentical(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 31400, currency: 'EUR', precision: 4 },
      ),
    ).toBe(false);
  });
  it('returns false when the monetary values have a different amount', () => {
    expect(
      unsafeIdentical(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 42, currency: 'EUR', precision: 2 },
      ),
    ).toBe(false);
  });
  it('returns false when the monetary values have a different currency', () => {
    expect(
      unsafeIdentical(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(false);
  });
  it('returns false when the monetary values have a different precision', () => {
    expect(
      unsafeIdentical(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 314, currency: 'EUR', precision: 4 },
      ),
    ).toBe(false);
  });
});

describe('equivalent()', () => {
  it('returns the same result as unsafeEquivalent()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(equivalent(mv1, mv2)).toBe(unsafeEquivalent(mv1, mv2));
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.tuple(fc.invalidMonetaryValue(), fc.monetaryValue()),
          fc.tuple(fc.monetaryValue(), fc.invalidMonetaryValue()),
          fc.tuple(fc.invalidMonetaryValue(), fc.invalidMonetaryValue()),
        ),
        ([mv1, mv2]) => {
          expect(() => equivalent(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
});

describe('unsafeEquivalent()', () => {
  it('returns true when the monetary values have the same amount, the same currency and the same precision', () => {
    expect(
      unsafeEquivalent(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 314, currency: 'EUR', precision: 2 },
      ),
    ).toBe(true);
  });
  it('returns true when the monetary values hold the same decimal value and have the same currency, even though they have a different precision and a different amount', () => {
    expect(
      unsafeEquivalent(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 31400, currency: 'EUR', precision: 4 },
      ),
    ).toBe(true);
  });
  it('returns false when the monetary values have a different currency, even though they have the same amount and the same precision', () => {
    expect(
      unsafeEquivalent(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(false);
  });
});

describe('equal()', () => {
  it('returns the same result as unsafeEqual()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(equal(mv1, mv2)).toBe(unsafeEqual(mv1, mv2));
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => equal(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => equal(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeEqual()', () => {
  it('returns true when the monetary values have the same amount and the same precision, regardless of the currency', () => {
    expect(
      unsafeEqual(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(true);
  });
  it('treats 0 and -0 as the same value', () => {
    expect(
      unsafeEqual(
        { amount: 0, currency: 'EUR', precision: 2 },
        { amount: -0, currency: 'USD', precision: 2 },
      ),
    ).toBe(true);
    expect(
      unsafeEqual(
        { amount: 314, currency: 'EUR', precision: 0 },
        { amount: 314, currency: 'USD', precision: -0 },
      ),
    ).toBe(true);
  });
  it('returns true when the monetary values hold the same decimal value, even though they have a different amount and a different precision', () => {
    expect(
      unsafeEqual(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 31400, currency: 'USD', precision: 4 },
      ),
    ).toBe(true);
  });
  it('returns false when the monetary values do not hold the same decimal value', () => {
    expect(
      unsafeEqual(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: 31400, currency: 'USD', precision: 2 },
      ),
    ).toBe(false);
  });
});

describe('compare()', () => {
  it('returns the same result as unsafeCompare()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(compare(mv1, mv2)).toBe(unsafeCompare(mv1, mv2));
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => compare(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => compare(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeCompare()', () => {
  it('returns -1 when the first monetary value holds a decimal value smaller than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeCompare(
        { amount: 4200, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(-1);
  });
  it('returns zero when the monetary values hold the same decimal value, regardless of the currency', () => {
    expect(
      unsafeCompare(
        { amount: 31400, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(0);
  });
  it('returns 1 when the first monetary value holds a decimal value larger than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeCompare(
        { amount: 314, currency: 'USD', precision: 2 },
        { amount: 4200, currency: 'EUR', precision: 4 },
      ),
    ).toBe(1);
  });
});

describe('lessThan()', () => {
  it('returns the same result as unsafeLessThan()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(lessThan(mv1, mv2)).toBe(unsafeLessThan(mv1, mv2));
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => lessThan(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => lessThan(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeLessThan()', () => {
  it('returns true when the first monetary value holds a decimal value smaller than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeLessThan(
        { amount: 4200, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(true);
  });
  it('returns false when the monetary values hold the same decimal value, regardless of the currency', () => {
    expect(
      unsafeLessThan(
        { amount: 31400, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(false);
  });
  it('returns false when the first monetary value holds a decimal value larger than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeLessThan(
        { amount: 314, currency: 'USD', precision: 2 },
        { amount: 4200, currency: 'EUR', precision: 4 },
      ),
    ).toBe(false);
  });
});

describe('lessThanOrEqual()', () => {
  it('returns the same result as unsafeLessThanOrEqual()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(lessThanOrEqual(mv1, mv2)).toBe(unsafeLessThanOrEqual(mv1, mv2));
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => lessThanOrEqual(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => lessThanOrEqual(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeLessThanOrEqual()', () => {
  it('returns true when the first monetary value holds a decimal value smaller than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeLessThanOrEqual(
        { amount: 4200, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(true);
  });
  it('returns true when the monetary values hold the same decimal value, regardless of the currency', () => {
    expect(
      unsafeLessThanOrEqual(
        { amount: 31400, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(true);
  });
  it('returns false when the first monetary value holds a decimal value larger than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeLessThanOrEqual(
        { amount: 314, currency: 'USD', precision: 2 },
        { amount: 4200, currency: 'EUR', precision: 4 },
      ),
    ).toBe(false);
  });
});

describe('greaterThan()', () => {
  it('returns the same result as unsafeGreaterThan()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(greaterThan(mv1, mv2)).toBe(unsafeGreaterThan(mv1, mv2));
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => greaterThan(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => greaterThan(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeGreaterThan()', () => {
  it('returns false when the first monetary value holds a decimal value smaller than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeGreaterThan(
        { amount: 4200, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(false);
  });
  it('returns false when the monetary values hold the same decimal value, regardless of the currency', () => {
    expect(
      unsafeGreaterThan(
        { amount: 31400, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(false);
  });
  it('returns true when the first monetary value holds a decimal value larger than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeGreaterThan(
        { amount: 314, currency: 'USD', precision: 2 },
        { amount: 4200, currency: 'EUR', precision: 4 },
      ),
    ).toBe(true);
  });
});

describe('greaterThanOrEqual()', () => {
  it('returns the same result as unsafeGreaterThanOrEqual()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(greaterThanOrEqual(mv1, mv2)).toBe(
          unsafeGreaterThanOrEqual(mv1, mv2),
        );
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => greaterThanOrEqual(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => greaterThanOrEqual(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeGreaterThanOrEqual()', () => {
  it('returns false when the first monetary value holds a decimal value smaller than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeGreaterThanOrEqual(
        { amount: 4200, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(false);
  });
  it('returns true when the monetary values hold the same decimal value, regardless of the currency', () => {
    expect(
      unsafeGreaterThanOrEqual(
        { amount: 31400, currency: 'EUR', precision: 4 },
        { amount: 314, currency: 'USD', precision: 2 },
      ),
    ).toBe(true);
  });
  it('returns true when the first monetary value holds a decimal value larger than the second monetary value, regardless of the currency', () => {
    expect(
      unsafeGreaterThanOrEqual(
        { amount: 314, currency: 'USD', precision: 2 },
        { amount: 4200, currency: 'EUR', precision: 4 },
      ),
    ).toBe(true);
  });
});
