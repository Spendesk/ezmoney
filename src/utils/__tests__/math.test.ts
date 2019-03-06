import { min, max, sign, abs, sum, allocate } from '../math';

describe('min()', () => {
  it('returns the smallest of two numbers', () => {
    fc.assert(
      fc.property(fc.number(), fc.number(), (a, b) => {
        expect(min(a, b)).toBe(a <= b ? a : b);
      }),
    );
  });
  it('returns -0 when provided 0 and -0', () => {
    expect(min(-0, 0)).toBe(-0);
    expect(min(0, -0)).toBe(-0);
  });
  it('is associative', () => {
    fc.assert(
      fc.property(fc.number(), fc.number(), fc.number(), (a, b, c) => {
        expect(min(min(a, b), c)).toBe(min(a, min(b, c)));
      }),
    );
  });
  it('is commutative', () => {
    fc.assert(
      fc.property(fc.number(), fc.number(), (a, b) => {
        expect(min(a, b)).toBe(min(b, a));
      }),
    );
  });
});

describe('max()', () => {
  it('returns the smallest of two numbers', () => {
    fc.assert(
      fc.property(fc.number(), fc.number(), (a, b) => {
        expect(max(a, b)).toBe(a >= b ? a : b);
      }),
    );
  });
  it('returns 0 when provided 0 and -0', () => {
    expect(max(-0, 0)).toBe(0);
    expect(max(0, -0)).toBe(0);
  });
  it('is associative', () => {
    fc.assert(
      fc.property(fc.number(), fc.number(), fc.number(), (a, b, c) => {
        expect(max(max(a, b), c)).toBe(max(a, max(b, c)));
      }),
    );
  });
  it('is commutative', () => {
    fc.assert(
      fc.property(fc.number(), fc.number(), (a, b) => {
        expect(max(a, b)).toBe(max(b, a));
      }),
    );
  });
});

describe('sign()', () => {
  it('returns 1 when the number is strictly positive', () => {
    expect(sign(42)).toBe(1);
  });
  it('returns 1 when the number is zero', () => {
    expect(sign(0)).toBe(1);
  });
  it('returns -1 when the number is negative zero', () => {
    expect(sign(-0)).toBe(-1);
  });
  it('returns -1 when the number is strictly negative', () => {
    expect(sign(-42)).toBe(-1);
  });
});

describe('abs()', () => {
  it('returns the number if it is strictly positive', () => {
    expect(abs(42)).toBe(42);
  });
  it('returns 0 when the number is zero', () => {
    expect(abs(0)).toBe(0);
  });
  it('returns 0 when the number is negative zero', () => {
    expect(abs(-0)).toBe(0);
  });
  it('returns the opposite of the number if it is strictly negative', () => {
    expect(abs(-42)).toBe(42);
  });
});

describe('sum()', () => {
  it('returns zero when the provided array is empty', () => {
    expect(sum([])).toBe(0);
  });
  it('returns the sum of the numbers in the provided array', () => {
    expect(sum([1, -2, 3])).toBe(2);
  });
});

describe('allocate()', () => {
  it('returns the provided number in an array when only one weight is provided', () => {
    expect(allocate(314, [42], 42)).toEqual([314]);
  });
  it('returns an array of integers whose sum is the provided integer', () => {
    fc.assert(
      fc.property(fc.integer(), fc.array(fc.integer(1e6)), (n, weights) => {
        fc.pre(sum(weights) !== 0);
        expect(sum(allocate(n, weights, sum(weights)))).toBe(n);
      }),
    );
  });
  it('returns an array that uniformly distributes the provided number to each weight when they all divide it', () => {
    expect(allocate(4, [0.25, 0.75], 1)).toEqual([1, 3]);
  });
  it('returns an array that distributes the provided number to each weight, rounding up progressively so that the sum of the shares is equal to the provided number', () => {
    expect(allocate(5, [0.25, 0.75], 1)).toEqual([1, 4]);
    expect(allocate(5, [0.75, 0.25], 1)).toEqual([3, 2]);
  });
  it('returns an array that distributes the provided number to each weight, using the negative weights to increase the amount that can be allocated', () => {
    expect(allocate(100, [-5, 15], 10)).toEqual([-50, 150]);
  });
});
