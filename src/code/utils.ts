// (c) 2024 Xilytix Pty Ltd

import { Config, Decimal, Numeric } from 'decimal.js-light';
import { nanoid } from 'nanoid';
import { Err, Ok, Result } from './result';
import { ComparisonResult, Integer, Json, JsonValue, Rect, TimeSpan } from './types';

/** @public */
export const hoursPerDay = 24;
/** @public */
export const minsPerHour = 60;
/** @public */
export const secsPerMin = 60;
/** @public */
export const mSecsPerSec = 1000;
/** @public */
export const minsPerDay = hoursPerDay * minsPerHour;
/** @public */
export const secsPerDay = minsPerDay * secsPerMin;
/** @public */
export const secsPerHour = secsPerMin * minsPerHour;
/** @public */
export const mSecsPerMin = secsPerMin * mSecsPerSec;
/** @public */
export const mSecsPerHour = secsPerHour * mSecsPerSec;
/** @public */
export const mSecsPerDay = secsPerDay * mSecsPerSec;

/** @public */
export const nullDate = new Date(-100000000 * mSecsPerDay);
/** @public */
export const nullDecimal = new Decimal(-999999999999999.0);

/** @public */
export function newDate(value: Date) {
    return new Date(value.getTime());
}

/** @public */
export function newNowDate() {
    return new Date(Date.now());
}

/** @public */
export function newNullDate() {
    return new Date(nullDate);
}

/** @public */
export function newUndefinableDate(value: Date | undefined) {
    return value === undefined ? undefined : newDate(value);
}

/** @public */
export function newDecimal(value: Numeric) {
    return new Decimal(value);
}

/** @public */
export function newUndefinableDecimal(value: Numeric | undefined) {
    return value === undefined ? undefined : new Decimal(value);
}

/** @public */
export function cloneDecimal(config: Config) {
    return Decimal.clone(config);
}

/** @public */
export function newUndefinableNullableDecimal(value: Numeric | undefined | null) {
    if (value === null) {
        return null;
    } else {
        return newUndefinableDecimal(value);
    }
}

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
export function newGuid() {
    return nanoid();
}

/** @public */
export function delay1Tick(ftn: () => void): ReturnType<typeof setTimeout> {
    return setTimeout(() => { ftn(); }, 0);
}

/** @public */
export function numberToPixels(value: number) {
    return value.toString(10) + 'px';
}

/** @public */
export function compareValue<T extends number | string>(left: T, right: T) {
    if (left < right) {
        return ComparisonResult.LeftLessThanRight;
    } else {
        if (left > right) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftEqualsRight;
        }
    }
}

/** @public */
export function compareNumber(left: number, right: number) {
    if (left < right) {
        return ComparisonResult.LeftLessThanRight;
    } else {
        if (left > right) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftEqualsRight;
        }
    }
}

/** @public */
export function compareUndefinableNumber(left: number | undefined, right: number | undefined, undefinedIsLowest: boolean) {
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
            return compareNumber(left, right);
        }
    }
}

/** @public */
export function compareInteger(left: Integer, right: Integer) {
    if (left < right) {
        return ComparisonResult.LeftLessThanRight;
    } else {
        if (left > right) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftEqualsRight;
        }
    }
}

/** @public */
export function priorityCompareInteger(left: Integer, right: Integer, priority: Integer) {
    if (left === priority) {
        return right === priority ? ComparisonResult.LeftEqualsRight : ComparisonResult.LeftLessThanRight;
    } else {
        if (right === priority) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            if (left < right) {
                return ComparisonResult.LeftLessThanRight;
            } else {
                if (left > right) {
                    return ComparisonResult.LeftGreaterThanRight;
                } else {
                    return ComparisonResult.LeftEqualsRight;
                }
            }
        }
    }
}

/** @public */
export function compareUndefinableInteger(left: Integer | undefined, right: Integer | undefined, undefinedIsLowest: boolean) {
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
            return compareInteger(left, right);
        }
    }
}

/** @public */
export function compareEnum<T extends number>(left: T, right: T): number {
    if (left < right) {
        return ComparisonResult.LeftLessThanRight;
    } else {
        if (left > right) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftEqualsRight;
        }
    }
}

/** @public */
export function compareUndefinableEnum<T extends number>(left: T | undefined, right: T | undefined, undefinedIsLowest: boolean) {
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
            return compareEnum(left, right);
        }
    }
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

