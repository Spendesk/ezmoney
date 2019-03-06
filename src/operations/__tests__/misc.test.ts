import { sum, pow10, allocate as numberAllocate } from '../../utils/math';
import { unsafeAdd } from '../binary';

import {
  integerDivide,
  unsafeIntegerDivide,
  multiply,
  unsafeMultiply,
  divide,
  unsafeDivide,
  allocate,
  unsafeAllocate,
} from '../misc';

describe('multiply()', () => {
  it('returns the same monetary value as unsafeMultiply()', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.integer(-1e5, 1e5),
        fc.precision(4),
        (mv, factor, factorPrecision) => {
          fc.pre(factor !== 0);
          expect(
            multiply(mv, factor, factorPrecision),
          ).toBeIdenticalToMonetaryValue(
            unsafeMultiply(mv, factor, factorPrecision),
          );
        },
      ),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(
        fc.invalidMonetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, factor, factorPrecision) => {
          expect(() => multiply(mv, factor, factorPrecision)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
  it('throws a RangeError when the factor is an unsafe integer', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.unsafeInteger(),
        fc.precision(),
        (mv, factor, factorPrecision) => {
          expect(() => multiply(mv, factor, factorPrecision)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
  it("throws a RangeError when the factor's precision is invalid", () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.invalidPrecision(),
        (mv, factor, factorPrecision) => {
          expect(() => multiply(mv, factor, factorPrecision)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
});

describe('unsafeMultiply()', () => {
  it('returns a monetary value with the same currency', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, factor, factorPrecision) => {
          expect(unsafeMultiply(mv, factor, factorPrecision)).toHaveProperty(
            'currency',
            mv.currency,
          );
        },
      ),
    );
  });
  it('returns a monetary value with the same precision', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, factor, factorPrecision) => {
          expect(unsafeMultiply(mv, factor, factorPrecision)).toHaveProperty(
            'precision',
            mv.precision,
          );
        },
      ),
    );
  });
  it('uses the rounding function', () => {
    const mockRoundingFunction = jest.fn(() => NaN);
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, factor, factorPrecision) => {
          expect(
            unsafeMultiply(mv, factor, factorPrecision, mockRoundingFunction),
          ).toHaveProperty('amount', NaN);
          expect(mockRoundingFunction).toHaveBeenCalledTimes(1);
          mockRoundingFunction.mockClear();
        },
      ),
    );
  });
  it('returns a monetary value whose amount is the product of the provided amount and the provided decimal factor', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.integer(-1e5, 1e5),
        fc.precision(4),
        (mv, factor, factorPrecision) => {
          expect(
            unsafeMultiply(
              mv,
              factor,
              factorPrecision,
              (wholePart) => wholePart,
            ),
          ).toHaveProperty(
            'amount',
            Math.floor((mv.amount * factor) / pow10(factorPrecision)),
          );
        },
      ),
    );
  });
  it('distributes a sum of factors onto a sum of monetary values', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.integer(-1e5, 1e5),
        fc.integer(-1e5, 1e5),
        (mv, factor1, factor2) => {
          expect(
            unsafeMultiply(mv, factor1 + factor2, 0),
          ).toBeIdenticalToMonetaryValue(
            unsafeAdd(
              unsafeMultiply(mv, factor1, 0),
              unsafeMultiply(mv, factor2, 0),
            ),
          );
        },
      ),
    );
  });
});

describe('integerDivide()', () => {
  it('returns the same monetary value as unsafeIntegerDivide()', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.integer(), (mv, divider) => {
        fc.pre(divider !== 0);
        expect(integerDivide(mv, divider)).toBeIdenticalToMonetaryValue(
          unsafeIntegerDivide(mv, divider),
        );
      }),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(fc.invalidMonetaryValue(), fc.integer(), (mv, divider) => {
        fc.pre(divider !== 0);
        expect(() => integerDivide(mv, divider)).toThrow(RangeError);
      }),
    );
  });
  it('throws a RangeError when the divider is an unsafe integer', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.unsafeInteger(), (mv, divider) => {
        expect(() => integerDivide(mv, divider)).toThrow(RangeError);
      }),
    );
  });
  it('throws a RangeError when the divider is zero', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(() => integerDivide(mv, 0)).toThrow(RangeError);
        expect(() => integerDivide(mv, -0)).toThrow(RangeError);
      }),
    );
  });
});

