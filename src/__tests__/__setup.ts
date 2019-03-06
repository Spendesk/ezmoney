import * as _fc from 'fast-check';
import * as arbitraries from './utils/arbitraries';
import { toBeIdenticalToMonetaryValue } from './utils/matchers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MonetaryValue } from '../monetary-value';

const _fcplus = Object.assign({}, _fc, arbitraries);

Object.defineProperty(global, 'fc', {
  value: _fcplus,
});

expect.extend({
  toBeIdenticalToMonetaryValue,
});

declare global {
  // eslint-disable-next-line no-undef
  const fc: typeof _fcplus;
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeIdenticalToMonetaryValue(expected: MonetaryValue): void;
    }
  }
}