/** @public */
export function compareString(left: string, right: string): number {
    if (left < right) {
        return ComparisonResult.LeftLessThanRight;
    } else {
        if (left > right) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftEqualsRight;
        }
    }
}

/** @public */
export function compareUndefinableString(left: string | undefined, right: string | undefined, undefinedIsLowest: boolean) {
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
            return compareString(left, right);
        }
    }
}

/** @public */
export function compareBoolean(left: boolean, right: boolean): number {
    if (left === right) {
        return ComparisonResult.LeftEqualsRight;
    } else {
        if (left) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftLessThanRight;
        }
    }
}

/** @public */
export function compareUndefinableBoolean(left: boolean | undefined, right: boolean | undefined, undefinedIsLowest: boolean) {
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
            return compareBoolean(left, right);
        }
    }
}

/** @public */
export function concatenateArrayUniquely<T>(left: readonly T[], right: readonly T[]): T[] {
    const maxLength = left.length + right.length;
    const result = new Array<T>(maxLength);
    for (let i = 0; i < left.length; i++) {
        result[i] = left[i];
    }
    let idx = left.length;
    for (let i = 0; i < right.length; i++) {
        const value = right[i];
        if (!result.includes(value)) {
            result[idx++] = value;
        }
    }
    result.length = idx;
    return result;
}

/** @public */
export function concatenateElementToArrayUniquely<T>(array: readonly T[], element: T) {
    const result = array.slice();
    if (!array.includes(element)) {
        result.push(element);
    }
    return result;
}

/** @public */
export function subtractElementFromArray<T>(array: readonly T[], element: T) {
    const result = array.slice();
    const count = result.length;
    for (let i = count - 1; i >= 0; i--) {
        if (result[i] === element) {
            result.splice(i, 1);
        }
    }
    return result;
}

/** Assumes array has at most one instance of element
 * @public
 */
export function subtractElementFromArrayUniquely<T>(array: readonly T[], element: T) {
    const result = array.slice();
    const count = array.length;
    for (let i = count - 1; i >= 0; i--) {
        if (result[i] === element) {
            result.splice(i, 1);
            break;
        }
    }
    return result;
}

/** @public */
export function addToArrayByPush<T>(target: T[], addition: readonly T[]) {
    const additionCount = addition.length;
    for (let i = 0; i < additionCount; i++) {
        const element = addition[i];
        target.push(element);
    }
}

/** @public */
export function addToArrayUniquely<T>(target: T[], addition: readonly T[]) {
    let additionIdx = target.length;
    target.length += addition.length;
    for (let i = 0; i < addition.length; i++) {
        const value = addition[i];
        if (!target.includes(value)) {
            target[additionIdx++] = value;
        }
    }
    target.length = additionIdx;
}

/** @public */
export function addToCapacitisedArrayUniquely<T>(target: T[], count: Integer, addition: readonly T[]) {
    const additionCount = addition.length;
    const maxNewCount = count + additionCount;
    if (maxNewCount > target.length) {
        target.length = maxNewCount;
    }
    for (let i = 0; i < additionCount; i++) {
        const value = addition[i];
        if (!target.includes(value)) {
            target[count++] = value;
        }
    }
    return count;
}

/** @public */
export function addToGrow15ArrayUniquely<T>(target: T[], count: Integer, addition: readonly T[]) {
    const additionCount = addition.length;
    const maxNewCount = count + additionCount;
    if (maxNewCount > target.length) {
        target.length = maxNewCount + 15;
    }
    for (let i = 0; i < additionCount; i++) {
        const value = addition[i];
        if (!target.includes(value)) {
            target[count++] = value;
        }
    }
    return count;
}

/** @public */
export function removeFromArray<T>(array: T[], removeElements: readonly T[]): Integer | undefined {
    let firstRemoveIndex: Integer | undefined;
    let blockLastIndex: Integer | undefined;
    for (let i = array.length - 1; i >= 0; i--) {
        const element = array[i];
        const toBeRemoved = removeElements.includes(element);
        if (toBeRemoved) {
            if (blockLastIndex === undefined) {
                blockLastIndex = i;
            }
            firstRemoveIndex = i;
        } else {
            if (blockLastIndex !== undefined) {
                const blockLength = blockLastIndex - i;
                array.splice(i + 1, blockLength);
                blockLastIndex = undefined;
            }
        }
    }

    if (blockLastIndex !== undefined) {
        array.splice(0, blockLastIndex + 1);
    }

    return firstRemoveIndex;
}

