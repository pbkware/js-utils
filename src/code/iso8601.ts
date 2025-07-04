
import type { Integer } from './types';
import { isDigitCharCode, mSecsPerHour, mSecsPerMin, parseIntStrict, parseNumberStrict } from './utils';

/** @public */
export namespace Iso8601 {
    const datePartLength = 10;
    const hoursMinutesSecondsPartLength = 8;
    const nonZeroOffsetPartLength = 5;
    const timeAnnouncerChar = 'T';
    const millisecondsAnnouncerChar = '.';
    const yearMonthDaySeparator = '-';
    const hoursMonthsSecondsSeparatorChar = ':';
    const utcOffsetChar = 'Z';
    const positiveOffsetChar = '+';
    const negativeOffsetChar = '-';
    const yyyymmddDatePartLength = 8;

    export interface ParseResult {
        utcDate: Date;
        offset: Integer;
    }

    /** Similar to Extended but with some limitations */
    export function parseLimited(value: string): ParseResult | undefined {
        const valueLength = value.length;
        let hours: number;
        let minutes: number;
        let seconds: number;
        let milliseconds: number;
        let offset: Integer;
        const { nextIdx: afterDateNextIdx, year, month, day } = parseDateIntoParts(value);
        let nextIdx = afterDateNextIdx;
        if (nextIdx < 0) {
            return undefined;
        } else {
            if (nextIdx === valueLength) {
                hours = 0;
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
                offset = 0;
            } else {
                if (value[nextIdx] !== timeAnnouncerChar) {
                    hours = 0;
                    minutes = 0;
                    seconds = 0;
                    milliseconds = 0;
                    offset = 0;
                } else {
                    const timeParts = parseTimeIntoParts(value, nextIdx + 1);
                    nextIdx = timeParts.nextIdx;
                    if (nextIdx < 0) {
                        return undefined;
                    } else {
                        hours = timeParts.hours;
                        minutes = timeParts.minutes;
                        seconds = timeParts.seconds;
                    }

                    if (nextIdx === valueLength) {
                        milliseconds = 0;
                    } else {
                        if (value[nextIdx] !== millisecondsAnnouncerChar) {
                            milliseconds = 0;
                        } else {
                            const millisecondsParseResult = parseMilliseconds(value, nextIdx + 1);
                            nextIdx = millisecondsParseResult.nextIdx;
                            if (nextIdx < 0) {
                                return undefined;
                            } else {
                                milliseconds = millisecondsParseResult.milliseconds;
                            }
                        }
                    }
                }

                if (nextIdx === valueLength) {
                    offset = 0;
                } else {
                    const offsetParseResult = parseOffset(value, nextIdx);
                    nextIdx = offsetParseResult.nextIdx;
                    if (nextIdx < 0) {
                        return undefined;
                    } else {
                        offset = offsetParseResult.offset;

                        if (nextIdx !== valueLength) {
                            value.trimEnd();
                            if (nextIdx !== value.length) {
                                return undefined;
                            }
                        }
                    }
                }
            }
        }

        // got required values
        const dateMilliseconds = Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds);

