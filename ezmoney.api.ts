// @public
declare function absolute<C extends string>(monetaryValue: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function add<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function allocate<C extends string>(monetaryValue: MonetaryValue<C>, weights: number[]): MonetaryValue<C>[];

// @public
declare function compare<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): Comparison;

// @public
declare const enum Comparison {
    EQ = 0,
    GT = 1,
    LT = -1
}

// @public
declare function create<C extends string>(amount: number, currency: C, precision?: number): MonetaryValue<C>;

// @public
declare const enum CurrencyDisplay {
    Code = "code",
    Name = "name",
    Symbol = "symbol"
}

// @alpha
declare const enum CurrencySign {
    Accounting = "accounting",
    Standard = "standard"
}

// @public
declare function divide<C extends string>(monetaryValue: MonetaryValue<C>, divider: number, dividerPrecision: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function equal<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function equivalent<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function format<C extends string>(monetaryValue: MonetaryValue<C>, locales?: string | string[], options?: MonetaryValueFormatOptions): string;

// @public
declare function fromNumber<C extends string>(number: number, currency: C, precision?: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function fromString(str: string): MonetaryValue;

// @public
declare function greaterThan<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function greaterThanOrEqual<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function identical<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function integerDivide<C extends string>(monetaryValue: MonetaryValue<C>, divider: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function isFormatSupported(): boolean;

// @public
declare function isMonetaryValue(arg: unknown): arg is MonetaryValue;

// @public
declare function lessThan<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function lessThanOrEqual<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare const enum LocaleMatcher {
    BestFit = "best fit",
    Lookup = "lookup"
}

// @public
declare function matchPrecision<C extends string>(monetaryValue: MonetaryValue<C>, precision: number): MonetaryValue<C>;

// @public
declare function maximum<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function minimum<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public
interface MonetaryValue<C extends string = string> {
    readonly amount: number;
    readonly currency: C;
    readonly precision: number;
}

// @public
interface MonetaryValueFormatOptions {
    currencyDisplay?: CurrencyDisplay;
    // @alpha
    currencySign?: CurrencySign;
    localeMatcher?: LocaleMatcher;
    // @alpha
    signDisplay?: SignDisplay;
    useGrouping?: boolean;
}

// @public
declare function multiply<C extends string>(monetaryValue: MonetaryValue<C>, factor: number, factorPrecision: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function negate<C extends string>(monetaryValue: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function roundAwayFromZero(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart?: number): number;

// @public
declare function roundDown(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart?: number): number;

// @public
declare function roundHalfAwayFromZero(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart: number): number;

// @public
declare function roundHalfDown(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart: number): number;

// @public
declare function roundHalfToEven(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart: number): number;

// @public
declare function roundHalfToOdd(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart: number): number;

// @public
declare function roundHalfTowardsZero(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart: number): number;

// @public
declare function roundHalfUp(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart: number): number;

// @public
declare type RoundingFunction = (
wholePart: number, 
numeratorFractionalPart: number, 
denominatorFractionalPart: number) => number;

// @public
declare function roundTowardsZero(wholePart: number, numeratorFractionalPart?: number, denominatorFractionalPart?: number): number;

// @public
declare function roundUp(wholePart: number, numeratorFractionalPart: number, denominatorFractionalPart?: number): number;

// @public
declare function setPrecision<C extends string>(monetaryValue: MonetaryValue<C>, precision: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @alpha
declare const enum SignDisplay {
    Always = "always",
    Auto = "auto",
    ExceptZero = "except-zero",
    Never = "never"
}

// @public
declare function subtract<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function toNumber<C extends string>(monetaryValue: MonetaryValue<C>): number;

// @public
declare function toString(monetaryValue: MonetaryValue): string;

// @public
declare function unsafeAbsolute<C extends string>(monetaryValue: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function unsafeAdd<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function unsafeAllocate<C extends string>(monetaryValue: MonetaryValue<C>, weights: number[]): MonetaryValue<C>[];

// @public
declare function unsafeCompare<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): Comparison;

// @public
declare function unsafeCreate<C extends string>(amount: number, currency: C, precision?: number): MonetaryValue<C>;

// @public
declare function unsafeDivide<C extends string>(monetaryValue: MonetaryValue<C>, divider: number, dividerPrecision: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function unsafeEqual<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function unsafeEquivalent<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function unsafeFormat<C extends string>(monetaryValue: MonetaryValue<C>, locales?: string | string[], formatOptions?: MonetaryValueFormatOptions): string;

// @public
declare function unsafeFromNumber<C extends string>(number: number, currency: C, precision?: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function unsafeFromString(str: string): MonetaryValue;

// @public
declare function unsafeGreaterThan<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function unsafeGreaterThanOrEqual<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function unsafeIdentical<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function unsafeIntegerDivide<C extends string>(monetaryValue: MonetaryValue<C>, divider: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function unsafeLessThan<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function unsafeLessThanOrEqual<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): boolean;

// @public
declare function unsafeMatchPrecision<C extends string>(monetaryValue: MonetaryValue<C>, precision: number): MonetaryValue<C>;

// @public
declare function unsafeMaximum<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function unsafeMinimum<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function unsafeMultiply<C extends string>(monetaryValue: MonetaryValue<C>, factor: number, factorPrecision: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function unsafeNegate<C extends string>(monetaryValue: MonetaryValue<C>): MonetaryValue<C>;

// @public
declare function unsafeSetPrecision<C extends string>(monetaryValue: MonetaryValue<C>, precision: number, roundingFunction?: RoundingFunction): MonetaryValue<C>;

// @public
declare function unsafeSubtract<C extends string>(monetaryValue1: MonetaryValue<C>, monetaryValue2: MonetaryValue<C>): MonetaryValue<C>;

// @public (undocumented)
declare function unsafeToNumber<C extends string>(monetaryValue: MonetaryValue<C>): number;

// @public
declare function unsafeToString<C extends string>(monetaryValue: MonetaryValue<C>): string;