/** @public */
export function testRemoveFromArray<T>(
    array: T[],
    removeTest: ((element: T) => boolean),
    beforeBlockRemoveCallback?: (blockIndex: Integer, blockLength: Integer) => void
): Integer | undefined {
    let firstRemoveIndex: Integer | undefined;
    let blockLastIndex: Integer | undefined;
    for (let i = array.length - 1; i >= 0; i--) {
        const element = array[i];
        const toBeRemoved = removeTest(element);
        if (toBeRemoved) {
            if (blockLastIndex === undefined) {
                blockLastIndex = i;
            }
            firstRemoveIndex = i;
        } else {
            if (blockLastIndex !== undefined) {
                const blockIndex = i + 1;
                const blockLength = blockLastIndex - i;
                if (beforeBlockRemoveCallback !== undefined) {
                    beforeBlockRemoveCallback(blockIndex, blockLength);
                }
                array.splice(blockIndex, blockLength);
                blockLastIndex = undefined;
            }
        }
    }

    if (blockLastIndex !== undefined) {
        const blockLength = blockLastIndex + 1;
        if (beforeBlockRemoveCallback !== undefined) {
            beforeBlockRemoveCallback(0, blockLength);
        }
        array.splice(0, blockLength);
    }

    return firstRemoveIndex;
}

/** @public */
export function compareDate(left: Date, right: Date) {
    const leftTime = left.getTime();
    const rightTime = right.getTime();
    if (leftTime === rightTime) {
        return ComparisonResult.LeftEqualsRight;
    } else {
        if (leftTime > rightTime) {
            return ComparisonResult.LeftGreaterThanRight;
        } else {
            return ComparisonResult.LeftLessThanRight;
        }
    }
}

/** @public */
export function compareUndefinableDate(left: Date | undefined, right: Date | undefined, undefinedIsLowest: boolean) {
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
            return compareDate(left, right);
        }
    }
}

/** @public */
export function isDateEqual(left: Date, right: Date) {
    return left.getTime() === right.getTime();
}

/** @public */
export function isUndefinableDateEqual(left: Date | undefined, right: Date | undefined) {
    if (left === undefined) {
        return right === undefined;
    } else {
        if (right === undefined) {
            return false;
        } else {
            return isDateEqual(left, right);
        }
    }
}

/** @public */
export function isArrayEqual<T>(left: readonly T[], right: readonly T[]): boolean {
    const length = left.length;
    if (right.length !== length) {
        return false;
    } else {
        for (let i = 0; i < length; i++) {
            if (left[i] !== right[i]) {
                return false;
            }
        }
        return true;
    }
}

/** @public */
export function isUndefinableArrayEqual<T>(left: readonly T[] | undefined, right: readonly T[] | undefined): boolean {
    if (left === undefined) {
        return right === undefined;
    } else {
        if (right === undefined) {
            return false;
        } else {
            return isArrayEqual(left, right);
        }
    }
}

/** @public */
export function isUndefinableArrayEqualUniquely<T>(left: readonly T[] | undefined, right: readonly T[] | undefined): boolean {
    if (left === undefined) {
        return right === undefined;
    } else {
        if (right === undefined) {
            return false;
        } else {
            return isArrayEqualUniquely(left, right);
        }
    }
}

/** @public */
export function isArrayEqualUniquely<T>(left: readonly T[], right: readonly T[]): boolean {
    const length = left.length;
    if (right.length !== length) {
        return false;
    } else {
        for (let i = 0; i < length; i++) {
            if (!left.includes(right[i])) {
                return false;
            }
        }
        return true;
    }
}

/** @public */
export function isSamePossiblyUndefinedArray<T>(left?: readonly T[], right?: readonly T[]): boolean {
    if (left === undefined) {
        return right === undefined;
    } else {
        return right === undefined ? true : isArrayEqual(left, right);
    }
}

