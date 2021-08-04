import { diff } from 'jest-diff';
import { MonetaryValue, isMonetaryValue } from '../../monetary-value';
import { unsafeIdentical } from '../../comparisons';

function pickMonetaryValueFields<C extends string>(
  monetaryValue: MonetaryValue<C>,
): MonetaryValue<C> {
  return {
    amount: monetaryValue.amount,
    currency: monetaryValue.currency,
    precision: monetaryValue.precision,
  };
}

export function toBeIdenticalToMonetaryValue(
  this: jest.MatcherUtils,
  actual: unknown,
  expected: unknown,
): jest.CustomMatcherResult {
  if (!isMonetaryValue(actual)) {
    throw new TypeError(
      `Actual value ${JSON.stringify(actual)} is not a monetary value`,
    );
  }
  if (!isMonetaryValue(expected)) {
    throw new TypeError(
      `Expected value ${JSON.stringify(expected)} is not a monetary value`,
    );
  }

  const pass = unsafeIdentical(actual, expected);

  const message = pass
    ? () =>
        this.utils.matcherHint('toBeIdenticalToMonetaryValue') +
        '\n\n' +
        `Expected: ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(actual)}`
    : () => {
        const diffString = diff(
          pickMonetaryValueFields(expected),
          pickMonetaryValueFields(actual),
          { expand: this.expand },
        );
        return (
          this.utils.matcherHint('toBeIdenticalToMonetaryValue') +
          '\n\n' +
          (diffString && diffString.includes('- Expect')
            ? `Difference:\n\n${diffString}`
            : `Expected: ${this.utils.printExpected(expected)}\n` +
              `Received: ${this.utils.printReceived(actual)}`)
        );
      };
  return { pass, message };
}
