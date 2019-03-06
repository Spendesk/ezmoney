import {
  isFormatSupported,
  format,
  unsafeFormat,
  CurrencyDisplay,
  SignDisplay,
  CurrencySign,
} from '../formatting';

import sample from './data/sample.json';

describe('format()', () => {
  it('returns the same string as unsafeFormat()', () => {
    fc.assert(
      fc.property(fc.monetaryValue({ currencyWithIsoCodes: true }), (mv) => {
        expect(format(mv, 'en-US')).toBe(unsafeFormat(mv, 'en-US'));
      }),
    );
  });
  it('throws a RangeError when the provided monetary value is invalid', () => {
    fc.assert(
      fc.property(fc.invalidMonetaryValue(), (mv) => {
        expect(() => format(mv, 'en-US')).toThrow(RangeError);
      }),
    );
  });
});

describe('unsafeFormat()', () => {
  const locales = [
    'de-DE',
    'en-CA',
    'en-GB',
    'en-US',
    'es-ES',
    'es-MX',
    'fr-FR',
    'it-IT',
    'ja-JP',
    'pt-BR',
    'ru-RU',
    'zh-CN',
  ];
  for (const locale of locales) {
    it(`returns a string consistent with the snapshot for the locale ${locale} and all combinations of options`, () => {
      const currencyDisplays = [
        CurrencyDisplay.Code,
        CurrencyDisplay.Name,
        CurrencyDisplay.Symbol,
      ];
      const signDisplays = [
        SignDisplay.Always,
        SignDisplay.Auto,
        SignDisplay.ExceptZero,
        SignDisplay.Never,
      ];
      const currencySigns = [CurrencySign.Accounting, CurrencySign.Standard];
      const output = sample.map((monetaryValue) => {
        let formatting: { [key: string]: string } = {};
        for (const currencyDisplay of currencyDisplays) {
          for (const signDisplay of signDisplays) {
            for (const currencySign of currencySigns) {
              formatting[
                `${currencyDisplay}_${signDisplay}_${currencySign}`
              ] = unsafeFormat(monetaryValue, locale, {
                currencyDisplay,
                signDisplay,
                currencySign,
              });
            }
          }
        }
        return {
          monetaryValue,
          formatting,
        };
      });
      expect(output).toMatchSnapshot();
    });
  }
});

describe('isFormatSupported()', () => {
  it('returns true in the test environment', () => {
    expect(isFormatSupported()).toBe(true);
  });
});