/** @public */
export function compareArray<T>(left: readonly T[], right: readonly T[]): number {
    // Compare matching element in order. If elements differ, return result of element comparison.
    // If arrays have different length but common indexes have same elements, then return comparison of lengths.
    let shorterArray: readonly T[];
    let longerArray: readonly T[];
    let leftIsShorter: boolean;
    let result = 0;

    if (left.length < right.length) {
        shorterArray = left;
        longerArray = right;
        leftIsShorter = true;
    } else {
        shorterArray = right;
        longerArray = left;
        leftIsShorter = false;
    }

    const elementsTheSame = shorterArray.every((element: T, index: Integer) => {
        const longerElement = longerArray[index];
        if (element === longerElement) {
            return true;
        } else {
            result = (element < longerElement) ? ComparisonResult.LeftLessThanRight : 1;
            return false;
        }
    });

    if (!elementsTheSame) {
        return leftIsShorter ? result : result * -1;
    } else {
        if (left.length === right.length) {
            return ComparisonResult.LeftEqualsRight;
        } else {
            return leftIsShorter ? ComparisonResult.LeftLessThanRight : 1;
        }
    }
}

/** @public */
export function copyJson(obj: Json) {
    return deepExtendObject({}, obj) as Json;
}

/** @public */
export function copyJsonValue(value: JsonValue) {
    return deepExtendValue({}, value) as JsonValue;
}

/** @public */
export function deepExtendObject(target: Record<string, unknown>, obj: Record<string, unknown> | undefined): Record<string, unknown> {
    if (obj !== undefined) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const existingTarget = target[key];
                target[key] = deepExtendValue(existingTarget, value);
            }
        }
    }

    return target;
}

/** @public */
export function deepExtendValue(existingTarget: unknown, value: unknown): unknown {
    if (typeof value !== 'object') {
        return value;
    } else {
        if (value instanceof Array) {
            const length = value.length;
            const targetArray = new Array<unknown>(length);
            for (let i = 0; i < length; i++) {
                const element = value[i] as unknown;
                targetArray[i] = deepExtendValue({}, element);
            }
            return targetArray;
        } else {
            if (value === null) {
                return null;
            } else {
                const valueObj = value as Record<string, unknown>;
                if (existingTarget === undefined) {
                    return deepExtendObject({}, valueObj); // overwrite
                } else {
                    if (typeof existingTarget !== 'object') {
                        return deepExtendObject({}, valueObj); // overwrite
                    } else {
                        if (existingTarget instanceof Array) {
                            return deepExtendObject({}, valueObj); // overwrite
                        } else {
                            if (existingTarget === null) {
                                return deepExtendObject({}, valueObj); // overwrite
                            } else {
                                const existingTargetObj = existingTarget as Record<string, unknown>;
                                return deepExtendObject(existingTargetObj, valueObj); // merge
                            }
                        }
                    }
                }
            }
        }
    }
}

/** @public */
export function deepClone(object: Record<string, unknown>) {
    return deepExtendValue({}, object);
}

/** @public */
export function isUndefinableStringNumberBooleanNestArrayEqual(left: unknown[] | undefined, right: unknown[] | undefined) {
    if (left === undefined) {
        return right === undefined;
    } else {
        if (right === undefined) {
            return false;
        } else {
            return isStringNumberBooleanNestArrayEqual(left, right);
        }
    }
}

/** @public */
export function isStringNumberBooleanNestArrayEqual(left: unknown[], right: unknown[]) {
    const leftCount = left.length;
    const rightCount = right.length;
    if (leftCount !== rightCount) {
        return false;
    } else {
        for (let i = 0; i < leftCount; i++) {
            if (!isStringNumberBooleanNestArrayElementEqual(left[i], right[i])) {
                return false;
            }
        }
        return true;
    }
}

/** @public */
export function isStringNumberBooleanNestArrayElementEqual(leftElement: unknown, rightElement: unknown) {
    if (Array.isArray(leftElement)) {
        if (Array.isArray(rightElement)) {
            return isStringNumberBooleanNestArrayEqual(leftElement, rightElement);
        } else {
            return false;
        }
    } else {
        if (Array.isArray(rightElement)) {
            return false;
        } else {
            const leftElementType = typeof leftElement;
            const rightElementType = typeof rightElement;
            switch (leftElementType) {
                case 'string': return rightElementType === 'string' && leftElement === rightElement;
                case 'number': return rightElementType === 'number' && leftElement === rightElement;
                case 'boolean': return rightElementType === 'boolean' && leftElement === rightElement;
                default: return false;
            }
        }
    }
}

/** @public */
export function isDigitCharCode(charCode: number) {
    return charCode > 47 && charCode <  58;
}

/** @public */
export interface IntlNumberFormatCharParts {
    minusSign: string;
    group: string | undefined;
    decimal: string;
}

