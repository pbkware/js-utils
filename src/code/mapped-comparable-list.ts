
import { ChangeSubscribableComparableList } from './change-subscribable-comparable-list';
import { AssertInternalError, InternalError, UnreachableCaseError } from './internal-error';
import { Integer, MapKey, Mappable } from './types';
import { UsableListChangeTypeId } from './usable-list-change-type';

/** @public */
export class MappedComparableList<out T extends (Mappable & U), in U = T> extends ChangeSubscribableComparableList<T, U> {
    onDuplicate = MappedComparableList.OnDuplicate.Error;
    duplicateErrorText = '';

    private _map = new Map<MapKey, T>();

    override clone(): MappedComparableList<T, U> {
        const result = new MappedComparableList<T, U>(this._compareItemsFtn);
        result.assign(this);
        return result;
    }

    getItemByKey(key: MapKey) {
        return this._map.get(key);
    }

    indexOfKey(key: MapKey): Integer {
        const count = this.count;
        for (let i = 0; i < count; i++) {
            const item = this.items[i];
            if (item.mapKey === key) {
                return i;
            }
        }
        return -1;
    }

    override setAt(index: Integer, value: T) {
        const existingValue = this.items[index];
        if (this.checkIfDuplicateCanAdd(value)) {
            this.notifyListChange(UsableListChangeTypeId.BeforeReplace, index, 1);
            this._map.delete(existingValue.mapKey);
            super.noNotifySetAt(index, value);
            this._map.set(value.mapKey, value);
            this.notifyListChange(UsableListChangeTypeId.AfterReplace, index, 1);
        }
    }

    override add(value: T) {
        if (this.checkIfDuplicateCanAdd(value)) {
            this._map.set(value.mapKey, value);
            return super.add(value);
        } else {
            return -1;
        }
    }

    override addUndefinedRange(undefinedValueCount: Integer) {
        throw new AssertInternalError('SYS:MCLAUR34123', undefinedValueCount.toString());
    }

    override addRange(values: readonly T[]) {
        const onDuplicate = this.onDuplicate;
        if (onDuplicate === MappedComparableList.OnDuplicate.Ignore) {
            const uncontainedValues = this.createArrayOfUncontainedValues(values, onDuplicate);
            super.addRange(uncontainedValues);
        } else {
            for (const value of values) {
                if (onDuplicate === MappedComparableList.OnDuplicate.Error && this.contains(value)) {
                    throw this.createDuplicateError('SYS:MCLAR59219', value);
                } else {
                    this._map.set(value.mapKey, value);
                }
            }
            super.addRange(values);
        }
    }

    override addSubRange(values: readonly T[], subRangeStartIndex: Integer, subRangeLength: Integer) {
        const onDuplicate = this.onDuplicate;
        const nextSubRangeIdx = subRangeStartIndex + subRangeLength;
        if (onDuplicate === MappedComparableList.OnDuplicate.Ignore) {
            const uncontainedValues = this.createArrayOfUncontainedValues(values.slice(subRangeStartIndex, nextSubRangeIdx), onDuplicate);
            super.addRange(uncontainedValues);
        } else {
            for (let i = subRangeStartIndex; i < nextSubRangeIdx; i++) {
                const value = values[i];
                if (onDuplicate === MappedComparableList.OnDuplicate.Error && this.contains(value)) {
                    throw this.createDuplicateError('SYS:MCLASR59219', value);
                } else {
                    this._map.set(value.mapKey, value);
                }
            }
            super.addSubRange(values, subRangeStartIndex, subRangeLength);
        }
    }

    override insert(index: Integer, value: T) {
        if (this.checkIfDuplicateCanAdd(value)) {
            this._map.set(value.mapKey, value);
            super.insert(index, value);
        }
    }

    override insertRange(index: Integer, values: readonly T[]) {
        const onDuplicate = this.onDuplicate;
        if (onDuplicate === MappedComparableList.OnDuplicate.Ignore) {
            const uncontainedValues = this.createArrayOfUncontainedValues(values, onDuplicate);
            super.insertRange(index, uncontainedValues);
        } else {
            for (const value of values) {
                if (onDuplicate === MappedComparableList.OnDuplicate.Error && this.contains(value)) {
                    throw this.createDuplicateError('SYS:MCLIR59219', value);
                } else {
                    this._map.set(value.mapKey, value);
                }
            }
            super.insertRange(index, values);
        }
    }

