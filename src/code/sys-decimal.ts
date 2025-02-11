import { Config, Decimal, Numeric } from 'decimal.js-light';
import { ComparisonResult } from './types';

/** @public */
export type SysDecimal = Decimal;
/** @public */
export type SysNumeric = Numeric;
/** @public */
export type SysDecimalConfig = Config;
/** @public */
export type SysDecimalConstructor = new (numeric: SysNumeric) => SysDecimal;

/** @public */
export namespace SysDecimal {
    export const ROUND_UP = Decimal.ROUND_UP;
    export const ROUND_DOWN = Decimal.ROUND_DOWN;
    export const ROUND_CEIL = Decimal.ROUND_CEIL;
    export const ROUND_FLOOR = Decimal.ROUND_FLOOR;
    export const ROUND_HALF_UP = Decimal.ROUND_HALF_UP;
    export const ROUND_HALF_DOWN = Decimal.ROUND_HALF_DOWN;
    export const ROUND_HALF_EVEN = Decimal.ROUND_HALF_EVEN;
    export const ROUND_HALF_CEIL = Decimal.ROUND_HALF_CEIL;
    export const ROUND_HALF_FLOOR = Decimal.ROUND_HALF_FLOOR;

    export type Rounding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    export function getPrecision(): number { return Decimal.precision; }
    export function setPrecision(value: number) { return Decimal.precision = value; }
    export function getRounding(): Rounding { return Decimal.rounding as Rounding; }
    export function setRounding(value: Rounding) { return Decimal.rounding = value; }
    export function getToExpNeg(): number { return Decimal.toExpNeg; }
    export function setToExpNeg(value: number) { return Decimal.toExpNeg = value; }
    export function getToExpPos(): number { return Decimal.toExpPos; }
    export function setToExpPos(value: number) { return Decimal.toExpPos = value; }
    export function getLN10(): SysDecimal { return Decimal.LN10; }
    export function setLN10(value: SysDecimal) { return Decimal.LN10 = value; }

    export function config(value: SysDecimalConfig) {
        Decimal.config(value)
    }

    export function set(value: SysDecimalConfig) {
        Decimal.set(value)
    }
}

/** @public */
export const nullDecimal = newDecimal(-999999999999999.0);

/** @public */
export function newDecimal(value: Numeric): SysDecimal {
    return new Decimal(value);
}

/** @public */
export function newUndefinableDecimal(value: SysNumeric | undefined): SysDecimal | undefined {
    return value === undefined ? undefined : newDecimal(value);
}

/** @public */
export function cloneDecimal(config: SysDecimalConfig): SysDecimalConstructor {
    return Decimal.clone(config);
}

/** @public */
export function newUndefinableNullableDecimal(value: SysNumeric | undefined | null) {
    if (value === null) {
        return null;
    } else {
        return newUndefinableDecimal(value);
    }
}

/** @public */
export function isDecimalEqual(left: SysDecimal, right: SysDecimal) {
    return left.equals(right);
}

/** @public */
export function isUndefinableDecimalEqual(left: SysDecimal | undefined, right: SysDecimal | undefined) {
    if (left === undefined) {
        return right === undefined;
    } else {
        if (right === undefined) {
            return false;
        } else {
            return isDecimalEqual(left, right);
        }
    }
}

/** @public */
export function isDecimalGreaterThan(subject: SysDecimal, other: SysDecimal) {
    return subject.greaterThan(other);
}

/** @public */
export function isDecimalLessThan(subject: SysDecimal, other: SysDecimal) {
    return subject.lessThan(other);
}

/** @public */
export function compareDecimal(left: SysDecimal, right: SysDecimal): number {
    if (left.lessThan(right)) {
        return ComparisonResult.LeftLessThanRight;
    } else {
        if (left.greaterThan(right)) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftEqualsRight;
        }
    }
}

/** @public */
export function compareUndefinableDecimal(left: SysDecimal | undefined, right: SysDecimal | undefined, undefinedIsLowest: boolean) {
    if (left === undefined) {
        if (right === undefined) {
            return ComparisonResult.LeftEqualsRight;
        } else {
            return undefinedIsLowest ? ComparisonResult.LeftLessThanRight : ComparisonResult.LeftGreaterThanRight;
        }
    } else {
        if (right === undefined) {
            return undefinedIsLowest ? ComparisonResult.LeftGreaterThanRight : ComparisonResult.LeftLessThanRight;
        } else {
            return compareDecimal(left, right);
        }
    }
}

