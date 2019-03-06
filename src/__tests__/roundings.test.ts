import {
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
} from '../roundings';

describe('roundDown()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundDown(1, 0, 314)).toBe(1);
    expect(roundDown(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive', () => {
    expect(roundDown(1, 42, 314)).toBe(1);
  });
  it('returns the whole part minus 1 when it is strictly negative', () => {
    expect(roundDown(-1, -42, 314)).toBe(-2);
  });
});

describe('roundUp()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundUp(1, 0, 314)).toBe(1);
    expect(roundUp(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part plus 1 when it is strictly positive', () => {
    expect(roundUp(1, 42, 314)).toBe(2);
  });
  it('returns the whole part when it is strictly negative', () => {
    expect(roundUp(-1, -42, 314)).toBe(-1);
  });
});

describe('roundTowardsZero()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundTowardsZero(1, 0, 314)).toBe(1);
    expect(roundTowardsZero(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive', () => {
    expect(roundTowardsZero(1, 42, 314)).toBe(1);
  });
  it('returns the whole part when it is negative', () => {
    expect(roundTowardsZero(-1, -42, 314)).toBe(-1);
  });
});

describe('roundAwayFromZero()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundAwayFromZero(1, 0, 314)).toBe(1);
    expect(roundAwayFromZero(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part plus 1 when it is strictly positive', () => {
    expect(roundAwayFromZero(1, 42, 314)).toBe(2);
  });
  it('returns the whole part minus 1 when it is strictly negative', () => {
    expect(roundAwayFromZero(-1, -42, 314)).toBe(-2);
  });
});

describe('roundHalfUp()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundHalfUp(1, 0, 314)).toBe(1);
    expect(roundHalfUp(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive and the numerator is less than half the denominator', () => {
    expect(roundHalfUp(1, 42, 314)).toBe(1);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfUp(1, 157, 314)).toBe(2);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is more than half the denominator', () => {
    expect(roundHalfUp(1, 272, 314)).toBe(2);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is less than half the denominator', () => {
    expect(roundHalfUp(-1, -42, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfUp(-1, -157, 314)).toBe(-1);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is more than half the denominator', () => {
    expect(roundHalfUp(-1, -272, 314)).toBe(-2);
  });
});

describe('roundHalfDown()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundHalfDown(1, 0, 314)).toBe(1);
    expect(roundHalfDown(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive and the numerator is less than half the denominator', () => {
    expect(roundHalfDown(1, 42, 314)).toBe(1);
  });
  it('returns the whole part when it is strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfDown(1, 157, 314)).toBe(1);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is more than half the denominator', () => {
    expect(roundHalfDown(1, 272, 314)).toBe(2);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is less than half the denominator', () => {
    expect(roundHalfDown(-1, -42, 314)).toBe(-1);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfDown(-1, -157, 314)).toBe(-2);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is more than half the denominator', () => {
    expect(roundHalfDown(-1, -272, 314)).toBe(-2);
  });
});

describe('roundHalfTowardsZero()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundHalfTowardsZero(1, 0, 314)).toBe(1);
    expect(roundHalfTowardsZero(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive and the numerator is less than half the denominator', () => {
    expect(roundHalfTowardsZero(1, 42, 314)).toBe(1);
  });
  it('returns the whole part when it is strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfTowardsZero(1, 157, 314)).toBe(1);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is more than half the denominator', () => {
    expect(roundHalfTowardsZero(1, 272, 314)).toBe(2);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is less than half the denominator', () => {
    expect(roundHalfTowardsZero(-1, -42, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfTowardsZero(-1, -157, 314)).toBe(-1);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is more than half the denominator', () => {
    expect(roundHalfTowardsZero(-1, -272, 314)).toBe(-2);
  });
});

describe('roundHalfAwayFromZero()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundHalfAwayFromZero(1, 0, 314)).toBe(1);
    expect(roundHalfAwayFromZero(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive and the numerator is less than half the denominator', () => {
    expect(roundHalfAwayFromZero(1, 42, 314)).toBe(1);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfAwayFromZero(1, 157, 314)).toBe(2);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is more than half the denominator', () => {
    expect(roundHalfAwayFromZero(1, 272, 314)).toBe(2);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is less than half the denominator', () => {
    expect(roundHalfAwayFromZero(-1, -42, 314)).toBe(-1);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfAwayFromZero(-1, -157, 314)).toBe(-2);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is more than half the denominator', () => {
    expect(roundHalfAwayFromZero(-1, -272, 314)).toBe(-2);
  });
});

describe('roundHalfToEven()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundHalfToEven(1, 0, 314)).toBe(1);
    expect(roundHalfToEven(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive and the numerator is less than half the denominator', () => {
    expect(roundHalfToEven(1, 42, 314)).toBe(1);
  });
  it('returns the whole part when it is even and strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfToEven(2, 157, 314)).toBe(2);
  });
  it('returns the whole part plus 1 when it odd and strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfToEven(1, 157, 314)).toBe(2);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is more than half the denominator', () => {
    expect(roundHalfToEven(1, 272, 314)).toBe(2);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is less than half the denominator', () => {
    expect(roundHalfToEven(-1, -42, 314)).toBe(-1);
  });
  it('returns the whole part when it is even and strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfToEven(-2, -157, 314)).toBe(-2);
  });
  it('returns the whole part minus 1 when it is odd and strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfToEven(-1, -157, 314)).toBe(-2);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is more than half the denominator', () => {
    expect(roundHalfToEven(-1, -272, 314)).toBe(-2);
  });
});

describe('roundHalfToOdd()', () => {
  it('returns the whole part when there is no fractional part', () => {
    expect(roundHalfToOdd(1, 0, 314)).toBe(1);
    expect(roundHalfToOdd(-1, 0, 314)).toBe(-1);
  });
  it('returns the whole part when it is strictly positive and the numerator is less than half the denominator', () => {
    expect(roundHalfToOdd(1, 42, 314)).toBe(1);
  });
  it('returns the whole part plus 1 when it is even and strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfToOdd(0, 157, 314)).toBe(1);
  });
  it('returns the whole part when it odd and strictly positive and the numerator is exactly half the denominator', () => {
    expect(roundHalfToOdd(1, 157, 314)).toBe(1);
  });
  it('returns the whole part plus 1 when it is strictly positive and the numerator is more than half the denominator', () => {
    expect(roundHalfToOdd(1, 272, 314)).toBe(2);
  });
  it('returns the whole part when it is strictly negative and the absolute value of the numerator is less than half the denominator', () => {
    expect(roundHalfToOdd(-1, -42, 314)).toBe(-1);
  });
  it('returns the whole part minus 1 when it is even and strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfToOdd(-0, -157, 314)).toBe(-1);
  });
  it('returns the whole part when it is odd and strictly negative and the absolute value of the numerator is exactly half the denominator', () => {
    expect(roundHalfToOdd(-1, -157, 314)).toBe(-1);
  });
  it('returns the whole part minus 1 when it is strictly negative and the absolute value of the numerator is more than half the denominator', () => {
    expect(roundHalfToOdd(-1, -272, 314)).toBe(-2);
  });
});
