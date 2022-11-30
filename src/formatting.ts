import { MonetaryValue } from './monetary-value';
import { assertValidMonetaryValue } from './utils/assertions';
import { unsafeToNumber } from './coercions';

/**
 * @public
 * The locale matching algorithms.
 */
export const enum LocaleMatcher {
  /**
   * Locale is selected by the runtime.
   */
  BestFit = 'best fit',
  /**
   * Locale is selected according to the Lookup algorithm in [BCP 47](https://tools.ietf.org/html/rfc4647#section-3.4)
   */
  Lookup = 'lookup',
}

/**
 * @public
 * Determines how to display the currency.
 */
export const enum CurrencyDisplay {
  /**
   * Display the currency as a localized currency symbol, such as €.
   */
  Symbol = 'symbol',
  /**
   * Display the currency as the ISO code from ISO4217.
   */
  Code = 'code',
  /**
   * Display the currency as a localized currency name.
   */
  Name = 'name',
}

/**
 * @alpha
 * Describes in which situation the sign should be displayed.
 * Follows the [Intl.NumberFormat Unified API Proposal](https://github.com/tc39/proposal-unified-intl-numberformat).
 */
export const enum SignDisplay {
  /**
   * Display the sign only when the amount is negative.
   */
  Auto = 'auto',
  /**
   * Always display the sign.
   */
  Always = 'always',
  /**
   * Never display the sign.
   */
  Never = 'never',
  /**
   * Always display the sign, except when the amount is zero.
   */
  ExceptZero = 'exceptZero',
}

/**
 * @alpha
 * Describes how to display the negative sign.
 * Follows the [Intl.NumberFormat Unified API Proposal](https://github.com/tc39/proposal-unified-intl-numberformat)
 */
export const enum CurrencySign {
  /**
   * Displays the positive sign as a plus and the negative sign as a minus.
   */
  Standard = 'standard',
  /**
   * Displays the positive sign as a plus and the negative sign as enclosed parentheses.
   */
  Accounting = 'accounting',
}

/**
 * @public
 * The options that can be passed to {@link format} or {@link unsafeFormat} to tweak to formatting.
 */
export interface MonetaryValueFormatOptions
  extends Omit<
    Intl.NumberFormatOptions,
    'style' | 'currency' | 'minimumFractionDigits' | 'maximumFractionDigits'
  > {
  /**
   * The locale matching algorithm to use.
   * For more information, see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation).
   */
  localeMatcher?: LocaleMatcher;
  /**
   * Determines how to display the currency part of the string.
   */
  currencyDisplay?: CurrencyDisplay;
  /**
   * @alpha
   * Determines in which situation the sign should be displayed.
   * Follows the [Intl.NumberFormat Unified API Proposal](https://github.com/tc39/proposal-unified-intl-numberformat).
   */
  signDisplay?: SignDisplay;
  /**
   * @alpha
   * Determines how to display the negative sign.
   * Follows the [Intl.NumberFormat Unified API Proposal](https://github.com/tc39/proposal-unified-intl-numberformat)
   */
  currencySign?: CurrencySign;
}

/**
 * @public
 * Formats a monetary value into a string in the given locale.
 * @remarks
 * See {@link unsafeFormat} for an implementation that does not validate the arguments.
 * @param monetaryValue - The monetary value to format
 * @param locales - A string with a BCP 47 language tag, or an array of such strings.
 * @param options - An object to tweak the formatting
 * @returns a string that represents `monetaryValue` in the given `locale`
 */
export function format<C extends string>(
  monetaryValue: MonetaryValue<C>,
  locales?: string | string[],
  options: MonetaryValueFormatOptions = {},
): string {
  assertValidMonetaryValue(monetaryValue);
  return unsafeFormat(monetaryValue, locales, options);
}

/**
 * @public
 * Formats a monetary value into a string in the given locale.
 * Does not check the validity of the arguments.
 * @remarks
 * See {@link format} for an implementation that validates the arguments.
 * @param monetaryValue - The monetary value to format
 * @param locales - A string with a BCP 47 language tag, or an array of such strings
 * @param options - An object to tweak the formatting
 * @returns a string that represents `monetaryValue` in the given `locale`
 */
export function unsafeFormat<C extends string>(
  monetaryValue: MonetaryValue<C>,
  locales?: string | string[],
  formatOptions: MonetaryValueFormatOptions = {},
): string {
  const {
    signDisplay = SignDisplay.Auto,
    currencySign = CurrencySign.Standard,
  } = formatOptions;
  if (
    signDisplay === SignDisplay.Auto &&
    currencySign === CurrencySign.Standard
  ) {
    return nativeFormat(monetaryValue, locales, formatOptions);
  }
  return experimentalFormat(monetaryValue, locales, formatOptions);
}

export function nativeFormat<C extends string>(
  monetaryValue: MonetaryValue<C>,
  locales: string | string[] | undefined,
  formatOptions: Intl.NumberFormatOptions,
): string {
  return Number.prototype.toLocaleString.call(
    unsafeToNumber(monetaryValue),
    locales,
    {
      ...formatOptions,
      style: 'currency',
      currency: monetaryValue.currency,
      minimumFractionDigits: monetaryValue.precision,
      maximumFractionDigits: monetaryValue.precision,
    },
  );
}

function experimentalFormat<C extends string>(
  monetaryValue: MonetaryValue<C>,
  locales: string | string[] | undefined,
  formatOptions: MonetaryValueFormatOptions,
): string {
  const { amount } = monetaryValue;
  const formattedMonetaryValue = nativeFormat(
    monetaryValue,
    locales,
    formatOptions,
  );
  if (isSignRequired(formatOptions.signDisplay, amount)) {
    return putTheSign(
      formattedMonetaryValue,
      amount,
      formatOptions.currencySign,
    );
  }
  return removeTheSign(formattedMonetaryValue, amount);
}

function putTheSign(
  formattedValue: string,
  amount: number,
  currencySign: CurrencySign = CurrencySign.Standard,
): string {
  if (amount >= 0) {
    return `+${formattedValue}`;
  }
  if (currencySign === CurrencySign.Accounting) {
    return `(${formattedValue.replace('-', '')})`;
  }
  return formattedValue;
}

function removeTheSign(formattedValue: string, amount: number): string {
  if (amount >= 0) {
    return formattedValue;
  }
  return formattedValue.replace('-', '');
}

function isSignRequired(
  signDisplay: SignDisplay = SignDisplay.Auto,
  amount: number,
): boolean {
  return (
    signDisplay === SignDisplay.Always ||
    (signDisplay === SignDisplay.Auto && amount < 0) ||
    (signDisplay === SignDisplay.ExceptZero && amount !== 0)
  );
}

/**
 * @public
 * Returns whether {@link format} and {@link unsafeFormat} are supported in your environment.
 * @remarks
 * Implementation taken from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#Checking_for_support_for_locales_and_options_arguments).
 */
export function isFormatSupported(): boolean {
  return (
    typeof Intl === 'object' &&
    Intl !== null &&
    typeof Intl.NumberFormat === 'function'
  );
}
