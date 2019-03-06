import { create, unsafeCreate, isMonetaryValue } from '../monetary-value';

describe('isMonetaryValue()', () => {
  it('returns true when the provided monetary value is valid', () => {
    fc.assert(
      fc.property(fc.monetaryValue(), (mv) => {
        expect(isMonetaryValue(mv)).toBe(true);
      }),
    );
  });
  it('returns false when the provided monetary value is invalid', () => {
    fc.assert(
      fc.property(fc.invalidMonetaryValue(), (mv) => {
        expect(isMonetaryValue(mv)).toBe(false);
      }),
    );
  });
  it('returns false when the provided object does not have the shape of a monetary value', () => {
    const arbitraryObjectWithoutMonetaryValueFields = fc
      .object()
      .filter(
        (obj) => !('amount' in obj && 'currency' in obj && 'precision' in obj),
      );
    const arbitraryMonetaryValueWithWrongTypes = fc
      .record({
        amount: fc.anything(),
        currency: fc.anything(),
        precision: fc.anything(),
      })
      .filter(
        ({ amount, currency, precision }) =>
          !(
            typeof amount === 'number' &&
            typeof currency === 'string' &&
            typeof precision === 'number'
          ),
      );
    fc.assert(
      fc.property(
        fc.oneof(
          arbitraryMonetaryValueWithWrongTypes,
          arbitraryObjectWithoutMonetaryValueFields,
        ),
        (object) => {
          expect(isMonetaryValue(object)).toBe(false);
        },
      ),
    );
  });
});

describe('create()', () => {
  it('returns the same value as unsafeCreate()', () => {
    fc.assert(
      fc.property(
        fc.amount(),
        fc.currency(),
        fc.oneof(fc.precision(), fc.constant(undefined)),
        (amount, currency, precision) => {
          expect(
            create(amount, currency, precision),
          ).toBeIdenticalToMonetaryValue(
            unsafeCreate(amount, currency, precision),
          );
        },
      ),
    );
  });
  it('throw when the precision is invalid', () => {
    fc.assert(
      fc.property(
        fc.amount(),
        fc.currency(),
        fc.invalidPrecision(),
        (amount, currency, precision) => {
          expect(() => create(amount, currency, precision)).toThrow(RangeError);
        },
      ),
    );
  });
  it('throw when the amount is invalid', () => {
    fc.assert(
      fc.property(
        fc.invalidAmount(),
        fc.currency(),
        fc.precision(),
        (amount, currency, precision) => {
          expect(() => create(amount, currency, precision)).toThrow(RangeError);
        },
      ),
    );
  });
});

describe('unsafeCreate()', () => {
  it('returns a monetary value with the provided amount, currency and precision', () => {
    fc.assert(
      fc.property(
        fc.amount(),
        fc.currency(),
        fc.precision(),
        (amount, currency, precision) => {
          expect(
            unsafeCreate(amount, currency, precision),
          ).toBeIdenticalToMonetaryValue({
            amount,
            currency,
            precision,
          });
        },
      ),
    );
  });
  it('returns a monetary value with the provided amount and currency, setting the precision to zero when it is not provided', () => {
    fc.assert(
      fc.property(fc.amount(), fc.currency(), (amount, currency) => {
        expect(unsafeCreate(amount, currency)).toBeIdenticalToMonetaryValue({
          amount,
          currency,
          precision: 0,
        });
      }),
    );
  });
});
