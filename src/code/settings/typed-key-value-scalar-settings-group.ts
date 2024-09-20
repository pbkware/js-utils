/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { JsonElement } from '../json-element';
import { MultiEvent } from '../multi-event';
import { Integer } from '../types';
import { SettingsGroup } from './settings-group';
import { TypedKeyValueSettings } from './typed-key-value-settings';

export abstract class TypedKeyValueScalarSettingsGroup<CategoryId extends Integer> extends SettingsGroup {
    private _getFormattedSettingValuesMultiEvent = new MultiEvent<TypedKeyValueScalarSettingsGroup.GetFormattedSettingValuesEventHandler>();
    private _pushFormattedSettingValuesMultiEvent = new MultiEvent<TypedKeyValueScalarSettingsGroup.PushFormattedSettingValuesEventHandler>();

    protected abstract get idCount(): Integer;

    override load(elements: (JsonElement | undefined)[]) {
        const count = this.idCount;
        const pushValues = new Array<TypedKeyValueSettings.PushValue<CategoryId>>(count);
        const formattedSettingValues = new Array<TypedKeyValueScalarSettingsGroup.FormattedSettingValue>(count);
        for (let i = 0; i < count; i++) {
            const info = this.getInfo(i);
            const name = info.name;

            const element = elements[info.categoryId];
            let jsonValue: string | undefined;

            if (element === undefined) {
                jsonValue = undefined;
            } else {
                const jsonValueResult = element.tryGetString(name);
                if (jsonValueResult.isErr()) {
                    jsonValue = undefined;
                } else {
                    jsonValue = jsonValueResult.value;
                }
            }
            const pushValue: TypedKeyValueSettings.PushValue<CategoryId> = {
                info,
                value: jsonValue,
            };
            pushValues[i] = pushValue;
            const formattedSettingValue: TypedKeyValueScalarSettingsGroup.FormattedSettingValue = {
                id: info.id,
                formattedValue: jsonValue,
            };
            formattedSettingValues[i] = formattedSettingValue;
        }

        let allHandledIds = new Array<Integer>();
        const handlers = this._pushFormattedSettingValuesMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            const handler = handlers[index];
            const handledIds = handler(formattedSettingValues);
            allHandledIds = [...allHandledIds, ...handledIds];
        }

        const pushValueCount = pushValues.length;
        for (let i = 0; i < pushValueCount; i++) {
            const pushValue = pushValues[i];
            const info = pushValue.info;
            const id = info.id;
            if (!allHandledIds.includes(id)) {
                info.pusher(pushValue);
            }
        }
    }

    override save(categoryCount: Integer): (JsonElement | undefined)[] {
        let allFormattedSettingValues = new Array<TypedKeyValueScalarSettingsGroup.FormattedSettingValue>();
        const handlers = this._getFormattedSettingValuesMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            const formattedSettingValues = handlers[index]();
            allFormattedSettingValues = [...allFormattedSettingValues, ...formattedSettingValues];
        }

        const count = this.idCount;
        const elements = new Array<JsonElement | undefined>(categoryCount);
        for (let id = 0; id < count; id++) {
            const info = this.getInfo(id);
            const name = info.name;
            let formattedValue: string | undefined;
            const formattedSettingValue = allFormattedSettingValues.find((fsv) => fsv.id === id);
            if (formattedSettingValue !== undefined) {
                formattedValue = formattedSettingValue.formattedValue;
            } else {
                formattedValue = info.getter();
            }

            let element = elements[info.categoryId];
            if (element === undefined) {
                element = new JsonElement();
                elements[info.categoryId] = element;
                this.setSaveElementNameAndTypeId(element);
            }
            element.setString(name, formattedValue);
        }

        return elements;
    }

    notifyFormattedSettingChanged(settingId: Integer) {
        this.notifySettingChanged(settingId);
    }

    subscribeGetFormattedSettingValuesEvent(handler: TypedKeyValueScalarSettingsGroup.GetFormattedSettingValuesEventHandler) {
        return this._getFormattedSettingValuesMultiEvent.subscribe(handler);
    }

    unsubscribeGetFormattedSettingValuesEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._getFormattedSettingValuesMultiEvent.unsubscribe(subscriptionId);
    }

    subscribePushFormattedSettingValuesEvent(handler: TypedKeyValueScalarSettingsGroup.PushFormattedSettingValuesEventHandler) {
        return this._pushFormattedSettingValuesMultiEvent.subscribe(handler);
    }

    unsubscribePushFormattedSettingValuesEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._pushFormattedSettingValuesMultiEvent.unsubscribe(subscriptionId);
    }

    protected abstract getInfo(idx: Integer): TypedKeyValueSettings.Info<CategoryId>;
}

export namespace TypedKeyValueScalarSettingsGroup {
    export interface FormattedSettingValue {
        id: Integer;
        formattedValue: string | undefined;
    }

    export type GetFormattedSettingValuesEventHandler = (this: void) => FormattedSettingValue[];
    export type PushFormattedSettingValuesEventHandler = (this: void, values: FormattedSettingValue[]) => readonly Integer[];
}
