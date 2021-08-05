# Ezmoney

[![CircleCI](https://circleci.com/gh/Spendesk/ezmoney/tree/master.svg?style=svg)](https://circleci.com/gh/Spendesk/ezmoney/tree/master)

**A library to safely manipulate monetary values.**

Ezmoney (/ˈizi'mʌni\/) helps you operate on monetary values, compare them, format them, and more. It features:

- **Pure functions**: Ezmoney only exports side-effect free functions. This makes the API simple and enables dead code elimination (i.e. tree-shaking).
- **Safety first**: Thanks to TypeScript, Ezmoney is fully type-safe. Additionally, all the standard functions validate their arguments for the properties that TypeScript cannot verify.
- **Opt-in performance boost**: All functions have an _unsafe_ variant that forgoes the validation of the arguments. Use it when you are confident in the correctness of your code and need that extra bit of oomph.

## Setup

### Browser

To add Ezmoney to your page, include the following tag to your HTML.

```html
<script src="https://unpkg.com/ezmoney">
```

It creates a global identifier `Ezmoney`, which is an object that holds all the exported functions.

### Node.js

To add Ezmoney to you dependencies, run the following command:

```sh
npm install ezmoney
```

Run `yarn add ezmoney` instead if you are using yarn.

Then, you can use `require('ezmoney')` in your code, or `import { ... } from 'ezmoney'` if you are using TypeScript or ES6 modules.

## Usage

Ezmoney exports a set of functions that operate on monetary values.
A monetary value is an object with three properties: `amount`, `currency` and `precision`.

The properties `amount` and `precision` define together the decimal number that the monetary value represents: the amount is the coefficient part of the decimal number and the precision is the number of decimal places. As for the property `currency`, it is a string that represents the currency in which the monetary value is expressed. You can use any string you want, but if you want internationalization you will need to use the official codes from ISO4217.

For example, to represent `$3.14`, you would define the monetary value `{ amount: 314, currency: 'USD', precision: 2 }`.

Once you have defined some monetary values, you can start using one of the many functions exported by Ezmoney. For example, to add `$3.14` and `$420`, you would write the following:

```javascript
Ezmoney.add(
  { amount: 314, currency: 'USD', precision: 2 },
  { amount: 420, currency: 'USD', precision: 0 },
); // returns { amount: 42314, currency: 'USD', precision: 2 }, that represents $423.14
```

Also note that `amount` must be a safe integer and `precision` must be an integer between 0 and 15 (included).

### Creating monetary values

There are multiple ways to create monetary values. You can:

- build a literal object with `amount`, `currency` and `precision` (as we have been doing so far);
- use the `create` function that takes the arguments `amount`, `currency` and `precision`, in that order;
- use the `fromNumber` function that takes the decimal value as first argument, then the `currency` and the `precision`;
- use `fromString` to parse a string that contains the currency, followed by a space, followed by the decimal value, which digits up to the precision.

The following variables will therefore hold identical monetary values:

```javascript
const withLiteralObject = { amount: 310, currency: 'USD', precision: 2 };
const withCreate = Ezmoney.create(310, 'USD', 2);
const withFromNumber = Ezmoney.fromNumber(3.1, 'USD', 2);
const withFromString = Ezmoney.fromString('USD 3.10');
```

### Performing operations

Ezmoney exports functions to operate on monetary values. They are the following:

| **Unary**  | **Binary** | **Others**      |
| ---------- | ---------- | --------------- |
| `negate`   | `maximum`  | `multiply`      |
| `absolute` | `minimum`  | `integerDivide` |
| &nbsp;     | `add`      | `divide`        |
| &nbsp;     | `subtract` | `allocate`      |

Unary operations take a single monetary value as argument. Binary operations take two monetary values of the same currency as arguments. Other operations take a monetary value and one or multiple numbers as arguments.

### Comparing monetary values

You can perform the usual binary comparisons with the following functions:

- `greaterThan`
- `greaterThanOrEqual`
- `equal`
- `lessThanOrEqual`
- `lessThan`

They all return a boolean depending on whether the condition they describe is verified. They are implemented using the function `compare`, which returns `-1`, `0` or `1` depending on whether the first argument is less than, equal to or greater than the second argument.

These comparisons are only allowed on monetary values that have the same currency. To compare for equality on monetary values that may have different currencies, use either `identical` or `equivalent`. The former only returns `true` when the arguments have exactly the same properties; the latter may return `true` with objects that have different precisions if they still represent the same monetary value. Example:

```javascript
Ezmoney.identical(
  { amount: 42, currency: 'USD', precision: 2 },
  { amount: 420, currency: 'USD', precision: 3 },
); // Returns false
Ezmoney.equivalent(
  { amount: 42, currency: 'USD', precision: 2 },
  { amount: 420, currency: 'USD', precision: 3 },
); // Returns true
```

### Rounding

Functions that are expected to perform rounding take an optional rounding function as last argument. The default rounding function performs a half-to-even rounding (also called the Banker's rounding) but you can replace it by any of the exported rounding functions. They are:

- `roundDown`
- `roundUp`
- `roundTowardsZero`
- `roundAwayFromZero`
- `roundHalfUp`
- `roundHalfDown`
- `roundHalfTowardsZero`
- `roundHalfAwayFromZero`
- `roundHalfToEven`
- `roundHalfToOdd`

Note that none of the functions validate their arguments at runtime as they are not meant to be used directly.

You can also define your own rounding function but the ones defined in Ezmoney should cover all the common use cases and more.

### Formatting

The `format` function uses the native `Intl` API to format a monetary value with the provided locale. Therefore, the result depends on your environment. First, make sure it supports `Intl.NumberFormat` with explicit locale; the function `isFormatSupported` will return `true` if it the case. Then, check that the locales you want to use are available.

If your environment properly supports `format`, you can use it as the following example illustrates:

```javascript
Ezmoney.format({ amount: 314, currency: 'USD', precision: 2 }, 'en-US', {
  currencyDisplay: 'symbol',
}); // returns '$3.14'
Ezmoney.format({ amount: 42, currency: 'EUR', precision: 0 }, 'fr-FR', {
  currencyDisplay: 'name',
  signDisplay: 'always',
}); // returns '+42 euros'
```

The returned string always displays as many decimal places as the precision.

### Checking that an object is a monetary value

The function `isMonetaryValue` will return `true` if the provided input satisfies the conditions to be a monetary value. It will check that the argument is an object with the properties `amount`, `currency` and `precision`, that those properties have the right type and that they have valid values. You can use it to prevent the other functions from throwing unexpectedly.

If you are using TypeScript, the function `isMonetaryValue` can be used as a type guard.

### Using the unsafe variants

Preconditions that cannot be checked by TypeScript are validated at runtime. For example, `compare` always ensures that the two monetary values provided have the same currency; if they don't, it will throw.

This incurs a small performance cost; if you want your code to be as fast as possible, you can trade a little bit of safety for more speed by using the _unsafe_ functions.

Operations, comparisons and other similar functions each have an alternative implementation that displays the same behavior in normal circumstances but do not perform any runtime checks.
They are all prefixed by `unsafe` and do not guarantee correctness if any of the provided arguments are invalid. For example:

```javascript
// When the arguments are valid
Ezmoney.add(
  { amount: 314, currency: 'USD', precision: 2 },
  { amount: 420, currency: 'USD', precision: 0 },
); // returns { amount: 42314, currency: 'USD', precision: 2 }
Ezmoney.unsafeAdd(
  { amount: 314, currency: 'USD', precision: 2 },
  { amount: 420, currency: 'USD', precision: 0 },
); // also returns { amount: 42314, currency: 'USD', precision: 2 }

// When the arguments are invalid (note that the currencies are different)
Ezmoney.add(
  { amount: 314, currency: 'USD', precision: 2 },
  { amount: 420, currency: 'EUR', precision: 0 },
); // throws an error
Ezmoney.unsafeAdd(
  { amount: 314, currency: 'USD', precision: 2 },
  { amount: 420, currency: 'EUR', precision: 0 },
); // returns { amount: 42314, currency: 'USD', precision: 2 }, which is incorrect
```

Use the unsafe functions when you really need performance and are confident that the arguments will always be valid.

## Contributing

There are no contributing guidelines yet. They will be communicated soon.
In the meantime, feel free to open an issue for bugs and features requests or submit a pull request if you would like to improve the project.

## Why a library?

There is [a very good article](https://frontstuff.io/how-to-handle-monetary-values-in-javascript) that explains why you would want to use a library to handle monetary values in JavaScript.

Basically, JavaScript follows the IEEE 754 standard made for floating-point arithmetic. Numbers all have a double precision (64 bit). This is dangerous because:

- non-integers cannot be precisely represented;
- integers outside of a certain range are not "safe", i.e. a single value could represent multiple possible numbers.

When you are dealing with money, accuracy is important. To avoid the pitfalls of floating-point arithmetic, you need to:

- always deal with integers, even for decimal values;
- make sure that the integers stay in the safe range.

This is exactly what Ezmoney provides (among other things).

## Prior art

A non-exhaustive list of libraries that solve problems similar to Ezmoney:

- [Dinero.js](https://npmjs.com/package/dinero.js)
- [money-works](https://www.npmjs.com/package/money-works)
- [es-money](https://www.npmjs.com/package/es-money)
- [moneysafe](https://www.npmjs.com/package/moneysafe)

Special shout out to Sarah Dayan, the author of both Dinero.js and the article linked above. Dinero.js was the main source of inspiration for Ezmoney. It has a nice object-oriented, chainable and immutable API; it may interest you if you prefer that style.

As with many other similar libraries, the fundamental design has been inspired by Martin Fowler's take on [money as a value object](https://martinfowler.com/eaaCatalog/money.html).

The style of the API is inspired from [date-fns](https://date-fns.org/): it exposes a set of simple, well-scoped pure functions to operate on date objects. Those properties makes the library easy to grok and pleasant to use.

## License

Ezmoney is licensed under [MIT](LICENSE).

Copyright (c) 2019 Spendesk