/** @public */
export function calculateIntlNumberFormatCharParts(numberFormat: Intl.NumberFormat): Result<IntlNumberFormatCharParts> {

    const parts = numberFormat.formatToParts(-123456.7);
    let minusSign: string | undefined;
    let group: string | undefined;
    let decimal: string | undefined;

    for (const part of parts) {
        const { type, value } = part;
        switch (type) {
            case 'minusSign':
                minusSign = value;
                break;
            case 'group':
                group = value;
                break;
            case 'decimal':
                decimal = value;
                break;
        }
    }

    if (minusSign === undefined || decimal === undefined) {
        const errorText = JSON.stringify(parts);
        return new Err(errorText);
    } else {
        const intlNumberFormatCharParts: IntlNumberFormatCharParts = {
            minusSign,
            group,
            decimal,
        };

        return new Ok(intlNumberFormatCharParts);
    }
}

/** @public */
export function isPartialIntlFormattedNumber(value: string, charParts: IntlNumberFormatCharParts) {
    return hasIntlFormattedNumberGotDigits(value, charParts) !== undefined;
}

/** @public */
export function isIntlFormattedNumber(value: string, charParts: IntlNumberFormatCharParts) {
    return hasIntlFormattedNumberGotDigits(value, charParts) === true;
}

/**
 * Returns undefined if not valid Intl Formatted number.
 * Otherwise returns true if got one or more digits
 * Otherwise returns false
 */
function hasIntlFormattedNumberGotDigits(value: string, charParts: IntlNumberFormatCharParts): boolean | undefined {
    const length = value.length;

    let previousWasGroup = false;
    let gotDecimal = false;
    let gotDigits = false;

    for (let i = 0; i < length; i++) {
        const char = value[i];
        switch (char) {
            case charParts.minusSign: {
                if (i !== 0) {
                    return undefined;
                } else {
                    break;
                }
            }
            case charParts.group: {
                if (previousWasGroup || gotDecimal) {
                    return undefined;
                } else {
                    previousWasGroup = true;
                    break;
                }
            }
            case charParts.decimal: {
                if (gotDecimal) {
                    return undefined;
                } else {
                    gotDecimal = true;
                    previousWasGroup = false;
                    break;
                }
            }
            default: {
                if (!isDigitCharCode(char.charCodeAt(0))) {
                    return undefined;
                } else {
                    gotDigits = true;
                    previousWasGroup = false;
                }
            }
        }
    }

    return gotDigits;
}

/** @public */
export function isPartialIntlFormattedInteger(value: string, charParts: IntlNumberFormatCharParts): boolean {
    return hasIntlFormattedIntegerGotDigits(value, charParts) !== undefined;
}

/** @public */
export function isIntlFormattedInteger(value: string, charParts: IntlNumberFormatCharParts): boolean {
    return hasIntlFormattedIntegerGotDigits(value, charParts) === true;
}

/**
 * Returns undefined if not valid Intl Formatted number.
 * Otherwise returns true if got one or more digits
 * Otherwise returns false
 */
function hasIntlFormattedIntegerGotDigits(value: string, charParts: IntlNumberFormatCharParts): boolean | undefined {
    const length = value.length;

    let previousWasGroup = false;
    let gotDigits = false;

    for (let i = 0; i < length; i++) {
        const char = value[i];
        switch (char) {
            case charParts.minusSign: {
                if (i !== 0) {
                    return undefined;
                } else {
                    break;
                }
            }
            case charParts.group: {
                if (previousWasGroup) {
                    return undefined;
                } else {
                    previousWasGroup = true;
                    break;
                }
            }
            default: {
                if (!isDigitCharCode(char.charCodeAt(0))) {
                    return undefined;
                } else {
                    gotDigits = true;
                    previousWasGroup = false;
                }
            }
        }
    }

    return gotDigits;
}

/** @public */
export function checkEscapeCharForRegexOutsideCharClass(char: string) {
    switch (char) {
        case '[':
        case ']':
        case '\\':
        case '^':
        case '*':
        case '+':
        case '?':
        case '{':
        case '}':
        case '|':
        case '(':
        case ')':
        case '$':
        case '.':
            return '\\' + char;
        default:
            return char;
    }
}

/** @public */
export function checkEscapeCharForRegexInsideCharClass(char: string) {
    switch (char) {
        case '[':
        case ']':
        case '-':
        case '^':
        case '*':
            return '\\' + char;
        default:
            return char;
    }
}

// /** @public */
// export const isIntegerRegex = /^-?\d+$/;

