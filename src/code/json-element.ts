
import { Decimal } from 'decimal.js-light';
import { DecimalFactory } from './decimal-factory';
import { UnreachableCaseError } from './internal-error';
import { Err, Ok, Result } from './result';
import { Guid, Integer, Json, JsonValue } from './types';
import { dateToDateOnlyIsoString, deepExtendObject } from './utils';

/** @public */
export class JsonElement {
    private _json: JsonElement.UndefinableJsonValueRecord;

    constructor(jsonObject?: JsonElement.UndefinableJsonValueRecord | Json) {
        this._json = jsonObject ?? {};
    }

    get json(): Json { return this._json as Json; }

    clear(): void {
        this._json = {};
    }

    shallowAssign(element: JsonElement | undefined): void {
        if (element === undefined) {
            this._json = {};
        } else {
            const json = element.json;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (json === undefined) {
                this._json = {};
            } else {
                this._json = element.json;
            }
        }
    }

    deepExtend(other: Json): void {
        deepExtendObject(this._json, other);
    }

    stringify(): string {
        return JSON.stringify(this._json);
    }

    parse(jsonText: string): Result<void, JsonElement.ErrorId.InvalidJsonText> {
        try {
            this._json = JSON.parse(jsonText) as Json;
            return new Ok(undefined);
        } catch {
            this.clear();
            return new Err(JsonElement.ErrorId.InvalidJsonText);
        }
    }

    hasName(name: string): boolean {
        return name in this._json;
    }

    tryGetElement(name: string): Result<JsonElement, JsonElement.ErrorId.ElementIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeObject> {
        const getResult = this.tryGetJsonObject(name);
        if (getResult.isErr()) {
            const errorId = getResult.error;
            switch (errorId) {
                case JsonElement.ErrorId.JsonValueIsNotOfTypeObject: return new Err(errorId);
                case JsonElement.ErrorId.JsonValueIsNotDefined: return new Err(JsonElement.ErrorId.ElementIsNotDefined);
                default:
                    throw new UnreachableCaseError('JETGE67125', errorId);
            }
        } else {
            const jsonObject = getResult.value;
            const element = new JsonElement(jsonObject);
            return new Ok(element);
        }
    }

    tryGetUndefinableElement(name: string): Result<JsonElement | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeObject> {
        const getResult = this.tryGetUndefinableJsonObject(name);
        if (getResult.isErr()) {
            const errorId = getResult.error;
            return new Err(errorId);
        } else {
            const jsonObject = getResult.value;
            const element = new JsonElement(jsonObject);
            return new Ok(element);
        }
    }

    tryGetJsonValue(name: string): JsonValue | undefined {
        return this._json[name];
    }

