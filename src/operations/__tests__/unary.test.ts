import { negate, unsafeNegate, absolute, unsafeAbsolute } from '../unary';

describe('negate()', () => {
  it('returns the same monetary value as unsafeNegate()', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(negate(mv)).toBeIdenticalToMonetaryValue(unsafeNegate(mv));
      }),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(fc.invalidMonetaryValue(), (mv) => {
        expect(() => negate(mv)).toThrow(RangeError);
      }),
    );
  });
});

describe('unsafeNegate()', () => {
  it('returns a monetary value with the same currency', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeNegate(mv)).toHaveProperty('currency', mv.currency);
      }),
    );
  });
  it('returns a monetary value with the same precision', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeNegate(mv)).toHaveProperty('precision', mv.precision);
      }),
    );
  });
  it('returns a monetary value with the opposite amount as the one provided', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeNegate(mv)).toHaveProperty('amount', -mv.amount);
      }),
    );
  });
  it('is an involution', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeNegate(unsafeNegate(mv))).toBeIdenticalToMonetaryValue(mv);
      }),
    );
  });
});

describe('absolute()', () => {
  it('returns the same monetary value as unsafeAbsolute()', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(absolute(mv)).toBeIdenticalToMonetaryValue(unsafeAbsolute(mv));
      }),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(fc.invalidMonetaryValue(), (mv) => {
        expect(() => absolute(mv)).toThrow(RangeError);
      }),
    );
  });
});

describe('unsafeAbsolute()', () => {
  it('returns a monetary value with the same currency', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeAbsolute(mv)).toHaveProperty('currency', mv.currency);
      }),
    );
  });
  it('returns a monetary value with the same precision', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeAbsolute(mv)).toHaveProperty('precision', mv.precision);
      }),
    );
  });
  it('returns a monetary value whose amount is the absolute value of the input one', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeAbsolute(mv)).toHaveProperty(
          'amount',
          Math.abs(mv.amount),
        );
      }),
    );
  });
  it('has the same effect when applied twice as when applied once', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(unsafeAbsolute(unsafeAbsolute(mv))).toBeIdenticalToMonetaryValue(
          unsafeAbsolute(mv),
        );
      }),
    );
  });
});