// /** @public */
// export function createIsGroupableIntegerRegex(groupingChar: string) {
//     const checkEscapedGroupingChar = checkEscapeCharForRegexInsideCharClass(groupingChar);
//     return new RegExp('^-?[\\d' + checkEscapedGroupingChar + ']+$');
// }

/** @public */
export function createNumberGroupCharRemoveRegex(groupChar: string | undefined) {
    if (groupChar === undefined) {
        return undefined;
    } else {
        const checkEscapedGroupChar = checkEscapeCharForRegexOutsideCharClass(groupChar);
        return new RegExp(checkEscapedGroupChar, 'g');
    }
}

/** @public */
export function isStringifiedInteger(value: string) {
    const length = value.length;

    let gotDigit = false;

    for (let i = 0; i < length; i++) {
        const char = value[i];
        switch (char) {
            case '-': {
                if (i !== 0) {
                    return false;
                } else {
                    break;
                }
            }
            default: {
                if (!isDigitCharCode(char.charCodeAt(0))) {
                    return false;
                } else {
                    gotDigit = true;
                }
            }
        }
    }

    return gotDigit;
}

/** @public */
export function parseIntStrict(value: string) {
    return isStringifiedInteger(value) ? parseInt(value, 10) : undefined;
}

// /** @public */
// export const isNumberRegex = /^\d*\.?\d*$/;

// /** @public */
// export function createIsIntlNumberRegex(decimalChar: string) {
//     const checkEscapedDecimalChar = checkEscapeCharForRegexOutsideCharClass(decimalChar);
//     return new RegExp('^\\d*' + checkEscapedDecimalChar + '?\\d*$');
// }

// /** @public */
// export function createIsGroupableIntlNumberRegex(groupingChar: string, decimalChar: string) {
//     const checkEscapedGroupingChar = checkEscapeCharForRegexInsideCharClass(groupingChar);
//     const checkEscapedDecimalChar = checkEscapeCharForRegexOutsideCharClass(decimalChar);
//     return new RegExp('^[\\d' + checkEscapedGroupingChar + ']*' + checkEscapedDecimalChar + '?\\d*$');
// }

/** @public */
export function isStringifiedNumber(value: string) {
    const length = value.length;

    let gotDecimal = false;
    let gotDigit = false;

    for (let i = 0; i < length; i++) {
        const char = value[i];
        switch (char) {
            case '-': {
                if (i !== 0) {
                    return false;
                } else {
                    break;
                }
            }
            case '.': {
                if (gotDecimal) {
                    return false;
                } else {
                    gotDecimal = true;
                    break;
                }
            }
            default: {
                if (!isDigitCharCode(char.charCodeAt(0))) {
                    return false;
                } else {
                    gotDigit = true;
                }
            }
        }
    }

    return gotDigit;
}

/** @public */
export function parseNumberStrict(value: string) {
    return isStringifiedNumber(value) ? Number(value) : undefined;
}

/** @public */
export function getErrorMessage(e: unknown, defaultMessage?: string): string {
    const attempt = tryGetErrorMessage(e);
    if (attempt !== undefined) {
        return attempt;
    } else {
        if (defaultMessage !== undefined) {
            return defaultMessage;
        } else {
            return 'Unknown Error';
        }
    }
}

/** @public */
export function tryGetErrorMessage(e: unknown): string | undefined {
    if (e instanceof Error) {
        return e.message;
    } else {
        if (typeof e === 'string') {
            return e;
        } else {
            return undefined;
        }
    }
}

/** @public */
export namespace SysTick {
    export type Time = number;
    export type Span = TimeSpan;

    export function now(): number {
        // performance.now() returns milliseconds elapsed since the 'time origin'.
        // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
        return performance.now();
    }

    export function toDate(time: Time): Date {
        const nowSpan = time + performance.timeOrigin;
        return new Date(nowSpan);
    }

    export function nowDate(): Date {
        return toDate(now());
    }

    export function compare(left: Time, right: Time): Span {
        return compareNumber(left, right);
    }

    export const MaxSpan = Number.MAX_SAFE_INTEGER;
}

/** @public */
export type OptionalKeys<T> = {
    [P in keyof T]?: T[P] | undefined;
};

/** @public */
export type OptionalValues<T> = {
    [P in keyof T]: T[P] | undefined;
};

