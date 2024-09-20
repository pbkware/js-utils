/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AssertInternalError } from '../internal-error';
import { Integer } from '../types';
import { parseIntStrict, parseNumberStrict } from '../utils';

export namespace TypedKeyValueSettings {
    const _numberFormat = new Intl.NumberFormat(TypedKeyValueSettings.locale, { useGrouping: false });
    const _integerFormat = new Intl.NumberFormat(TypedKeyValueSettings.locale, { useGrouping: false,  maximumFractionDigits: 0 });

    export function formatString(value: string) {
        return value;
    }

    export function parseString<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>) {
        const { info, value } = pushValue;
        if (value !== undefined) {
            return value;
        } else {
            const defaultValue = info.defaulter();
            if (defaultValue !== undefined) {
                return defaultValue;
            } else {
                throw new AssertInternalError('TKVSGPS', info.name);
            }
        }
    }

    export function formatChar(value: string) {
        if (value.length >= 2) {
            value = value[0];
        }
        return value;
    }

    export function parseChar<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>) {
        const { info, value } = pushValue;
        if (value === undefined) {
            return parseDefaultChar(info);
        } else {
            const parsedValue = tryParseCharText(value);
            if (parsedValue === undefined) {
                return parseDefaultChar(info);
            } else {
                return parsedValue;
            }
        }
    }

    export function tryParseCharText(value: string) {
        switch (value.length) {
            case 0: return undefined;
            case 1: return value;
            default: return value[0];
        }
    }

    export function formatEnumString(value: string): TypedKeyValueSettings.EnumString {
        return value;
    }

    export function parseEnumString<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>): TypedKeyValueSettings.EnumString {
        const { info, value } = pushValue;
        if (value !== undefined) {
            return value;
        } else {
            const defaultValue = info.defaulter();
            if (defaultValue === undefined) {
                throw new AssertInternalError('TKVSGPES233999');
            } else {
                return defaultValue;
            }
        }
    }

    export function formatUndefinableEnumString(value: TypedKeyValueSettings.EnumString | undefined) {
        return value;
    }

    export function formatEnumArrayString(value: string): TypedKeyValueSettings.EnumString {
        return value;
    }

    export function parseEnumArrayString<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>): TypedKeyValueSettings.EnumString {
        const { info, value } = pushValue;
        if (value !== undefined) {
            return value;
        } else {
            const defaultValue = info.defaulter();
            if (defaultValue === undefined) {
                throw new AssertInternalError('TKVSGPES233988');
            } else {
                return defaultValue;
            }
        }
    }

    export function formatBoolean(value: boolean | undefined) {
        if (value === undefined) {
            return undefined;
        } else {
            return value ? TypedKeyValueSettings.BooleanString.trueString : TypedKeyValueSettings.BooleanString.falseString;
        }
    }

    export function parseBoolean<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>) {
        const { info, value } = pushValue;
        if (value === undefined) {
            return parseDefaultBoolean(info);
        } else {
            const parsedValue = tryParseBooleanText(value);
            if (parsedValue === undefined) {
                return parseDefaultBoolean(info);
            } else {
                return parsedValue;
            }
        }
    }

    export function tryParseBooleanText(value: string) {
        switch (value) {
            case TypedKeyValueSettings.BooleanString.falseString: return false;
            case TypedKeyValueSettings.BooleanString.trueString: return true;
            default: return undefined;
        }
    }

    export function formatInteger(value: Integer) {
        return _integerFormat.format(value);
    }

    export function parseInteger<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>) {
        const { info, value } = pushValue;
        if (value === undefined || value === '') {
            return parseDefaultInteger(info);
        } else {
            const parsedValue = tryParseIntegerText(value);
            if (parsedValue === undefined) {
                return parseDefaultInteger(info);
            } else {
                return parsedValue;
            }
        }
    }

    export function tryParseIntegerText(value: string) {
        return parseIntStrict(value);
    }

    export function formatUndefinableInteger(value: Integer | undefined) {
        if (value === undefined) {
            return '';
        } else {
            return _integerFormat.format(value);
        }
    }

    export function parseUndefinableInteger<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>) {
        const { info, value } = pushValue;
        if (value === undefined) {
            return parseDefaultUndefinableInteger(info);
        } else {
            if (value === '') {
                return undefined;
            } else {
                const parsedValue = tryParseIntegerText(value);
                if (parsedValue === undefined) {
                    return parseDefaultUndefinableInteger(info);
                } else {
                    return parsedValue;
                }
            }
        }
    }

    export function formatNumber(value: number) {
        return _numberFormat.format(value);
    }

    export function parseNumber<CategoryId extends Integer>(pushValue: TypedKeyValueSettings.PushValue<CategoryId>) {
        const { info, value } = pushValue;
        if (value === undefined) {
            return parseDefaultNumber(info);
        } else {
            const parsedValue = tryParseNumberText(value);
            if (parsedValue === undefined) {
                return parseDefaultNumber(info);
            } else {
                return parsedValue;
            }
        }
    }

    export function tryParseNumberText(value: string) {
        return parseNumberStrict(value);
    }

    function parseDefaultChar<CategoryId extends Integer>(info: TypedKeyValueSettings.Info<CategoryId>) {
        const defaultValueText = info.defaulter();
        if (defaultValueText === undefined) {
            throw new AssertInternalError('TKVSGPDBD222982342', defaultValueText);
        } else {
            const parsedDefaultValue = tryParseCharText(defaultValueText);
            if (parsedDefaultValue !== undefined) {
                return parsedDefaultValue;
            } else {
                throw new AssertInternalError('TKVSGPDBP222982342', defaultValueText);
            }
        }
    }

    function parseDefaultBoolean<CategoryId extends Integer>(info: TypedKeyValueSettings.Info<CategoryId>) {
        const defaultValueText = info.defaulter();
        if (defaultValueText === undefined) {
            throw new AssertInternalError('TKVSGPDBD222982342', defaultValueText);
        } else {
            const parsedDefaultValue = tryParseBooleanText(defaultValueText);
            if (parsedDefaultValue !== undefined) {
                return parsedDefaultValue;
            } else {
                throw new AssertInternalError('TKVSGPDBP222982342', defaultValueText);
            }
        }
    }

    function parseDefaultInteger<CategoryId extends Integer>(info: TypedKeyValueSettings.Info<CategoryId>) {
        const defaultValueText = info.defaulter();
        if (defaultValueText === undefined) {
            throw new AssertInternalError('TKVSGPDID199534775', defaultValueText);
        } else {
            const parsedDefaultValue = tryParseIntegerText(defaultValueText);
            if (parsedDefaultValue !== undefined) {
                return parsedDefaultValue;
            } else {
                throw new AssertInternalError('TKVSGPDIP199534775', defaultValueText);
            }
        }
    }

    function parseDefaultUndefinableInteger<CategoryId extends Integer>(info: TypedKeyValueSettings.Info<CategoryId>) {
        const defaultValueText = info.defaulter();
        if (defaultValueText === undefined || defaultValueText === '') {
            return undefined;
        } else {
            const parsedDefaultValue = tryParseIntegerText(defaultValueText);
            if (parsedDefaultValue !== undefined) {
                return parsedDefaultValue;
            } else {
                throw new AssertInternalError('TKVSGPDI199534775', defaultValueText);
            }
        }
    }

    function parseDefaultNumber<CategoryId extends Integer>(info: TypedKeyValueSettings.Info<CategoryId>) {
        const defaultValueText = info.defaulter();
        if (defaultValueText === undefined) {
            throw new AssertInternalError('TKVSGPDND121200934', defaultValueText);
        } else {
            const parsedDefaultValue = tryParseNumberText(defaultValueText);
            if (parsedDefaultValue !== undefined) {
                return parsedDefaultValue;
            } else {
                throw new AssertInternalError('TKVSGPDNP121200934', defaultValueText);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function parseDefaultUndefinableNumber<CategoryId extends Integer>(info: TypedKeyValueSettings.Info<CategoryId>) {
        const defaultValueText = info.defaulter();
        if (defaultValueText === undefined || defaultValueText === '') {
            return undefined;
        } else {
            const parsedDefaultValue = tryParseNumberText(defaultValueText);
            if (parsedDefaultValue !== undefined) {
                return parsedDefaultValue;
            } else {
                throw new AssertInternalError('TKVSGPDNP121200934', defaultValueText);
            }
        }
    }
}

export namespace TypedKeyValueSettings {
    export const locale = 'en';
    export type EnumString = string;

    export type DefaultFunction = (this: void) => string | undefined;
    export type GetFormattedValueFunction = (this: void) => string | undefined;
    export interface PushValue<CategoryId extends Integer> {
        info: Info<CategoryId>;
        value: string | undefined;
    }
    export type PushFunction<CategoryId extends Integer> = (this: void, value: PushValue<CategoryId>) => void;

    export interface Info<CategoryId extends Integer> {
        readonly id: Integer;
        readonly name: string;
        readonly categoryId: CategoryId;
        readonly defaulter: DefaultFunction;
        readonly getter: GetFormattedValueFunction;
        readonly pusher: PushFunction<CategoryId>;
    }

    export namespace BooleanString {
        export const falseString = 'false';
        export const trueString = 'true';
    }

    export class AssertDefaulterNotImplemented extends AssertInternalError {
        constructor(id: Integer) {
            super('TKVSADNI30093', id.toString());
        }
    }

    export class AssertGetterNotImplemented extends AssertInternalError {
        constructor(id: Integer) {
            super('TKVSAGNI30093', id.toString());
        }
    }

    export class AssertPusherNotImplemented extends AssertInternalError {
        constructor(id: Integer) {
            super('TKVSAPNI30093', id.toString());
        }
    }
}
