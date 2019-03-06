import { toNumber } from '../../coercions';
import { pow10 } from '../../utils/math';
import { unsafeNegate } from '../unary';

import {
  maximum,
  unsafeMaximum,
  minimum,
  unsafeMinimum,
  add,
  unsafeAdd,
  subtract,
  unsafeSubtract,
} from '../binary';

describe('maximum()', () => {
  it('returns the same monetary value as unsafeMaximum()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(maximum(mv1, mv2)).toBeIdenticalToMonetaryValue(
          unsafeMaximum(mv1, mv2),
        );
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => maximum(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => maximum(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeMaximum()', () => {
  it('returns the first monetary value if it is the one with the greatest decimal value', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        if (toNumber(mv1) > toNumber(mv2)) {
          expect(unsafeMaximum(mv1, mv2)).toBe(mv1);
        }
      }),
    );
  });
  it('returns the second monetary value if it is the one with the greatest decimal value', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        if (toNumber(mv1) < toNumber(mv2)) {
          expect(unsafeMaximum(mv1, mv2)).toBe(mv2);
        }
      }),
    );
  });
  it("returns the first monetary value if its decimal value is equal to the second's but its precision is lower", () => {
    fc.assert(
      fc.property(fc.precision(), fc.precision(), (precision1, precision2) => {
        fc.pre(precision1 !== precision2);
        const [minPrecision, maxPrecision] =
          precision1 <= precision2
            ? [precision1, precision2]
            : [precision2, precision1];
        const mv1 = { amount: 1, currency: 'EUR', precision: minPrecision };
        const mv2 = {
          amount: pow10(maxPrecision - minPrecision),
          currency: 'USD',
          precision: maxPrecision,
        };
        expect(unsafeMaximum(mv1, mv2)).toBe(mv1);
      }),
    );
  });
  it("returns the second monetary value if its decimal value is equal to the first's but its precision is lower", () => {
    fc.assert(
      fc.property(fc.precision(), fc.precision(), (precision1, precision2) => {
        fc.pre(precision1 !== precision2);
        const [minPrecision, maxPrecision] =
          precision1 <= precision2
            ? [precision1, precision2]
            : [precision2, precision1];
        const mv1 = {
          amount: pow10(maxPrecision - minPrecision),
          currency: 'EUR',
          precision: maxPrecision,
        };
        const mv2 = { amount: 1, currency: 'USD', precision: minPrecision };
        expect(unsafeMaximum(mv1, mv2)).toBe(mv2);
      }),
    );
  });
  it('is associative', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.monetaryValue(),
        fc.monetaryValue(),
        (mv1, mv2, mv3) => {
          expect(
            unsafeMaximum(unsafeMaximum(mv1, mv2), mv3),
          ).toBeIdenticalToMonetaryValue(
            unsafeMaximum(mv1, unsafeMaximum(mv2, mv3)),
          );
        },
      ),
    );
  });
  it('is commutative, provided that the monetary values have the same currency', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(unsafeMaximum(mv1, mv2)).toBeIdenticalToMonetaryValue(
          unsafeMaximum(mv2, mv1),
        );
      }),
    );
  });
});

describe('minimum()', () => {
  it('returns the same monetary value as unsafeMinimum()', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(minimum(mv1, mv2)).toBeIdenticalToMonetaryValue(
          unsafeMinimum(mv1, mv2),
        );
      }),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => minimum(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => minimum(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeMinimum()', () => {
  it('returns the first monetary value if it is the one with the smallest decimal value', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        if (toNumber(mv1) < toNumber(mv2)) {
          expect(unsafeMinimum(mv1, mv2)).toBe(mv1);
        }
      }),
    );
  });
  it('returns the second monetary value if it is the one with the smallest decimal value', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        if (toNumber(mv1) > toNumber(mv2)) {
          expect(unsafeMinimum(mv1, mv2)).toBe(mv2);
        }
      }),
    );
  });
  it("returns the first monetary value if its decimal value is equal to the second's but its precision is higher", () => {
    fc.assert(
      fc.property(fc.precision(), fc.precision(), (precision1, precision2) => {
        fc.pre(precision1 !== precision2);
        const [minPrecision, maxPrecision] =
          precision1 <= precision2
            ? [precision1, precision2]
            : [precision2, precision1];
        const mv1 = {
          amount: pow10(maxPrecision - minPrecision),
          currency: 'EUR',
          precision: maxPrecision,
        };
        const mv2 = { amount: 1, currency: 'USD', precision: minPrecision };
        expect(unsafeMinimum(mv1, mv2)).toBe(mv1);
      }),
    );
  });
  it("returns the second monetary value if its decimal value is equal to the first's but its precision is higher", () => {
    fc.assert(
      fc.property(fc.precision(), fc.precision(), (precision1, precision2) => {
        fc.pre(precision1 !== precision2);
        const [minPrecision, maxPrecision] =
          precision1 <= precision2
            ? [precision1, precision2]
            : [precision2, precision1];
        const mv1 = { amount: 1, currency: 'EUR', precision: minPrecision };
        const mv2 = {
          amount: pow10(maxPrecision - minPrecision),
          currency: 'USD',
          precision: maxPrecision,
        };
        expect(unsafeMinimum(mv1, mv2)).toBe(mv2);
      }),
    );
  });
  it('is associative', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.monetaryValue(),
        fc.monetaryValue(),
        (mv1, mv2, mv3) => {
          expect(
            unsafeMinimum(unsafeMinimum(mv1, mv2), mv3),
          ).toBeIdenticalToMonetaryValue(
            unsafeMinimum(mv1, unsafeMinimum(mv2, mv3)),
          );
        },
      ),
    );
  });
  it('is commutative, provided that the monetary values have the same currency', () => {
    fc.assert(
      fc.property(fc.pairOfMonetaryValuesWithSameCurrency(), ([mv1, mv2]) => {
        expect(unsafeMinimum(mv1, mv2)).toBeIdenticalToMonetaryValue(
          unsafeMinimum(mv2, mv1),
        );
      }),
    );
  });
});

