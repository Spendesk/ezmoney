import {
  LocaleMatcher,
  CurrencyDisplay,
  SignDisplay,
  CurrencySign,
} from '../../formatting';

export const localeMatchers: LocaleMatcher[] = [
  LocaleMatcher.BestFit,
  LocaleMatcher.Lookup,
];

export const currencyDisplays: CurrencyDisplay[] = ['code', 'name', 'symbol'];

export const signDisplays: SignDisplay[] = [
  SignDisplay.Always,
  SignDisplay.Auto,
  SignDisplay.ExceptZero,
  SignDisplay.Never,
];

export const currencySigns: CurrencySign[] = [
  CurrencySign.Accounting,
  CurrencySign.Standard,
];