/** @public */
export function isStringKeyValueObjectEqual(left: Record<string, string>, right: Record<string, string>) {
    const leftKeys: string[] = [];
    let leftKeyCount = 0;
    for (const key in left) {
        if (left[key] !== right[key]) {
            return false;
        }
        leftKeys[leftKeyCount++] = key;
    }

    for (const key in right) {
        if (!leftKeys.includes(key)) {
            return false;
        }
    }

    return true;
}

/** @public */
export function dateToUtcYyyyMmDd(value: Date) {
    const year = value.getUTCFullYear();
    const yearStr = year.toString(10);
    const month = value.getUTCMonth() + 1;
    let monthStr = month.toString(10);
    if (monthStr.length === 1) {
        monthStr = '0' + monthStr;
    }
    const dayOfMonth = value.getUTCDate();
    let dayOfMonthStr = dayOfMonth.toString(10);
    if (dayOfMonthStr.length === 1) {
        dayOfMonthStr = '0' + dayOfMonthStr;
    }

    return yearStr + monthStr + dayOfMonthStr;
}

/** @public */
export function dateToDashedYyyyMmDd(date: Date, utc: boolean): string {
    let year: Integer;
    let month: Integer;
    let day: Integer;
    if (utc) {
        year = date.getUTCFullYear();
        month = date.getUTCMonth();
        day = date.getUTCDate();
    } else {
        year = date.getFullYear();
        month = date.getMonth();
        day = date.getDate();
    }
    const monthIndex = month + 1;

    const yearStr = year.toString(10);
    let monthStr = monthIndex.toString(10);
    if (monthStr.length === 1) {
        monthStr = '0' + monthStr;
    }
    let dayStr = day.toString(10);
    if (dayStr.length === 1) {
        dayStr = '0' + dayStr;
    }

    return `${yearStr}-${monthStr}-${dayStr}`;
}

/** @public */
export function isToday(date: Date): boolean {
    const now = new Date();
    if (now.getDate() !== date.getDate()) {
        return false;
    }
    if (now.getMonth() !== date.getMonth()) {
        return false;
    }
    if (now.getFullYear() !== date.getFullYear()) {
        return false;
    }
    return true;
}

/** @public */
export function isSameDay(dateA: Date, dateB: Date): boolean {
    if (dateA.getDate() !== dateB.getDate()) {
        return false;
    }
    if (dateA.getMonth() !== dateB.getMonth()) {
        return false;
    }
    if (dateA.getFullYear() !== dateB.getFullYear()) {
        return false;
    }
    return true;
}

/** @public */
export function addDays(date: Date, count: Integer) {
    const result = new Date(date.getTime());
    result.setDate(result.getDate() + count);
    return result;
}

/** @public */
export function incDateByDays(date: Date, count: Integer) {
    date.setDate(date.getDate() + count);
}

/** @public */
export function dateToDateOnlyIsoString(value: Date) {
    const year = value.getUTCFullYear();
    const yearStr = year.toFixed(0);
    const yearStrLength = yearStr.length;
    if (yearStrLength < 4) {
        yearStr.padStart(4 - yearStrLength, '0');
    }

    const month = value.getUTCMonth() + 1;
    let monthStr = month.toFixed(0);
    if (monthStr.length === 1) {
        monthStr = '0' + monthStr;
    }

    const dayOfMonth = value.getUTCDate();
    let dayOfMonthStr = dayOfMonth.toFixed(0);
    if (dayOfMonthStr.length === 1) {
        dayOfMonthStr = '0' + dayOfMonthStr;
    }

    // Note that Date.parse() interprets this as UTC
    return yearStr + '-' + monthStr + '-' + dayOfMonthStr;
}

/** @public */
export function moveElementInArray<T>(array: T[], fromIndex: number, toIndex: number) {
    if (toIndex > fromIndex) {
        const item = array[fromIndex];
        for (let i = fromIndex; i < toIndex; i++) {
            array[i] = array[i + 1];
        }
        array[toIndex] = item;
    } else {
        if (toIndex < fromIndex) {
            const item = array[fromIndex];
            for (let i = fromIndex; i > toIndex; i--) {
                array[i] = array[i - 1];
            }
            array[toIndex] = item;
        }
    }
}

/** @public */
export function moveIndexedElementsInArrayOnePositionTowardsStartWithSquash<T>(array: T[], elementIndices: Integer[]) {
    let lowestDestinationIndex = 0;
    const elementIndicesCount = elementIndices.length;
    elementIndices.sort((left, right) => left - right);
    for (let i = 0; i < elementIndicesCount; i++) {
        const elementIndex = elementIndices[i];
        const destinationIndex = elementIndex - 1;
        if (elementIndex > lowestDestinationIndex) {
            // swap places with previous in array
            const value = array[elementIndex];
            array[elementIndex] = array[destinationIndex];
            array[destinationIndex] = value;
        }
        if (destinationIndex === lowestDestinationIndex) {
            lowestDestinationIndex++;
        }
    }
}

