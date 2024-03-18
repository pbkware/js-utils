// (c) 2024 Xilytix Pty Ltd

import { UnreachableCaseError } from './internal-error';
import { Iso8601 } from './iso8601';
import { ComparisonResult, Integer } from './types';
import { compareDate, isDateEqual, mSecsPerMin, nullDate } from './utils';

/** @public */
export interface SourceTzOffsetDateTime {
    readonly utcDate: Date;
    readonly offset: Integer;
}

/** @public */
export namespace SourceTzOffsetDateTime {
    export const nullDateTime: SourceTzOffsetDateTime = {
        utcDate: nullDate,
        offset: 0,
    };

    export const enum TimezoneModeId {
        Utc,
        Local,
        Source,
    }

    /** The Date.toLocale.. functions will set date to local timezone.  So the adjustments need to take this into account */
    export function getTimezonedDate(value: SourceTzOffsetDateTime, adjustment: TimezoneModeId) {
        const utcDate = value.utcDate;
        switch (adjustment) {
            case TimezoneModeId.Utc:
                return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * mSecsPerMin);
            case TimezoneModeId.Local:
                return utcDate;
            case TimezoneModeId.Source:
                return new Date(value.utcDate.getTime() + utcDate.getTimezoneOffset() * mSecsPerMin + value.offset);
            default:
                throw new UnreachableCaseError('STODTTALRD45992844', adjustment);
        }
    }

    export function createCopy(value: SourceTzOffsetDateTime): SourceTzOffsetDateTime {
        return {
            utcDate: value.utcDate,
            offset: value.offset,
        };
    }

    export function createFromIso8601(value: string): SourceTzOffsetDateTime | undefined {
        return Iso8601.parseLimited(value);
    }

    export function newUndefinable(value: SourceTzOffsetDateTime | undefined) {
        if (value === undefined) {
            return undefined;
        } else {
            return createCopy(value);
        }
    }

    export function isEqual(left: SourceTzOffsetDateTime, right: SourceTzOffsetDateTime) {
        return isDateEqual(left.utcDate, right.utcDate) && left.offset === right.offset;
    }

    export function isUndefinableEqual(left: SourceTzOffsetDateTime | undefined, right: SourceTzOffsetDateTime | undefined) {
        if (left === undefined) {
            return right === undefined;
        } else {
            return right === undefined ? false : isEqual(left, right);
        }
    }

    export function isEqualToDate(offsetDate: SourceTzOffsetDateTime, date: Date) {
        return isDateEqual(offsetDate.utcDate, date);
    }

    export function compare(left: SourceTzOffsetDateTime, right: SourceTzOffsetDateTime): ComparisonResult {
        return compareDate(left.utcDate, right.utcDate);
    }

    export function compareUndefinable(left: SourceTzOffsetDateTime | undefined,
            right: SourceTzOffsetDateTime | undefined,
            undefinedIsLowest: boolean): ComparisonResult {
        if (left === undefined) {
            if (right === undefined) {
                return 0;
            } else {
                return undefinedIsLowest ? -1 : 1;
            }
        } else {
            if (right === undefined) {
                return undefinedIsLowest ? 1 : -1;
            } else {
                return compare(left, right);
            }
        }
    }
}