        return {
            utcDate: new Date(dateMilliseconds - offset), // Note that dateMilliseconds is actually in offset timezone
            offset,
        };
    }

    export interface DateParts {
        nextIdx: Integer;
        year: Integer;
        month: Integer;
        day: Integer;
    }

    export function parseDateIntoParts(value: string): DateParts {
        const nextIdx = datePartLength;
        if (value.length < nextIdx || value[4] !== yearMonthDaySeparator || value[7] !== yearMonthDaySeparator) {
            return {
                nextIdx: -1,
                year: 0,
                month: 0,
                day: 0
            };
        } else {
            const yearStr = value.substring(0, 4);
            const year = parseIntStrict(yearStr);
            const monthStr = value.substring(5, 7);
            const month = parseIntStrict(monthStr);
            const dayStr = value.substring(8, 10);
            const day = parseIntStrict(dayStr);

            if (year === undefined || month === undefined || day === undefined) {
                return {
                    nextIdx: -1,
                    year: 0,
                    month: 0,
                    day: 0
                };
            } else {
                return {
                    nextIdx,
                    year,
                    month,
                    day
                };
            }
        }
    }

    // Extended format (not used in Zenith)
    export function parseYyyymmddDateIntoParts(value: string): DateParts {
        const nextIdx = yyyymmddDatePartLength;
        if (value.length < nextIdx) {
            return {
                nextIdx: -1,
                year: 0,
                month: 0,
                day: 0
            };
        } else {
            const yearStr = value.substring(0, 4);
            const year = parseIntStrict(yearStr);
            const monthStr = value.substring(4, 6);
            const month = parseIntStrict(monthStr);
            const dayStr = value.substring(6, 8);
            const day = parseIntStrict(dayStr);

            if (year === undefined || month === undefined || day === undefined) {
                return {
                    nextIdx: -1,
                    year: 0,
                    month: 0,
                    day: 0
                };
            } else {
                return {
                    nextIdx,
                    year,
                    month,
                    day
                };
            }
        }
    }

    interface TimeParts {
        nextIdx: Integer;
        hours: Integer;
        minutes: Integer;
        seconds: Integer;
    }

    function parseTimeIntoParts(value: string, idx: Integer): TimeParts {
        const nextIdx = idx + hoursMinutesSecondsPartLength;
        if (value.length < nextIdx ||
                value[idx + 2] !== hoursMonthsSecondsSeparatorChar ||
                value[idx + 5] !== hoursMonthsSecondsSeparatorChar) {
            return {
                nextIdx: -1,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        } else {
            const hoursStr = value.substring(idx, idx + 2);
            const hours = parseIntStrict(hoursStr);
            const minutesStr = value.substring(idx + 3, idx + 5);
            const minutes = parseIntStrict(minutesStr);
            const secondsStr = value.substring(idx + 6, idx + 8);
            const seconds = parseIntStrict(secondsStr);

            if (hours === undefined || minutes === undefined || seconds === undefined) {
                return {
                    nextIdx: -1,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                };
            } else {
                return {
                    nextIdx,
                    hours,
                    minutes,
                    seconds,
                };
            }
        }
    }

    interface MillisecondsParseResult {
        nextIdx: Integer;
        milliseconds: number;
    }

    function parseMilliseconds(value: string, idx: Integer): MillisecondsParseResult {
        const valueLength = value.length;
        let nextIdx = valueLength;
        for (let i = idx; i < valueLength; i++) {
            const charCode = value.charCodeAt(i);
            if (!isDigitCharCode(charCode)) {
                nextIdx = i;
                break;
            }
        }

        const secondsStr = '0.' + value.substring(idx, nextIdx);
        const seconds = parseNumberStrict(secondsStr);
        if (seconds === undefined) {
            return {
                nextIdx: -1,
                milliseconds: 0,
            };
        } else {
            return {
                nextIdx,
                milliseconds: seconds * 1000,
            };
        }
    }

    interface OffsetParseResult {
        nextIdx: Integer;
        offset: Integer;
    }

    function parseOffset(value: string, idx: Integer): OffsetParseResult {
        if (value.length <= idx) {
            return {
                nextIdx: -1,
                offset: 0,
            };
        } else {
            switch (value[idx]) {
                case utcOffsetChar: {
                    return {
                        nextIdx: idx + 1,
                        offset: 0,
                    };
                }
                case positiveOffsetChar: {
                    return parseNonZeroOffset(value, idx + 1);
                }
                case negativeOffsetChar: {
                    const negativeOffsetResult = parseNonZeroOffset(value, idx + 1);
                    negativeOffsetResult.offset = negativeOffsetResult.offset * -1;
                    return negativeOffsetResult;
                }
                default: {
                    return {
                        nextIdx: -1,
                        offset: 0,
                    };
                }
            }
        }
    }

    function parseNonZeroOffset(value: string, idx: Integer): OffsetParseResult {
        const nextIdx = idx + nonZeroOffsetPartLength;
        if (value.length < nextIdx || value[idx + 2] !== hoursMonthsSecondsSeparatorChar) {
            return {
                nextIdx: -1,
                offset: 0,
            };
        } else {
            const hoursStr = value.substring(idx, idx + 2);
            const hours = parseIntStrict(hoursStr);
            const minutesStr = value.substring(idx + 3, idx + 5);
            const minutes = parseIntStrict(minutesStr);

            if (hours === undefined || hours < 0 || hours >= 24 || minutes === undefined || minutes < 0 || minutes >= 60) {
                return {
                    nextIdx: -1,
                    offset: 0,
                };
            } else {
                const offset = hours * mSecsPerHour + minutes * mSecsPerMin;
                return {
                    nextIdx,
                    offset,
                };
            }
        }
    }
}