describe('unsafeIntegerDivide()', () => {
  it('returns a monetary value with the same currency', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.integer(), (mv, divider) => {
        fc.pre(divider !== 0);
        expect(unsafeIntegerDivide(mv, divider)).toHaveProperty(
          'currency',
          mv.currency,
        );
      }),
    );
  });
  it('returns a monetary value with the same precision', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.integer(), (mv, divider) => {
        fc.pre(divider !== 0);
        expect(unsafeIntegerDivide(mv, divider)).toHaveProperty(
          'precision',
          mv.precision,
        );
      }),
    );
  });
  it('uses the rounding function', () => {
    const mockRoundingFunction = jest.fn(() => NaN);
    fc.assert(
      fc.property(fc.monetaryValue(), fc.integer(), (mv, divider) => {
        fc.pre(divider !== 0);
        expect(
          unsafeIntegerDivide(mv, divider, mockRoundingFunction),
        ).toHaveProperty('amount', NaN);
        expect(mockRoundingFunction).toHaveBeenCalledTimes(1);
        mockRoundingFunction.mockClear();
      }),
    );
  });
  it('returns a monetary value whose amount is the quotient of the provided amount and the provided divider', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.integer(), (mv, divider) => {
        fc.pre(divider !== 0);
        expect(
          unsafeIntegerDivide(mv, divider, (wholePart) => wholePart),
        ).toHaveProperty('amount', Math.floor(mv.amount / divider));
      }),
    );
  });
});

describe('divide()', () => {
  it('returns the same monetary value as unsafeDivide()', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.integer(-1e5, 1e5),
        fc.precision(4),
        (mv, divider, dividerPrecision) => {
          fc.pre(divider !== 0);
          expect(
            divide(mv, divider, dividerPrecision),
          ).toBeIdenticalToMonetaryValue(
            unsafeDivide(mv, divider, dividerPrecision),
          );
        },
      ),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(
        fc.invalidMonetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, divider, dividerPrecision) => {
          fc.pre(divider !== 0);
          expect(() => divide(mv, divider, dividerPrecision)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
  it('throws a RangeError when the divider is an unsafe integer', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.unsafeInteger(),
        fc.precision(),
        (mv, divider, dividerPrecision) => {
          expect(() => divide(mv, divider, dividerPrecision)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
  it("throws a RangeError when the divider's precision is invalid", () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.invalidPrecision(),
        (mv, divider, dividerPrecision) => {
          fc.pre(divider !== 0);
          expect(() => divide(mv, divider, dividerPrecision)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
  it('throws a RangeError when the divider is zero', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.precision(),
        (mv, dividerPrecision) => {
          expect(() => divide(mv, 0, dividerPrecision)).toThrow(RangeError);
          expect(() => divide(mv, -0, dividerPrecision)).toThrow(RangeError);
        },
      ),
    );
  });
});

describe('unsafeDivide()', () => {
  it('returns a monetary value with the same currency', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, divider, dividerPrecision) => {
          fc.pre(divider !== 0);
          expect(unsafeDivide(mv, divider, dividerPrecision)).toHaveProperty(
            'currency',
            mv.currency,
          );
        },
      ),
    );
  });
  it('returns a monetary value with the same precision', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, divider, dividerPrecision) => {
          fc.pre(divider !== 0);
          expect(unsafeDivide(mv, divider, dividerPrecision)).toHaveProperty(
            'precision',
            mv.precision,
          );
        },
      ),
    );
  });
  it('uses the rounding function', () => {
    const mockRoundingFunction = jest.fn(() => NaN);
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, divider, dividerPrecision) => {
          fc.pre(divider !== 0);
          expect(
            unsafeDivide(mv, divider, dividerPrecision, mockRoundingFunction),
          ).toHaveProperty('amount', NaN);
          expect(mockRoundingFunction).toHaveBeenCalledTimes(1);
          mockRoundingFunction.mockClear();
        },
      ),
    );
  });
  it('is equivalent to an integer division when the precision of the divider is zero', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.integer(), (mv, divider) => {
        fc.pre(divider !== 0);
        expect(unsafeDivide(mv, divider, 0)).toBeIdenticalToMonetaryValue(
          unsafeIntegerDivide(mv, divider),
        );
      }),
    );
  });
  it('returns a monetary value whose amount is the division of the provided amount by the provided decimal divider', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.integer(),
        fc.precision(),
        (mv, divider, dividerPrecision) => {
          fc.pre(divider !== 0);
          expect(
            unsafeDivide(
              mv,
              divider,
              dividerPrecision,
              (wholePart) => wholePart,
            ),
          ).toHaveProperty(
            'amount',
            Math.floor((mv.amount * pow10(dividerPrecision)) / divider),
          );
        },
      ),
    );
  });
});

