import { MonetaryValue } from '../monetary-value';

export function assertSafeInteger(i: number): void {
  if (!Number.isSafeInteger(i)) {
    throw new RangeError('Number is not a safe integer');
  }
}

export function assertNonZeroSafeInteger(i: number): void {
  if (!(i !== 0 && Number.isSafeInteger(i))) {
    throw new RangeError('Number is not a safe integer different than zero');
  }
}

export function assertStrictlyPositiveSafeInteger(i: number): void {
  if (!(i > 0 && Number.isSafeInteger(i))) {
    throw new RangeError('Number is not a strictly positive safe integer');
  }
}

export function assertValidPrecision(i: number): void {
  if (!(i >= 0 && i <= 15 && Number.isInteger(i))) {
    throw new RangeError(
      'Number is not valid precision as it is not an integer between 0 and 15',
    );
  }
}

export function assertValidMonetaryValue<C extends string>(
  monetaryValue: MonetaryValue<C>,
): void {
  const { amount, precision } = monetaryValue;
  if (!(precision >= 0 && precision <= 15 && Number.isInteger(precision))) {
    throw new RangeError(
      'Precision is not valid as it is not an integer between 0 and 15',
    );
  }
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError('Amount is not valid as it is not a safe integer');
  }
}

export function assertSameCurrency<C extends string>(
  monetaryValue1: MonetaryValue<C>,
  monetaryValue2: MonetaryValue<C>,
): void {
  if (monetaryValue1.currency !== monetaryValue2.currency) {
    throw new TypeError('MonetaryValue objects do not have the same currency');
  }
}