describe('add()', () => {
  it('returns the same monetary value as unsafeAdd()', () => {
    fc.assert(
      fc.property(
        fc.pairOfSmallMonetaryValuesWithSameCurrency(),
        ([mv1, mv2]) => {
          expect(add(mv1, mv2)).toBeIdenticalToMonetaryValue(
            unsafeAdd(mv1, mv2),
          );
        },
      ),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => add(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => add(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeAdd()', () => {
  it('returns a monetary value whose precision is the highest of the two provided', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        expect(unsafeAdd(mv1, mv2)).toHaveProperty(
          'precision',
          Math.max(mv1.precision, mv2.precision),
        );
      }),
    );
  });
  it('returns a monetary value whose currency is the first of the two provided', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        expect(unsafeAdd(mv1, mv2)).toHaveProperty('currency', mv1.currency);
      }),
    );
  });
  it('returns a monetary value whose decimal value is the sum of the decimal values of the provided monetary values', () => {
    expect(
      unsafeAdd(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: -4200, currency: 'USD', precision: 4 },
      ),
    ).toBeIdenticalToMonetaryValue({
      amount: 27200,
      currency: 'EUR',
      precision: 4,
    });
  });
  it('is associative', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.smallMonetaryValue(),
        fc.smallMonetaryValue(),
        (mv1, mv2, mv3) => {
          expect(
            unsafeAdd(unsafeAdd(mv1, mv2), mv3),
          ).toBeIdenticalToMonetaryValue(unsafeAdd(mv1, unsafeAdd(mv2, mv3)));
        },
      ),
    );
  });
  it('is commutative, provided that the monetary values have the same currency', () => {
    fc.assert(
      fc.property(
        fc.pairOfSmallMonetaryValuesWithSameCurrency(),
        ([mv1, mv2]) => {
          expect(unsafeAdd(mv1, mv2)).toBeIdenticalToMonetaryValue(
            unsafeAdd(mv2, mv1),
          );
        },
      ),
    );
  });
});

describe('subtract()', () => {
  it('returns the same monetary value as unsafeSubtract()', () => {
    fc.assert(
      fc.property(
        fc.pairOfSmallMonetaryValuesWithSameCurrency(),
        ([mv1, mv2]) => {
          expect(subtract(mv1, mv2)).toBeIdenticalToMonetaryValue(
            unsafeSubtract(mv1, mv2),
          );
        },
      ),
    );
  });
  it('throws a RangeError when any of the provided monetary values are invalid', () => {
    fc.assert(
      fc.property(
        fc.pairOfMonetaryValuesWithTheSameCurrencyAndAnyInvalid(),
        ([mv1, mv2]) => {
          expect(() => subtract(mv1, mv2)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a TypeError when the monetary values have different currencies', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        fc.pre(mv1.currency !== mv2.currency);
        expect(() => subtract(mv1, mv2)).toThrow(TypeError);
      }),
    );
  });
});

describe('unsafeSubtract()', () => {
  it('returns a monetary value whose precision is the highest of the two provided', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        expect(unsafeSubtract(mv1, mv2)).toHaveProperty(
          'precision',
          Math.max(mv1.precision, mv2.precision),
        );
      }),
    );
  });
  it('returns a monetary value whose currency is the first of the two provided', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), fc.monetaryValue(), (mv1, mv2) => {
        expect(unsafeSubtract(mv1, mv2)).toHaveProperty(
          'currency',
          mv1.currency,
        );
      }),
    );
  });
  it('returns a monetary value whose decimal value is the difference of the decimal values of the provided monetary values', () => {
    expect(
      unsafeSubtract(
        { amount: 314, currency: 'EUR', precision: 2 },
        { amount: -4200, currency: 'USD', precision: 4 },
      ),
    ).toBeIdenticalToMonetaryValue({
      amount: 35600,
      precision: 4,
      currency: 'EUR',
    });
  });
  it('is equivalent with adding the first monetary value to the negation of the second', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.smallMonetaryValue(),
        (mv1, mv2) => {
          expect(unsafeSubtract(mv1, mv2)).toBeIdenticalToMonetaryValue(
            unsafeAdd(mv1, unsafeNegate(mv2)),
          );
        },
      ),
    );
  });
  it('is anticommutative, provided that the monetary values have the same currency', () => {
    fc.assert(
      fc.property(
        fc.pairOfSmallMonetaryValuesWithSameCurrency(),
        ([mv1, mv2]) => {
          expect(unsafeSubtract(mv1, mv2)).toBeIdenticalToMonetaryValue(
            unsafeNegate(unsafeSubtract(mv2, mv1)),
          );
        },
      ),
    );
  });
});
