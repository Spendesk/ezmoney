import {
  unsafeMatchPrecision,
  unsafeSetPrecision,
  matchPrecision,
  setPrecision,
} from '../precision';
import { roundAwayFromZero } from '../roundings';

describe('matchPrecision()', () => {
  it('returns the same value as unsafeMatchPrecision()', () => {
    fc.assert(
      fc.property(fc.smallMonetaryValue(), fc.precision(4), (mv, precision) => {
        expect(matchPrecision(mv, precision)).toBeIdenticalToMonetaryValue(
          unsafeMatchPrecision(mv, precision),
        );
      }),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(
        fc.invalidMonetaryValue(),
        fc.precision(),
        (mv, precision) => {
          expect(() => matchPrecision(mv, precision)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throws a RangeError when the precision is not valid', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.invalidPrecision(),
        (mv, precision) => {
          expect(() => matchPrecision(mv, precision)).toThrow(RangeError);
        },
      ),
    );
  });
});

describe('unsafeMatchPrecision()', () => {
  it('returns an identical monetary value when provided the same precision', () => {
    expect(
      unsafeMatchPrecision({ amount: 314, currency: 'EUR', precision: 2 }, 2),
    ).toBeIdenticalToMonetaryValue({
      amount: 314,
      currency: 'EUR',
      precision: 2,
    });
  });
  it('returns an identical monetary value when provided a lower precision', () => {
    expect(
      unsafeMatchPrecision({ amount: 314, currency: 'EUR', precision: 2 }, 1),
    ).toBeIdenticalToMonetaryValue({
      amount: 314,
      currency: 'EUR',
      precision: 2,
    });
  });
  it('returns an equivalent monetary value when provided a higher precision, with the set precision', () => {
    expect(
      unsafeMatchPrecision({ amount: 314, currency: 'EUR', precision: 2 }, 3),
    ).toBeIdenticalToMonetaryValue({
      amount: 3140,
      currency: 'EUR',
      precision: 3,
    });
  });
});

describe('setPrecision()', () => {
  it('returns the same value as unsafeSetPrecision()', () => {
    fc.assert(
      fc.property(
        fc.smallMonetaryValue(),
        fc.precision(4),
        fc.oneof(fc.roundingFunction(), fc.constant(undefined)),
        (mv, precision, roundingFunction) => {
          expect(
            setPrecision(mv, precision, roundingFunction),
          ).toBeIdenticalToMonetaryValue(
            unsafeSetPrecision(mv, precision, roundingFunction),
          );
        },
      ),
    );
  });
  it('throws a RangeError when the monetary value is not valid', () => {
    fc.assert(
      fc.property(
        fc.invalidMonetaryValue(),
        fc.precision(),
        fc.oneof(fc.roundingFunction(), fc.constant(undefined)),
        (mv, precision, roundingFunction) => {
          expect(() => setPrecision(mv, precision, roundingFunction)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
  it('throws a RangeError when the precision is not valid', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue(),
        fc.invalidPrecision(),
        fc.oneof(fc.roundingFunction(), fc.constant(undefined)),
        (mv, precision, roundingFunction) => {
          expect(() => setPrecision(mv, precision, roundingFunction)).toThrow(
            RangeError,
          );
        },
      ),
    );
  });
});

describe('unsafeSetPrecision()', () => {
  it('returns an identical monetary value when provided the same precision', () => {
    expect(
      unsafeSetPrecision({ amount: 314, currency: 'EUR', precision: 2 }, 2),
    ).toBeIdenticalToMonetaryValue({
      amount: 314,
      currency: 'EUR',
      precision: 2,
    });
  });
  it('returns a monetary value with a matching amount up to the relevant digit when provided a lower precision', () => {
    expect(
      unsafeSetPrecision({ amount: 314, currency: 'EUR', precision: 2 }, 1),
    ).toBeIdenticalToMonetaryValue({
      amount: 31,
      currency: 'EUR',
      precision: 1,
    });
  });
  it('returns a monetary value with a matching amount up to the relevant digit, rounded according to the provided rounding function, when provided a lower precision', () => {
    expect(
      unsafeSetPrecision(
        { amount: 314, currency: 'EUR', precision: 2 },
        1,
        roundAwayFromZero,
      ),
    ).toBeIdenticalToMonetaryValue({
      amount: 32,
      currency: 'EUR',
      precision: 1,
    });
  });
  it('returns an equivalent monetary value when provided a higher precision, with the set precision', () => {
    expect(
      unsafeSetPrecision({ amount: 314, currency: 'EUR', precision: 2 }, 3),
    ).toBeIdenticalToMonetaryValue({
      amount: 3140,
      currency: 'EUR',
      precision: 3,
    });
  });
});
