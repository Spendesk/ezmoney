// @ts-ignore
import * as jsum from 'jsum';

import { MonetaryValue } from '../../monetary-value';

import sample from '../data/sample.json';
import callsData from '../data/number-tolocalestring-calls.json';

// We need to compute the calls to Number.prototype.toLocaleString made during the tests ahead of time,
// because we cannot reliably get consistent support for Intl across environments.

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

const currencyDisplays = ['code', 'name', 'symbol'];

type ToLocaleStringArgs = [string, Intl.NumberFormatOptions];

type ToLocaleStringCallData = {
  this: number;
  args: ToLocaleStringArgs;
  returns: string;
};

type ToLocaleStringCallsData = { [hash: string]: ToLocaleStringCallData };

export function buildCallsMap(): ToLocaleStringCallData {
  function computeToLocaleStringCallData(
    monetaryValue: MonetaryValue,
    locale: string,
    currencyDisplay: string,
  ): ToLocaleStringCallData {
    const { amount, currency, precision } = monetaryValue;
    const number = Math.abs(amount / 10 ** precision);
    const args: ToLocaleStringArgs = [
      locale,
      {
        localeMatcher: undefined,
        useGrouping: undefined,
        style: 'currency',
        currency,
        currencyDisplay,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      },
    ];
    const returns = Number.prototype.toLocaleString.apply(number, args);
    return { this: number, args, returns };
  }

  const memoMap = Object.create(null);
  for (const locale of locales) {
    for (const currencyDisplay of currencyDisplays) {
      for (const monetaryValue of sample) {
        const callData = computeToLocaleStringCallData(
          monetaryValue,
          locale,
          currencyDisplay,
        );
        memoMap[
          hashToLocaleStringInputs(callData.this, callData.args)
        ] = callData;
      }
    }
  }
  return memoMap;
}

function hashToLocaleStringInputs(
  number: number,
  args: ToLocaleStringArgs,
): string {
  return jsum.digest({ this: number, args }, 'sha1', 'base64');
}

export const shimToLocaleString: typeof Number.prototype.toLocaleString = toLocaleString;

function toLocaleString(
  this: number,
  locales?: string | string[],
  options?: Intl.NumberFormatOptions,
): string {
  if (typeof locales == 'string' && options) {
    const hash = hashToLocaleStringInputs(this, [locales, options]);
    const callData = ((callsData as unknown) as ToLocaleStringCallsData)[hash];
    if (callData) {
      return callData.returns;
    }
  }
  throw new Error(
    'This call to Number.prototype.toLocaleString has not been recorded',
  );
}
