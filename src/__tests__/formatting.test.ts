import { isFormatSupported, format, unsafeFormat } from '../formatting';
import { MonetaryValue } from '../monetary-value';

import { shimToLocaleString } from './utils/number-tolocalestring-memo';
import {
  currencyDisplays,
  signDisplays,
  currencySigns,
} from './utils/enum-values';
import sample from './data/sample.json';

describe('format()', () => {
  it('returns the same string as unsafeFormat()', () => {
    fc.assert(
      fc.property(
        fc.monetaryValue({ currencyWithIsoCodes: true }),
        fc.oneof(fc.monetaryValueFormatOptions(), fc.constant(undefined)),
        (mv, options) => {
          expect(format(mv, 'en-US', options)).toBe(
            unsafeFormat(mv, 'en-US', options),
          );
        },
      ),
    );
  });
  it('throws a RangeError when the provided monetary value is invalid', () => {
    fc.assert(
      fc.property(
        fc.invalidMonetaryValue(),
        fc.oneof(fc.monetaryValueFormatOptions(), fc.constant(undefined)),
        (mv, options) => {
          expect(() => format(mv, 'en-US', options)).toThrow(RangeError);
        },
      ),
    );
  });
});

describe('unsafeFormat()', () => {
  type FormatCall = {
    monetaryValue: MonetaryValue;
    formatting: {
      [combination: string]: string;
    };
  };
  const formatCalls: {
    [locale: string]: FormatCall[];
  } = Object.create(null);

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

  function populateFormatCalls(): void {
    for (const locale of locales) {
      formatCalls[locale] = sample.map((monetaryValue) => {
        let formatting: { [key: string]: string } = Object.create(null);
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
    }
  }

  let originalToLocaleString = Number.prototype.toLocaleString;
  beforeAll(() => {
    Number.prototype.toLocaleString = shimToLocaleString;
    populateFormatCalls();
  });
  afterAll(() => {
    Number.prototype.toLocaleString = originalToLocaleString;
  });

  for (const locale of locales) {
    it(`returns a string consistent with the snapshot for the locale ${locale} and all combinations of options`, () => {
      expect(formatCalls[locale]).toMatchSnapshot();
    });
  }
});

describe('isFormatSupported()', () => {
  it('returns true in the test environment', () => {
    expect(isFormatSupported()).toBe(true);
  });
});