    tryGetNativeObject(name: string): Result<object, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeObject> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToJson(jsonValue);
        }
    }

    tryGetUndefinableNativeObject(name: string): Result<object | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeObject> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToJson(jsonValue);
        }
    }

    tryGetJsonObject(name: string): Result<Json, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeObject> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToJson(jsonValue);
        }
    }

    tryGetUndefinableJsonObject(name: string): Result<Json | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeObject> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToJson(jsonValue);
        }
    }

    tryGetString(name: string): Result<string, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToString(jsonValue);
        }
    }

    tryGetStringOrNull(name: string): Result<string | null, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeStringOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToStringOrNull(jsonValue);
        }
    }

    tryGetUndefinableString(name: string): Result<string | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToString(jsonValue);
        }
    }

    tryGetUndefinableStringOrNull(name: string): Result<string | null | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeStringOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToStringOrNull(jsonValue);
        }
    }

    getString(name: string, defaultValue: string) {
        const tryResult = this.tryGetString(name);
        if (tryResult.isOk()) {
            return tryResult.value;
        } else {
            return defaultValue;
        }
    }

    getStringOrUndefined(name: string) {
        const tryResult = this.tryGetString(name);
        if (tryResult.isOk()) {
            return tryResult.value;
        } else {
            return undefined;
        }
    }

    tryGetNumber(name: string): Result<number, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeNumber> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToNumber(jsonValue);
        }
    }

    tryGetNumberOrNull(name: string): Result<number | null, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeNumberOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToNumberOrNull(jsonValue);
        }
    }

    tryGetUndefinableNumber(name: string): Result<number | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeNumber> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToNumber(jsonValue);
        }
    }

    tryGetUndefinableNumberOrNull(name: string): Result<number | null | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeNumberOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToNumberOrNull(jsonValue);
        }
    }

    tryGetDefinedNumber(name: string): Result<number | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeNumber> {
        const jsonValue = this._json[name];
        if (typeof jsonValue === 'number') {
            return new Ok(jsonValue);
        } else {
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeNumber);
            }
        }
    }

    getNumber(name: string, defaultValue: number) {
        const tryResult = this.tryGetNumber(name);
        if (tryResult.isOk()) {
            return tryResult.value;
        } else {
            return defaultValue;
        }
    }

    getNumberOrUndefined(name: string): number | undefined {
        const tryResult = this.tryGetNumber(name);
        if (tryResult.isOk()) {
            return tryResult.value;
        } else {
            return undefined;
        }
    }

    tryGetBoolean(name: string): Result<boolean, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeBoolean> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToBoolean(jsonValue);
        }
    }

    tryGetBooleanOrNull(name: string): Result<boolean | null, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeBooleanOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToBooleanOrNull(jsonValue);
        }
    }

    tryGetUndefinableBoolean(name: string): Result<boolean | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeBoolean> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToBoolean(jsonValue);
        }
    }

    tryGetUndefinableBooleanOrNull(name: string): Result<boolean | null | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeBooleanOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToBooleanOrNull(jsonValue);
        }
    }

    getBoolean(name: string, defaultValue: boolean) {
        const tryResult = this.tryGetBoolean(name);
        if (tryResult.isOk()) {
            return tryResult.value;
        } else {
            return defaultValue;
        }
    }

    getBooleanOrUndefined(name: string) {
        const tryResult = this.tryGetBoolean(name);
        if (tryResult.isOk()) {
            return tryResult.value;
        } else {
            return undefined;
        }
    }

    tryGetElementArray(name: string): Result<JsonElement[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAnObject> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToElementArray(jsonValue);
        }
    }

    tryGetUndefinableElementArray(name: string): Result<JsonElement[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAnObject> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToElementArray(jsonValue);
        }
    }

    tryGetJsonObjectArray(name: string): Result<Json[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotJson> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToJsonObjectArray(jsonValue);
        }
    }

    tryGetUndefinableJsonObjectArray(name: string): Result<Json[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotJson> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToJsonObjectArray(jsonValue);
        }
    }

    tryGetStringArray(name: string): Result<string[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAString> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToStringArray(jsonValue);
        }
    }

    tryGetStringOrNullArray(name: string): Result<(string | null)[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAStringOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToStringOrNullArray(jsonValue);
        }
    }

    tryGetUndefinableStringArray(name: string): Result<string[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAString> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToStringArray(jsonValue);
        }
    }

    tryGetUndefinableStringOrNullArray(name: string): Result<(string | null)[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAStringOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToStringOrNullArray(jsonValue);
        }
    }

    tryGetNumberArray(name: string): Result<number[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotANumber> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToNumberArray(jsonValue);
        }
    }

    tryGetNumberOrNullArray(name: string): Result<(number | null)[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotANumberOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToNumberOrNullArray(jsonValue);
        }
    }

    tryGetUndefinableNumberArray(name: string): Result<number[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotANumber> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToNumberArray(jsonValue);
        }
    }

    tryGetUndefinableNumberOrNullArray(name: string): Result<(number | null)[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotANumberOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToNumberOrNullArray(jsonValue);
        }
    }

    tryGetBooleanArray(name: string): Result<boolean[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotABoolean> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToBooleanArray(jsonValue);
        }
    }

    tryGetBooleanOrNullArray(name: string): Result<(boolean | null)[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotABooleanOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToBooleanOrNullArray(jsonValue);
        }
    }

    tryGetUndefinableBooleanArray(name: string): Result<boolean[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotABoolean> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToBooleanArray(jsonValue);
        }
    }

    tryGetUndefinableBooleanOrNullArray(name: string): Result<(boolean | null)[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotABooleanOrNull> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToBooleanOrNullArray(jsonValue);
        }
    }

    tryGetAnyJsonValueArray(name: string): Result<JsonValue[], JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotAnArray> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToJsonValueArray(jsonValue);
        }
    }

    tryGetUndefinableAnyJsonValueArray(name: string): Result<JsonValue[] | undefined, JsonElement.ErrorId.JsonValueIsNotAnArray> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToJsonValueArray(jsonValue);
        }
    }

    tryGetInteger(name: string): Result<Integer, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeNumber> {
        return this.tryGetNumber(name);
    }

    tryGetUndefinableInteger(name: string): Result<Integer | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeNumber> {
        return this.tryGetUndefinableNumber(name);
    }

    getInteger(name: string, defaultValue: Integer) {
        const tryResult = this.tryGetInteger(name);
        return tryResult.isErr() ? defaultValue : tryResult.value;
    }

    getIntegerOrUndefined(name: string) {
        const tryResult = this.tryGetInteger(name);
        return tryResult.isErr() ? undefined : tryResult.value;
    }

    tryGetDate(name: string): Result<Date, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        const getStringResult = this.tryGetString(name);
        if (getStringResult.isErr()) {
            return getStringResult.createType();
        } else {
            // value should have format YYYY-MM-DD
            const date = new Date(getStringResult.value);
            return new Ok(date);
        }
    }

    tryGetUndefinableDate(name: string): Result<Date | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        const getStringResult = this.tryGetUndefinableString(name);
        if (getStringResult.isErr()) {
            return getStringResult.createType();
        } else {
            const stringValue = getStringResult.value;
            if (stringValue === undefined) {
                return new Ok(undefined);
            } else {
                // string value should have format YYYY-MM-DD
                const date = new Date(stringValue);
                return new Ok(date);
            }
        }
    }

    getDate(name: string, defaultValue: Date) {
        const tryResult = this.tryGetDate(name);
        return tryResult.isErr() ? defaultValue : tryResult.value;
    }

    tryGetDateTime(name: string): Result<Date, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        const getStringResult = this.tryGetString(name);
        if (getStringResult.isErr()) {
            return getStringResult.createType();
        } else {
            // value should have ISO format
            const date = new Date(getStringResult.value);
            return new Ok(date);
        }
    }

    tryGetUndefinableDateTime(name: string): Result<Date | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        const getStringResult = this.tryGetUndefinableString(name);
        if (getStringResult.isErr()) {
            return getStringResult.createType();
        } else {
            const stringValue = getStringResult.value;
            if (stringValue === undefined) {
                return new Ok(undefined);
            } else {
                // value should have ISO format
                const date = new Date(stringValue);
                return new Ok(date);
            }
        }
    }

    getDateTime(name: string, defaultValue: Date) {
        const tryResult = this.tryGetDateTime(name);
        return tryResult.isErr() ? defaultValue : tryResult.value;
    }

    tryGetGuid(name: string): Result<Guid, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        return this.tryGetString(name);
    }

    tryGetUndefinableGuid(name: string): Result<Guid | undefined, JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        return this.tryGetUndefinableString(name);
    }

    getGuid(name: string, defaultValue: Guid) {
        const tryResult = this.tryGetGuid(name);
        return tryResult.isErr() ? defaultValue : tryResult.value;
    }

    tryGetDecimal(
        name: string,
        decimalFactory: DecimalFactory,
    ): Result<Decimal, JsonElement.ErrorId.JsonValueIsNotDefined | JsonElement.ErrorId.InvalidDecimal | JsonElement.ErrorId.DecimalJsonValueIsNotOfTypeString> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotDefined);
        } else {
            return JsonElement.tryJsonValueToDecimal(jsonValue, decimalFactory);
        }
    }

    tryGetUndefinableDecimal(
        name: string,
        decimalFactory: DecimalFactory
    ): Result<Decimal | undefined, JsonElement.ErrorId.InvalidDecimal| JsonElement.ErrorId.DecimalJsonValueIsNotOfTypeString> {
        const jsonValue = this._json[name];
        if (jsonValue === undefined) {
            return new Ok(undefined);
        } else {
            return JsonElement.tryJsonValueToDecimal(jsonValue, decimalFactory);
        }
    }

    getDecimal(name: string, defaultValue: Decimal, decimalFactory: DecimalFactory): Decimal {
        const tryResult = this.tryGetDecimal(name, decimalFactory);
        return tryResult.isErr() ? defaultValue : tryResult.value;
    }

    newElement(name: string): JsonElement {
        const result = new JsonElement();
        this._json[name] = result._json;
        return result;
    }

    setElement(name: string, value: JsonElement | undefined) {
        if (value !== undefined) {
            this._json[name] = value._json;
        }
    }

    setJson(name: string, value: Json | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setJsonValue(name: string, value: JsonValue | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setString(name: string, value: string | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setNumber(name: string, value: number | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setBoolean(name: string, value: boolean | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setElementArray(name: string, value: JsonElement[] | undefined) {
        if (value !== undefined) {
            const valueObjArray = new Array<JsonElement.UndefinableJsonValueRecord>(value.length);
            for (let i = 0; i < value.length; i++) {
                valueObjArray[i] = value[i]._json;
            }
            this._json[name] = valueObjArray;
        }
    }

    setObjectArray(name: string, value: Json[] | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setStringArray(name: string, value: string[] | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setNumberArray(name: string, value: number[] | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setBooleanArray(name: string, value: boolean[] | undefined) {
        if (value !== undefined) {
            this._json[name] = value;
        }
    }

    setInteger(name: string, value: Integer | undefined) {
        if (value !== undefined) {
            this.setNumber(name, value);
        }
    }

    setDate(name: string, value: Date | undefined) {
        if (value !== undefined) {
            const jsonValue = dateToDateOnlyIsoString(value);
            this.setString(name, jsonValue);
        }
    }

    setDateTime(name: string, value: Date | undefined) {
        if (value !== undefined) {
            this.setString(name, value.toISOString());
        }
    }

    setGuid(name: string, value: Guid | undefined) {
        if (value !== undefined) {
            this.setString(name, value);
        }
    }

    setDecimal(name: string, value: Decimal | undefined) {
        if (value !== undefined) {
            this._json[name] = value.toJSON();
        }
    }

    forEach(callback: JsonElement.ForEachCallback) {
        Object.entries(this._json as Json).forEach((nameValue: [string, JsonValue], index: number) => {
            const [name, value] = nameValue;
            callback(name, value, index);
        });
    }

    forEachElement(callback: JsonElement.ForEachElementCallback) {
        Object.entries(this._json as Json).forEach((nameValue: [string, JsonValue], index: number) => {
            const [name, value] = nameValue;
            if (typeof value === 'object') {
                const valueAsJsonObject = value as Json;
                callback(name, new JsonElement(valueAsJsonObject), index);
            }
        });
    }

    forEachValue(callback: JsonElement.ForEachValueCallback) {
        Object.entries(this._json as Json).forEach((nameValue: [string, JsonValue], index: number) => {
            const [name, value] = nameValue;
            if (typeof value === 'object') {
                const valueAsJsonObject = value as Json;
                callback(name, valueAsJsonObject, index);
            }
        });
    }

    forEachString(callback: JsonElement.ForEachStringCallback) {
        Object.entries(this._json as Json).forEach((nameValue: [string, JsonValue], index: number) => {
            const [name, value] = nameValue;
            if (typeof value === 'string') {
                callback(name, value, index);
            }
        });
    }

    forEachNumber(callback: JsonElement.ForEachNumberCallback) {
        Object.entries(this._json as Json).forEach((nameValue: [string, JsonValue], index: number) => {
            const [name, value] = nameValue;
            if (typeof value === 'number') {
                callback(name, value, index);
            }
        });
    }

    forEachBoolean(callback: JsonElement.ForEachBooleanCallback) {
        Object.entries(this._json as Json).forEach((nameValue: [string, JsonValue], index: number) => {
            const [name, value] = nameValue;
            if (typeof value === 'boolean') {
                callback(name, value, index);
            }
        });
    }
}

/** @public */
export namespace JsonElement {
    export type ForEachCallback = (this: void, name: string, value: JsonValue, idx: Integer) => void;
    export type ForEachElementCallback = (this: void, name: string, value: JsonElement, idx: Integer) => void;
    export type ForEachValueCallback = (this: void, name: string, value: JsonValue, idx: Integer) => void;
    export type ForEachStringCallback = (this: void, name: string, value: string, idx: Integer) => void;
    export type ForEachNumberCallback = (this: void, name: string, value: number, idx: Integer) => void;
    export type ForEachBooleanCallback = (this: void, name: string, value: boolean, idx: Integer) => void;

    export type UndefinableJsonValueRecord = Record<string, JsonValue | undefined>;

    export const enum ErrorId {
        InvalidJsonText,
        ElementIsNotDefined,
        JsonValueIsNotDefined,
        JsonValueIsNotOfTypeObject,
        JsonValueIsNotOfTypeString,
        JsonValueIsNotOfTypeStringOrNull,
        JsonValueIsNotOfTypeNumber,
        JsonValueIsNotOfTypeNumberOrNull,
        JsonValueIsNotOfTypeBoolean,
        JsonValueIsNotOfTypeBooleanOrNull,
        DecimalJsonValueIsNotOfTypeString,
        InvalidDecimal,
        JsonValueIsNotAnArray,
        JsonValueArrayElementIsNotAnObject,
        JsonValueArrayElementIsNotJson,
        JsonValueArrayElementIsNotAString,
        JsonValueArrayElementIsNotAStringOrNull,
        JsonValueArrayElementIsNotANumber,
        JsonValueArrayElementIsNotANumberOrNull,
        JsonValueArrayElementIsNotABoolean,
        JsonValueArrayElementIsNotABooleanOrNull,
    }

    export function createRootElement(rootJson: UndefinableJsonValueRecord) {
        return new JsonElement(rootJson);
    }

    export function tryGetChildElement(parentElement: JsonElement, childName: string) {
        return parentElement.tryGetElement(childName);
    }

    export function tryJsonValueToJson(jsonValue: JsonValue): Result<Json, JsonElement.ErrorId.JsonValueIsNotOfTypeObject> {
        if (JsonValue.isJson(jsonValue)) {
            return new Ok(jsonValue);
        } else {
            return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeObject);
        }
    }

    export function tryJsonValueToString(jsonValue: JsonValue): Result<string, JsonElement.ErrorId.JsonValueIsNotOfTypeString> {
        if (typeof jsonValue === 'string') {
            return new Ok(jsonValue);
        } else {
            return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeString);
        }
    }

    export function tryJsonValueToStringOrNull(jsonValue: JsonValue): Result<string | null, JsonElement.ErrorId.JsonValueIsNotOfTypeStringOrNull> {
        if (jsonValue === null) {
            return new Ok(jsonValue);
        } else {
            if (typeof jsonValue === 'string') {
                return new Ok(jsonValue);
            } else {
                return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeStringOrNull);
            }
        }
    }

    export function tryJsonValueToNumber(jsonValue: JsonValue): Result<number, JsonElement.ErrorId.JsonValueIsNotOfTypeNumber> {
        if (typeof jsonValue === 'number') {
            return new Ok(jsonValue);
        } else {
            return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeNumber);
        }
    }

    export function tryJsonValueToNumberOrNull(jsonValue: JsonValue): Result<number | null, JsonElement.ErrorId.JsonValueIsNotOfTypeNumberOrNull> {
        if (jsonValue === null) {
            return new Ok(jsonValue);
        } else {
            if (typeof jsonValue === 'number') {
                return new Ok(jsonValue);
            } else {
                return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeNumberOrNull);
            }
        }
    }

    export function tryJsonValueToBoolean(jsonValue: JsonValue): Result<boolean, JsonElement.ErrorId.JsonValueIsNotOfTypeBoolean> {
        if (typeof jsonValue === 'boolean') {
            return new Ok(jsonValue);
        } else {
            return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeBoolean);
        }
    }

    export function tryJsonValueToBooleanOrNull(jsonValue: JsonValue): Result<boolean | null, JsonElement.ErrorId.JsonValueIsNotOfTypeBooleanOrNull> {
        if (jsonValue === null) {
            return new Ok(jsonValue);
        } else {
            if (typeof jsonValue === 'boolean') {
                return new Ok(jsonValue);
            } else {
                return new Err(JsonElement.ErrorId.JsonValueIsNotOfTypeBooleanOrNull);
            }
        }
    }

    export function tryJsonValueToElementArray(jsonValue: JsonValue): Result<JsonElement[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAnObject> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<JsonElement>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (typeof elementJsonValue === 'object') {
                    resultArray[i] = new JsonElement(elementJsonValue as UndefinableJsonValueRecord);
                } else {
                    return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotAnObject);
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToJsonObjectArray(jsonValue: JsonValue): Result<Json[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotJson> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<Json>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (JsonValue.isJson(elementJsonValue)) {
                    resultArray[i] = elementJsonValue;
                } else {
                    return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotJson);
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToStringArray(jsonValue: JsonValue): Result<string[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAString> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<string>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (typeof elementJsonValue === 'string') {
                    resultArray[i] = elementJsonValue;
                } else {
                    return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotAString);
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToStringOrNullArray(jsonValue: JsonValue): Result<(string | null)[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotAStringOrNull> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<string | null>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (elementJsonValue === null) {
                    resultArray[i] = elementJsonValue;
                } else {
                    if (typeof elementJsonValue === 'string') {
                        resultArray[i] = elementJsonValue;
                    } else {
                        return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotAStringOrNull);
                    }
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToNumberArray(jsonValue: JsonValue): Result<number[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotANumber> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<number>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (typeof elementJsonValue === 'number') {
                    resultArray[i] = elementJsonValue;
                } else {
                    return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotANumber);
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToNumberOrNullArray(jsonValue: JsonValue): Result<(number | null)[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotANumberOrNull> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<number | null>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (elementJsonValue === null) {
                    resultArray[i] = elementJsonValue;
                } else {
                    if (typeof elementJsonValue === 'number') {
                        resultArray[i] = elementJsonValue;
                    } else {
                        return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotANumberOrNull);
                    }
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToBooleanArray(jsonValue: JsonValue): Result<boolean[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotABoolean> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<boolean>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (typeof elementJsonValue === 'boolean') {
                    resultArray[i] = elementJsonValue;
                } else {
                    return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotABoolean);
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToBooleanOrNullArray(jsonValue: JsonValue): Result<(boolean | null)[], JsonElement.ErrorId.JsonValueIsNotAnArray | JsonElement.ErrorId.JsonValueArrayElementIsNotABooleanOrNull> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            const jsonValueArray = jsonValue as JsonValue[];
            const count = jsonValueArray.length;
            const resultArray = new Array<boolean | null>(count);
            for (let i = 0; i < count; i++) {
                const elementJsonValue = jsonValueArray[i];
                if (elementJsonValue === null) {
                    resultArray[i] = elementJsonValue;
                } else {
                    if (typeof elementJsonValue === 'boolean') {
                        resultArray[i] = elementJsonValue;
                    } else {
                        return new Err(JsonElement.ErrorId.JsonValueArrayElementIsNotABooleanOrNull);
                    }
                }
            }

            return new Ok(resultArray);
        }
    }

    export function tryJsonValueToJsonValueArray(jsonValue: JsonValue): Result<JsonValue[], JsonElement.ErrorId.JsonValueIsNotAnArray> {
        if (!Array.isArray(jsonValue)) {
            return new Err(JsonElement.ErrorId.JsonValueIsNotAnArray);
        } else {
            return new Ok(jsonValue);
        }
    }

    export function tryJsonValueToDecimal(
        jsonValue: JsonValue,
        decimalFactory: DecimalFactory
    ): Result<Decimal, JsonElement.ErrorId.InvalidDecimal| JsonElement.ErrorId.DecimalJsonValueIsNotOfTypeString> {
        if (typeof jsonValue === 'string') {
            try {
                const value = decimalFactory.newDecimal(jsonValue);
                return new Ok(value);
            } catch {
                return new Err(JsonElement.ErrorId.InvalidDecimal);
            }
        } else {
            return new Err(JsonElement.ErrorId.DecimalJsonValueIsNotOfTypeString);
        }
    }
}