/** @public */
export function moveIndexedElementsInArrayOnePositionTowardsEndWithSquash<T>(array: T[], elementIndices: Integer[]) {
    let highestDestinationIndex = array.length - 1;
    const elementIndicesCount = elementIndices.length;
    elementIndices.sort((left, right) => left - right);
    for (let i = elementIndicesCount - 1; i >= 0 ; i--) {
        const elementIndex = elementIndices[i];
        const destinationIndex = elementIndex + 1;
        if (elementIndex < highestDestinationIndex) {
            // swap places with successor in array
            const value = array[elementIndex];
            array[elementIndex] = array[destinationIndex];
            array[destinationIndex] = value;
        }
        if (destinationIndex === highestDestinationIndex) {
            highestDestinationIndex--;
        }
    }
}

/** @public */
export function moveElementsInArray<T>(array: T[], fromIndex: Integer, toIndex: Integer, count: Integer) {
    const temp = array.slice(fromIndex, fromIndex + count);
    if (fromIndex < toIndex) {
        for (let i = fromIndex; i < toIndex; i++) {
            array[i] = array[i + count];
        }
    } else {
        for (let i = fromIndex - 1; i >= toIndex; i--) {
            array[i + count] = array[i];
        }
    }

    for (let i = 0; i < count; i++) {
        array[toIndex + i] = temp[i];
    }
}

/** @public */
export function shuffleElementsUpInArray<T>(array: T[], index: Integer, count: Integer) {
    // will overwrite elements at top of array
    const elementCount = array.length;
    let dstIdx = elementCount - 1;
    for (let srcIdx = dstIdx - count; srcIdx >= index; srcIdx--) {
        array[dstIdx--] = array[srcIdx];
    }
}

/** @public */
export function uniqueElementArraysOverlap<T>(left: readonly T[], right: readonly T[]) {
    // order of elements is ignored
    for (let i = 0; i < left.length; i++) {
        if (right.includes(left[i])) {
            return true;
        }
    }
    return false;
}

/** @public */
export function getUniqueElementArraysOverlapElements<T>(left: readonly T[], right: readonly T[]) {
    const result: T[] = [];
    for (let i = 0; i < left.length; i++) {
        const element = left[i];
        if (right.includes(element)) {
            result.push(element);
        }
    }
    return result;
}

/** @public */
export function getElementDocumentPosition(element: HTMLElement): { left: number; top: number } {
    const domRect = element.getBoundingClientRect();
    return {
        left: domRect.left + globalThis.scrollX,
        top: domRect.top + globalThis.scrollY,
    };


    // let xPos = 0;
    // let yPos = 0;

    // while (element !== null) {
    //     if (element.tagName === 'BODY') {
    //         // deal with browser quirks with body/window/document and page scroll
    //         const xScroll = element.scrollLeft || document.documentElement.scrollLeft;
    //         const yScroll = element.scrollTop || document.documentElement.scrollTop;

    //         xPos += (element.offsetLeft - xScroll + element.clientLeft);
    //         yPos += (element.offsetTop - yScroll + element.clientTop);
    //     } else {
    //         // for all other non-BODY elements
    //         xPos += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    //         yPos += (element.offsetTop - element.scrollTop + element.clientTop);
    //     }

    //     element = element.offsetParent as HTMLElement;
    // }

    // return {
    //     left: xPos,
    //     top: yPos
    // };
}

/** @public */
export function getElementDocumentPositionRect(element: HTMLElement): Rect {
    const domRect = element.getBoundingClientRect();
    return {
        left: domRect.left + globalThis.scrollX,
        top: domRect.top + globalThis.scrollY,
        width: domRect.width,
        height: domRect.height,
    };
}

/** @public */
export function createRandomUrlSearch() {
    return '?random=' + Date.now().toString(36) + nanoid();
}

/** @public */
export function checkLimitTextLength(text: string, maxTextLength: number | undefined) {
    if (maxTextLength !== undefined) {
        if (text.length > maxTextLength) {
            text = text.substring(0, maxTextLength - 3) + '...';
        }
    }
    return text;
}
