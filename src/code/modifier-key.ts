
import { Integer } from './types';

/** @public */
export const enum ModifierKeyId {
    Alt = 1,
    Ctrl = 2,
    Meta = 4,
    Shift = 8,
}

/** @public */
export namespace ModifierKey {
    export type IdSet = Integer;

    export namespace IdSet {
        export function create(altKey: boolean, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): IdSet {
            return (altKey ? ModifierKeyId.Alt : 0) |
                (ctrlKey ? ModifierKeyId.Ctrl : 0) |
                (metaKey ? ModifierKeyId.Meta : 0) |
                (shiftKey ? ModifierKeyId.Shift : 0);
        }
    }

    export function idSetIncludes(idSet: IdSet, value: ModifierKeyId) {
        return (idSet & value) as ModifierKeyId === value;
    }
}
