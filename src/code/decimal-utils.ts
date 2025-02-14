import { Decimal } from 'decimal.js-light';
import { ComparisonResult } from './types';

/** @public */
export function isDecimalEqual(left: Decimal, right: Decimal) {
    return left.equals(right);
}

/** @public */
export function isUndefinableDecimalEqual(left: Decimal | undefined, right: Decimal | undefined) {
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
export function isDecimalGreaterThan(subject: Decimal, other: Decimal) {
    return subject.greaterThan(other);
}

/** @public */
export function isDecimalLessThan(subject: Decimal, other: Decimal) {
    return subject.lessThan(other);
}

/** @public */
export function compareDecimal(left: Decimal, right: Decimal): number {
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
export function compareUndefinableDecimal(left: Decimal | undefined, right: Decimal | undefined, undefinedIsLowest: boolean) {
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
