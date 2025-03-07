
import { AssertInternalError } from './internal-error';
import { ComparisonResult, type Integer } from './types';

/** @public */
export namespace BinaryFind {
    export interface Result {
        found: boolean;
        index: Integer;
    }

    /** @public */
    export type CompareItemFn<in T> = (this: void, item: T) => ComparisonResult;

    /** Finds any matching index.  Use if index values are unique
     * @public
     */
    export function any<T extends U, U = T>(
        values: T[],
        compareItemFn: CompareItemFn<U>
    ) {
        return rangedAny(values, compareItemFn, 0, values.length);
    }

    /** Finds any matching index in range.  Use if index values are unique
     * @public
     */
    export function rangedAny<T extends U, U = T>(
        values: T[],
        compareItemFn: CompareItemFn<U>,
        index: Integer,
        count: Integer
    ): Result {

        if (index < 0 || (index >= values.length && count > 0) || index + count - 1 >= values.length || count < 0) {
            throw new AssertInternalError('USRBS25632988827', `${index} ${values.length} ${count}`);
        } else {
            if (count === 0) {
                return {
                    found: false,
                    index
                };
            } else {
                let found = false;
                let l = index;
                let h = index + count - 1;
                while (l <= h) {
                    /* eslint-disable no-bitwise */
                    const mid = l + ((h - l) >> 1);
                    /* eslint-enable no-bitwise */
                    const cmp = compareItemFn(values[mid]);
                    if (cmp < ComparisonResult.LeftEqualsRight) {
                        l = mid + 1;
                    } else {
                        h = mid - 1;
                        if (cmp === ComparisonResult.LeftEqualsRight) {
                            found = true;
                            break;
                        }
                    }
                }
                return {
                    found,
                    index: l
                };
            }
        }
    }

    /** Finds earliest matching index.  Use if index values are not unique
     * @public
     */

    export function earliest<T extends U, U = T>(
        values: T[],
        compareItemFn: CompareItemFn<U>
    ) {
        return rangedEarliest(values, compareItemFn, 0, values.length);
    }

    /** Finds earliest matching index in range.  Use if index values are not unique
     * @public
     */
    export function rangedEarliest<T extends U, U = T>(
        values: T[],
        compareItemFn: CompareItemFn<U>,
        index: Integer,
        count: Integer
    ): Result {

        if (index < 0 || (index >= values.length && count > 0) || index + count - 1 >= values.length || count < 0) {
            throw new AssertInternalError('USRBS25632988827', `${index} ${values.length} ${count}`);
        } else {
            if (count === 0) {
                return {
                    found: false,
                    index
                };
            } else {
                let found = false;
                let l = index;
                let h = index + count - 1;
                while (l <= h) {
                    /* eslint-disable no-bitwise */
                    const mid = l + ((h - l) >> 1);
                    /* eslint-enable no-bitwise */
                    const cmp = compareItemFn(values[mid]);
                    if (cmp < ComparisonResult.LeftEqualsRight) {
                        l = mid + 1;
                    } else {
                        h = mid - 1;
                        if (cmp === ComparisonResult.LeftEqualsRight) {
                            found = true;
                        }
                    }
                }
                return {
                    found,
                    index: l
                };
            }
        }
    }

    /** Finds earliest matching index.  Use if index values are not unique
     * @public
     */
    export function latest<T extends U, U = T>(
        values: T[],
        compareItemFn: CompareItemFn<U>
    ) {
        return rangedLatest(values, compareItemFn, 0, values.length);
    }

    /** Finds latest matching index.  Use if index values are not unique
     * @public
     */
    export function rangedLatest<T extends U, U = T>(
        values: T[],
        compareItemFn: CompareItemFn<U>,
        index: Integer,
        count: Integer
    ): Result {

        if (index < 0 || (index >= values.length && count > 0) || index + count - 1 >= values.length || count < 0) {
            throw new AssertInternalError('USRBS25632988827', `${index} ${values.length} ${count}`);
        } else {
            if (count === 0) {
                return {
                    found: false,
                    index
                };
            } else {
                let found = false;
                let l = index;
                let h = index + count - 1;
                while (l <= h) {
                    /* eslint-disable no-bitwise */
                    const mid = l + ((h - l) >> 1);
                    /* eslint-enable no-bitwise */
                    const cmp = compareItemFn(values[mid]);
                    if (cmp > ComparisonResult.LeftEqualsRight) {
                        h = mid - 1;
                    } else {
                        l = mid + 1;
                        if (cmp === ComparisonResult.LeftEqualsRight) {
                            found = true;
                        }
                    }
                }
                return {
                    found,
                    index: found ? h : h + 1
                };
            }
        }
    }
}