describe('allocate()', () => {
  it('returns the same array of monetary values as unsafeAllocate()', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.array(fc.integer(1e8)),
        (mv, weights) => {
          // May need to negate all the weights so that the sum of weights becomes positive.
          const total = sum(weights);
          fc.pre(total !== 0);
          const weightsWithPositiveSum =
            total < 0 ? weights.map((w) => -w) : weights;
          expect(allocate(mv, weightsWithPositiveSum)).toEqual(
            unsafeAllocate(mv, weightsWithPositiveSum),
          );
        },
      ),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(
        fc.invalidMonetaryValue(),
        fc.array(fc.integer(1e8)),
        (mv, weights) => {
          expect(() => allocate(mv, weights)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a RangeError when the sum of the weights is zero', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.array(fc.integer(1e8)),
        (mv, weights) => {
          // Might need to adjust the weights so that the sum of weights becomes zero.
          const total = sum(weights);
          const adjustedWeights = total !== 0 ? [...weights, -total] : weights;
          expect(() => allocate(mv, adjustedWeights)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a RangeError when the sum of the weights is strictly negative', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.array(fc.integer(1e8)),
        (mv, weights) => {
          // May need to negate all the weights so that the sum of weights becomes negative.
          const total = sum(weights);
          fc.pre(total !== 0);
          const weightsWithNegativeSum =
            total > 0 ? weights.map((w) => -w) : weights;
          expect(() => allocate(mv, weightsWithNegativeSum)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
});

describe('unsafeAllocate()', () => {
  it('returns an array of monetary values that all have the currency of the provided monetary value', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.array(fc.integer(1e8)),
        (mv, weights) => {
          for (const part of unsafeAllocate(mv, weights)) {
            expect(part).toHaveProperty('currency', mv.currency);
          }
        },
      ),
    );
  });
  it('returns an array of monetary values that all have the precision of the provided monetary value', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.array(fc.integer(1e8)),
        (mv, weights) => {
          for (const part of unsafeAllocate(mv, weights)) {
            expect(part).toHaveProperty('precision', mv.precision);
          }
        },
      ),
    );
  });
  it('returns an array of monetary values whose sum is the provided monetary value', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.array(fc.integer(1e4), 1, 100),
        (mv, weights) => {
          // When the sum of the weights is zero, the amounts are null,
          // which causes the matcher to fail
          fc.pre(sum(weights) !== 0);
          expect(
            unsafeAllocate(mv, weights).reduce(unsafeAdd),
          ).toBeIdenticalToMonetaryValue(mv);
        },
      ),
    );
  });
  it('allocates the amount using a 1-dimension Bresenham algorithm', () => {
    // Testing the implementation because its behavior is directly observable by the caller
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.array(fc.integer(1e8)),
        (mv, weights) => {
          expect(
            unsafeAllocate(mv, weights).map((part) => part.amount),
          ).toEqual(numberAllocate(mv.amount, weights, sum(weights)));
        },
      ),
    );
  });
});
