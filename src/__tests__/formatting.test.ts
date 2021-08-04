import {
  isFormatSupported,
  format,
  unsafeFormat,
  nativeFormat,
} from '../formatting';
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
    'ar-EG',
    'he-IL',
  ];

  function populateFormatCalls(): void {
    for (const locale of locales) {
      formatCalls[locale] = sample.map((monetaryValue) => {
        const formatting: { [key: string]: string } = Object.create(null);
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

  const originalToLocaleString = Number.prototype.toLocaleString;
  beforeAll(() => {
    Number.prototype.toLocaleString = shimToLocaleString;
    populateFormatCalls();
  });
  afterAll(() => {
    Number.prototype.toLocaleString = originalToLocaleString;
  });

  for (const locale of locales) {
    describe(`given the locale ${locale}`, () => {
      it('returns a string consistent with the snapshot on all combinations of options', () => {
        expect(formatCalls[locale]).toMatchSnapshot();
      });

      it("returns the same string as the native localization function when signDisplay is 'auto' and currencySign is 'standard'", () => {
        for (const call of formatCalls[locale]) {
          for (const currencyDisplay of currencyDisplays) {
            expect(call.formatting[`${currencyDisplay}_auto_standard`]).toBe(
              nativeFormat(call.monetaryValue, locale, { currencyDisplay }),
            );
          }
        }
      });
    });
  }
});

describe('isFormatSupported()', () => {
  it('returns true in the test environment', () => {
    expect(isFormatSupported()).toBe(true);
  });
});