    override insertSubRange(index: Integer, values: readonly T[], subRangeStartIndex: Integer, subRangeLength: Integer) {
        const onDuplicate = this.onDuplicate;
        const nextSubRangeIdx = subRangeStartIndex + subRangeLength;
        if (onDuplicate === MappedComparableList.OnDuplicate.Ignore) {
            const uncontainedValues = this.createArrayOfUncontainedValues(values.slice(subRangeStartIndex, nextSubRangeIdx), onDuplicate);
            super.insertRange(index, uncontainedValues);
        } else {
            for (let i = subRangeStartIndex; i < nextSubRangeIdx; i++) {
                const value = values[i];
                if (onDuplicate === MappedComparableList.OnDuplicate.Error && this.contains(value)) {
                    throw this.createDuplicateError('SYS:MCLISR59219', value);
                } else {
                    this._map.set(value.mapKey, value);
                }
            }
            super.insertSubRange(index, values, subRangeStartIndex, subRangeLength);
        }
    }

    override remove(value: T) {
        super.remove(value);
        this._map.delete(value.mapKey);
    }

    override removeAtIndex(index: Integer) {
        const existingValue = this.items[index];
        this._map.delete(existingValue.mapKey);
        super.removeAtIndex(index);
    }

    override removeAtIndices(removeIndices: Integer[]) {
        for (const removeIndex of removeIndices) {
            const item = this.items[removeIndex];
            this._map.delete(item.mapKey);
        }
        super.removeAtIndices(removeIndices);
    }

    override removeRange(index: Integer, deleteCount: Integer) {
        const nextRangeIdx = index + deleteCount;
        for (let i = index; i < nextRangeIdx; i++) {
            const existingValue = this.items[i];
            this._map.delete(existingValue.mapKey);
        }
        super.removeRange(index, deleteCount);
    }

    override removeItems(removeItems: readonly T[]) {
        for (const item of removeItems) {
            this._map.delete(item.mapKey);
        }
        super.removeItems(removeItems);
    }

    override extract(value: T): T {
        this._map.delete(value.mapKey);
        return super.extract(value);
    }

    override clear() {
        this._map.clear();
        super.clear();
    }

    override contains(value: T) {
        return this._map.has(value.mapKey);
    }

    private checkIfDuplicateCanAdd(value: T): boolean {
        switch (this.onDuplicate) {
            case MappedComparableList.OnDuplicate.Never:
                return true;
            case MappedComparableList.OnDuplicate.Ignore:
                return !this.contains(value);
            case MappedComparableList.OnDuplicate.Error:
                if (this.contains(value)) {
                    throw this.createDuplicateError('SYS:MCLCIDC59219', value);
                } else {
                    return true;
                }
            default:
                throw new UnreachableCaseError('SYS:MCLCIFCA44412', this.onDuplicate);
        }
    }

    private createArrayOfUncontainedValues(values: readonly T[], onDuplicate: MappedComparableList.OnDuplicate) {
        const maxCount = values.length;
        const uncontainedValues = new Array<T>(maxCount);
        let uncontainedCount = 0;
        for (let i = 0; i < maxCount; i++) {
            const value = values[i];
            if (this.contains(value)) {
                if (onDuplicate === MappedComparableList.OnDuplicate.Error) {
                    throw this.createDuplicateError('SYS:MCLCAOUV59219', value);
                } else {
                    uncontainedValues[uncontainedCount++] = value;
                    this._map.set(value.mapKey, value);
                }
            } else {
                uncontainedValues[uncontainedCount++] = value;
                this._map.set(value.mapKey, value);
            }
        }
        uncontainedValues.length = uncontainedCount;
        return uncontainedValues;
    }

    private createDuplicateError(code: string, value: T) {
        return new MappedComparableList.DuplicateError(code, `${this.duplicateErrorText}: ${value.mapKey}`);
    }
}

/** @public */
export namespace MappedComparableList {
    export const enum OnDuplicate {
        Never,
        Ignore,
        Error,
    }

    export class DuplicateError extends InternalError {
        constructor(code: string, message: string) {
            super(code, message, 'Duplicate');
        }
    }
}
