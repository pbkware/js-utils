/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { JsonElement } from '../json-element';
import { Integer } from '../types';

export abstract class SettingsGroup {
    beginChangesEvent: SettingsGroup.BeginChangesEvent;
    endChangesEvent: SettingsGroup.EndChangesEvent;
    settingChangedEvent: SettingsGroup.SettingChangedEvent;

    constructor(
        readonly typeName: string,
        readonly name: string
    ) {
    }

    beginChanges() {
        this.beginChangesEvent();
    }

    endChanges() {
        this.endChangesEvent();
    }

    protected notifySettingChanged(settingId: Integer) {
        this.settingChangedEvent(settingId);
    }

    protected setSaveElementNameAndTypeId(element: JsonElement) {
        element.setString(SettingsGroup.GroupJsonName.TypeName, this.typeName);
        element.setString(SettingsGroup.GroupJsonName.Name, this.name);
    }

    abstract load(rootElements: (JsonElement | undefined)[]): void;
    abstract save(categoryCount: Integer): (JsonElement | undefined)[];
}

export namespace SettingsGroup {
    export type BeginChangesEvent = (this: void) => void;
    export type EndChangesEvent = (this: void) => void;
    export type SettingChangedEvent = (this: void, settingId: Integer) => void;

    export const enum GroupJsonName {
        Name = 'groupName',
        TypeName = 'groupTypeName',
    }

    export interface NameAndType {
        name: string | undefined;
        typeName: string | undefined;
    }

    export function tryGetNameAndType(element: JsonElement): NameAndType {
        const nameResult = element.tryGetString(GroupJsonName.Name);
        const name = nameResult.isErr() ? undefined : nameResult.value;
        const typeNameResult = element.tryGetString(GroupJsonName.TypeName);
        const typeName = typeNameResult.isErr() ? undefined : typeNameResult.value;
        return {
            name,
            typeName,
        };
    }
}
