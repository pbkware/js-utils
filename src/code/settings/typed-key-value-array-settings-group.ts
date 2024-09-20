/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { JsonElement } from '../json-element';
import { IndexSignatureHack, Integer } from '../types';
import { SettingsGroup } from './settings-group';
import { TypedKeyValueSettings } from './typed-key-value-settings';

export abstract class TypedKeyValueArraySettingsGroup<CategoryId extends Integer> extends SettingsGroup {
    override load(elements: (JsonElement | undefined)[]) {
        const count = elements.length;
        for (let categoryId = 0; categoryId < count; categoryId++) {
            const element = elements[categoryId];
            this.loadElement(element, categoryId as CategoryId);
        }
    }

    override save(categoryCount: Integer): (JsonElement | undefined)[] {
        const result = new Array<JsonElement | undefined>(categoryCount);
        for (let categoryId = 0; categoryId < categoryCount; categoryId++) {
            const element = this.createSaveElement(categoryId as CategoryId);
            result[categoryId] = element;
        }
        return result;
    }

    private loadElement(element: JsonElement | undefined, categoryId: CategoryId) {
        const requiredNamedInfoArrays = this.getNamedInfoArrays(categoryId);
        if (element === undefined) {
            this.loadDefaults(requiredNamedInfoArrays);
        } else {
            const namedInfoArrayElementsResult = element.tryGetElementArray(TypedKeyValueArraySettingsGroup.InfosArrayJsonName.namedInfoArrays);
            if (namedInfoArrayElementsResult.isErr()) {
                this.loadDefaults(requiredNamedInfoArrays);
            } else {
                const namedInfoArrayElements = namedInfoArrayElementsResult.value;
                const count = namedInfoArrayElements.length;
                const loadedNames = new Array<string>(count);
                let loadedNameCount = 0;
                for (const namedInfoArrayElement of namedInfoArrayElements) {
                    const nameResult = namedInfoArrayElement.tryGetString(TypedKeyValueArraySettingsGroup.InfosArrayJsonName.name);
                    if (nameResult.isOk()) {
                        const infoArrayElementResult = namedInfoArrayElement.tryGetElement(
                            TypedKeyValueArraySettingsGroup.InfosArrayJsonName.infoArray
                        );
                        if (infoArrayElementResult.isOk()) {
                            const name = nameResult.value;
                            if (this.loadNamedInfoArrayElement(name, infoArrayElementResult.value, requiredNamedInfoArrays)) {
                                loadedNames[loadedNameCount++] = name;
                            }
                        }
                    }
                }

                if (loadedNameCount !== count) {
                    this.loadMissingDefaults(loadedNames, requiredNamedInfoArrays);
                }
            }
        }
    }

    private loadDefaults(namedInfoArrays: TypedKeyValueArraySettingsGroup.NamedInfoArray<CategoryId>[]) {
        for (const array of namedInfoArrays) {
            this.loadInfos(undefined, array.infoArray);
        }
    }

    private loadMissingDefaults(loadedNames: string[], namedInfoArrays: TypedKeyValueArraySettingsGroup.NamedInfoArray<CategoryId>[]) {
        for (const namedInfoArray of namedInfoArrays) {
            const name = namedInfoArray.name;
            if (!loadedNames.includes(name)) {
                this.loadInfos(undefined, namedInfoArray.infoArray);
            }
        }
    }

    private loadNamedInfoArrayElement(
        name: string,
        infoArrayElement: JsonElement,
        namedInfoArrays: TypedKeyValueArraySettingsGroup.NamedInfoArray<CategoryId>[]
    ) {
        const namedInfoArray = namedInfoArrays.find((array) => array.name === name);
        if (namedInfoArray === undefined) {
            return false;
        } else {
            this.loadInfos(infoArrayElement, namedInfoArray.infoArray);
            return true;
        }
    }

    private loadInfos(element: JsonElement | undefined, infos: TypedKeyValueSettings.Info<CategoryId>[]) {
        const count = infos.length;
        for (let i = 0; i < count; i++) {
            const info = infos[i];
            const name = info.name;
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
            info.pusher(pushValue);
        }
    }

    private createSaveElement(categoryId: CategoryId): JsonElement | undefined {
        const namedInfoArrays = this.getNamedInfoArrays(categoryId);
        const namedInfoArrayCount = namedInfoArrays.length;
        if (namedInfoArrayCount === 0) {
            return undefined;
        } else {
            const namedInfoArrayElements = new Array<JsonElement>(namedInfoArrayCount);
            for (let i = 0; i < namedInfoArrayCount; i++) {
                const namedInfoArray = namedInfoArrays[i];

                const namedInfoArrayElement = new JsonElement();
                namedInfoArrayElement.setString(TypedKeyValueArraySettingsGroup.InfosArrayJsonName.name, namedInfoArray.name);
                const infoArrayElement = namedInfoArrayElement.newElement(TypedKeyValueArraySettingsGroup.InfosArrayJsonName.infoArray);
                this.saveInfos(infoArrayElement, namedInfoArray.infoArray);
                namedInfoArrayElements[i] = namedInfoArrayElement;
            }

            const result = new JsonElement();
            result.setElementArray(TypedKeyValueArraySettingsGroup.InfosArrayJsonName.namedInfoArrays, namedInfoArrayElements);
            this.setSaveElementNameAndTypeId(result);

            return result;
        }
    }

    private saveInfos(element: JsonElement, infos: TypedKeyValueSettings.Info<CategoryId>[]) {
        const count = infos.length;
        for (let i = 0; i < count; i++) {
            const info = infos[i];
            const name = info.name;
            const value = info.getter();
            element.setString(name, value);
        }
    }

    protected abstract getNamedInfoArrays(categoryId: CategoryId): TypedKeyValueArraySettingsGroup.NamedInfoArray<CategoryId>[];
}

export namespace TypedKeyValueArraySettingsGroup {
    export namespace InfosArrayJsonName {
        export const name = 'name';
        export const infoArray = 'infoArray';
        export const namedInfoArrays = 'namedInfoArrays';
    }

    export interface NamedInfoArray<CategoryId extends Integer> {
        name: string;
        operator: boolean; // All info.operator in infoArray must match this
        infoArray: TypedKeyValueSettings.Info<CategoryId>[];
    }

    export type IndexedNamedInfoArray<CategoryId extends Integer> = IndexSignatureHack<NamedInfoArray<CategoryId>>;
}
