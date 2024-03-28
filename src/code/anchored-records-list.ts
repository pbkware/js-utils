/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AssertInternalError } from './internal-error';
import { MultiEvent } from './multi-event';
import { RecordList } from './record-list';
import { IndexedRecord, Integer } from './types';
import { UsableListChangeTypeId } from './usable-list-change-type';
import { moveElementsInArray } from './utils';

/** @public */
export class AnchoredRecordsList<Record extends AnchoredRecordsList.Record> implements RecordList<Record> {
    private readonly _records = new Array<Record>();
    private _anchoredRecordCount: Integer;

    private _listChangeMultiEvent = new MultiEvent<RecordList.ListChangeEventHandler>();

    get records(): readonly Record[] { return this._records; }
    get count() { return this._records.length; }
    get anchoredRecordCount() { return this._anchoredRecordCount; }

    getAt(index: number): Record {
        return this._records[index];
    }

    toArray(): readonly Record[] {
        return this._records;
    }

    indexOf(record: Record): Integer {
        const count = this._records.length;
        for (let i = 0; i < count; i++) {
            if (this._records[i] === record) {
                return i;
            }
        }
        return -1;
    }

    assign(newRecords: readonly Record[], anchoredCount: Integer) {
        const oldCount = this._records.length;
        if (oldCount > 0) {
            this.notifyListChange(UsableListChangeTypeId.Clear, 0, oldCount);
        }

        this._anchoredRecordCount = anchoredCount;

        const records = this._records;
        const newCount = newRecords.length;
        records.length = newCount;
        if (newCount > 0) {
            for (let i = 0; i < newCount; i++) {
                records[i] = newRecords[i];
            }

            this.notifyListChange(UsableListChangeTypeId.Insert, 0, newCount);
        }
    }

    insert(index: Integer, records: Record[]) {
        if (index < this._anchoredRecordCount) {
            throw new AssertInternalError('EGLDCLI36081');
        } else {
            this._records.splice(index, 0, ...records);
            this.reindex(index);
            this.notifyListChange(UsableListChangeTypeId.Insert, index, records.length);
        }
    }

    remove(index: Integer, count: Integer) {
        if (index < this._anchoredRecordCount) {
            throw new AssertInternalError('EGLDCLR36081');
        } else {
            this.notifyListChange(UsableListChangeTypeId.Remove, index, count);
            this._records.splice(index, count);
            this.reindex(index);
        }
    }

    removeIndexedRecords(removeIndices: Integer[]) {
        const removeIndicesCount = removeIndices.length;
        if (removeIndicesCount > 0) {
            removeIndices.sort((left, right) => left - right);
            let removeIndicesAnchoredCount = 0;
            let rangeEndI = removeIndicesCount - 1;
            let rangeExpectedNextRecordIndex = removeIndices[rangeEndI] - 1;
            for (let i = rangeEndI - 1; i >= 0; i--) {
                const recordIndex = removeIndices[i];
                const anchored = recordIndex < this._anchoredRecordCount;
                if (anchored) {
                    removeIndicesAnchoredCount = i + 1;
                    break;
                } else {
                    if (recordIndex === rangeExpectedNextRecordIndex) {
                        rangeExpectedNextRecordIndex -= 1;
                    } else {
                        const rangeLength = rangeEndI - i;
                        const fromRecordIndex = rangeExpectedNextRecordIndex + 1;
                        this.remove(fromRecordIndex, rangeLength);

                        rangeEndI = i;
                        rangeExpectedNextRecordIndex = recordIndex - 1;
                    }
                }
            }

            const rangeLength = rangeEndI + 1 - removeIndicesAnchoredCount;
            if (rangeLength > 0) {
                const fromRecordIndex = rangeExpectedNextRecordIndex + 1;
                this.remove(fromRecordIndex, rangeLength);
            }
        }
    }

    clear() {
        this.notifyListChange(UsableListChangeTypeId.Clear, 0, this.count);
        this._records.length = 0;
    }

    move(fromIndex: Integer, toIndex: Integer, count: Integer) {
        this.notifyListChange(UsableListChangeTypeId.Remove, fromIndex, count);
        moveElementsInArray(this._records, fromIndex, toIndex, count);
        if (fromIndex < toIndex) {
            this.reindex(fromIndex);
        } else {
            this.reindex(toIndex);
        }
        this.notifyListChange(UsableListChangeTypeId.Insert, toIndex, count);
    }

    moveIndexedRecordsToStart(moveIndices: Integer[]) {
        const moveIndicesCount = moveIndices.length;
        if (moveIndicesCount > 0) {
            const anchoredRecordCount = this._anchoredRecordCount;
            moveIndices.sort((left, right) => left - right);
            let toRecordIndex = this._anchoredRecordCount;
            let rangeStartI = 0;
            let recordIndex = moveIndices[rangeStartI];
            let rangeExpectedNextRecordIndex = recordIndex + 1;
            for (let i = rangeStartI + 1; i < moveIndicesCount; i++) {
                recordIndex = moveIndices[i];
                const anchored = recordIndex < anchoredRecordCount;
                if (recordIndex === rangeExpectedNextRecordIndex && !anchored) {
                    rangeExpectedNextRecordIndex += 1;
                } else {
                    const fromRecordIndex = moveIndices[rangeStartI];
                    if (fromRecordIndex >= anchoredRecordCount) { // do not move any anchored records
                        const rangeLength = i - rangeStartI;
                        if (fromRecordIndex > toRecordIndex) {
                            this.move(fromRecordIndex, toRecordIndex, rangeLength);
                        }
                        toRecordIndex += rangeLength;
                    }

                    rangeStartI = i;
                    rangeExpectedNextRecordIndex = recordIndex + 1;
                }
            }

            const fromRecordIndex = moveIndices[rangeStartI];
            if (fromRecordIndex > toRecordIndex) {
                const rangeLength = moveIndicesCount - rangeStartI;
                this.move(fromRecordIndex, toRecordIndex, rangeLength);
            }
        }
    }

    moveIndexedRecordsToEnd(moveIndices: Integer[]) {
        const moveIndicesCount = moveIndices.length;
        if (moveIndicesCount > 0) {
            moveIndices.sort((left, right) => left - right);
            let removeIndicesAnchoredCount = 0;
            let toRecordIndex = this._records.length;
            let rangeStartI = moveIndicesCount - 1;
            let recordIndex = moveIndices[rangeStartI];
            let rangeExpectedNextRecordIndex = recordIndex - 1;
            for (let i = rangeStartI - 1; i >= 0; i--) {
                recordIndex = moveIndices[i];
                const anchored = recordIndex < this._anchoredRecordCount;
                if (anchored) {
                    removeIndicesAnchoredCount = i + 1;
                    break;
                } else {
                    if (recordIndex === rangeExpectedNextRecordIndex) {
                        rangeExpectedNextRecordIndex -= 1;
                    } else {
                        const fromRecordIndex = rangeExpectedNextRecordIndex + 1;
                        const rangeLength = rangeStartI - i;
                        toRecordIndex -= rangeLength;
                        if (fromRecordIndex !== toRecordIndex) {
                            this.move(fromRecordIndex, toRecordIndex, rangeLength);
                        }

                        rangeStartI = i;
                        rangeExpectedNextRecordIndex = recordIndex - 1;
                    }
                }
            }

            const rangeLength = rangeStartI + 1 - removeIndicesAnchoredCount;
            if (rangeLength > 0) {
                const fromRecordIndex = rangeExpectedNextRecordIndex + 1;
                toRecordIndex -= rangeLength;
                if (fromRecordIndex < toRecordIndex) {
                    this.move(fromRecordIndex, toRecordIndex, rangeLength);
                }
            }
        }
    }

    moveIndexedRecordsOnePositionTowardsStartWithSquash(moveIndices: Integer[]) {
        const moveIndicesCount = moveIndices.length;
        if (moveIndicesCount > 0) {
            const anchoredRecordCount = this._anchoredRecordCount;
            moveIndices.sort((left, right) => left - right);

            let unavailableRecordCount = anchoredRecordCount; // exclude anchored records and records already moved to at start

            let rangeStartI = 0;
            let recordIndex = moveIndices[rangeStartI];
            let rangeExpectedNextRecordIndex = recordIndex + 1;
            for (let i = rangeStartI + 1; i < moveIndicesCount; i++) {
                recordIndex = moveIndices[i];
                const anchored = recordIndex < this._anchoredRecordCount;
                if (recordIndex === rangeExpectedNextRecordIndex && !anchored) {
                    rangeExpectedNextRecordIndex += 1;
                } else {
                    const fromRecordIndex = moveIndices[rangeStartI];
                    if (fromRecordIndex >= anchoredRecordCount) { // do not move any anchored columns
                        const rangeLength = i - rangeStartI;
                        const atStartUnavailableRecordCount = unavailableRecordCount + rangeLength;

                        const toRecordIndex = fromRecordIndex - 1;
                        if (toRecordIndex < unavailableRecordCount) {
                            unavailableRecordCount = atStartUnavailableRecordCount; // already at start
                        } else {
                            this.move(fromRecordIndex, toRecordIndex, rangeLength);
                            if (toRecordIndex === unavailableRecordCount) {
                                unavailableRecordCount = atStartUnavailableRecordCount; // moved to start
                            }
                        }
                    }

                    rangeStartI = i;
                    rangeExpectedNextRecordIndex = recordIndex;
                }
            }

            const fromRecordIndex = moveIndices[rangeStartI];
            const toRecordIndex = fromRecordIndex - 1;
            if (toRecordIndex >= unavailableRecordCount) {
                const rangeLength = moveIndicesCount - rangeStartI;
                this.move(fromRecordIndex, toRecordIndex, rangeLength);
            }
        }
    }

    moveIndexedRecordsOnePositionTowardsEndWithSquash(moveIndices: Integer[]) {
        const moveIndicesCount = moveIndices.length;
        if (moveIndicesCount > 0) {
            moveIndices.sort((left, right) => left - right);

            let availableRecordCount = this._records.length; // exclude records already moved to at end
            let removeIndicesAnchoredCount = 0;

            let rangeStartI = moveIndicesCount - 1;
            let recordIndex = moveIndices[rangeStartI];
            let rangeExpectedNextRecordIndex = recordIndex - 1;
            for (let i = rangeStartI - 1; i >= 0; i--) {
                recordIndex = moveIndices[i];
                const anchored = recordIndex < this._anchoredRecordCount;

                if (anchored) {
                    removeIndicesAnchoredCount = i + 1;
                    break;
                } else {
                    if (recordIndex === rangeExpectedNextRecordIndex) {
                        rangeExpectedNextRecordIndex -= 1;
                    } else {
                        const fromRecordIndex = rangeExpectedNextRecordIndex + 1;
                        const toRecordIndex = fromRecordIndex + 1;
                        const rangeLength = rangeStartI - i;
                        const atEndAvailableRecordCount = availableRecordCount - rangeLength;

                        if (toRecordIndex > atEndAvailableRecordCount) {
                            availableRecordCount = atEndAvailableRecordCount; // already at end
                        } else {
                            this.move(fromRecordIndex, toRecordIndex, rangeLength);
                            if (toRecordIndex === atEndAvailableRecordCount) {
                                availableRecordCount = atEndAvailableRecordCount; // moved to end
                            }
                        }

                        rangeStartI = i;
                        rangeExpectedNextRecordIndex = recordIndex - 1;
                    }
                }
            }

            const rangeLength = rangeStartI + 1 - removeIndicesAnchoredCount;
            if (rangeLength > 0) {
                const fromRecordIndex = rangeExpectedNextRecordIndex + 1;
                const toRecordIndex = fromRecordIndex + 1;
                const atEndAvailableRecordCount = availableRecordCount - rangeLength;
                if (toRecordIndex <= atEndAvailableRecordCount) {
                    this.move(fromRecordIndex, toRecordIndex, rangeLength);
                }
            }
        }
    }

    areAllIndexedRecordsAnchored(recordIndices: Integer[]) {
        for (const index of recordIndices) {
            const record = this._records[index];
            if (!record.anchored) {
                return false;
            }
        }
        return true; // nonsensical if recordIndices length is 0 - try to avoid
    }

    areSortedIndexedRecordsAllAtStart(sortedRecordIndices: Integer[]) {
        const recordIndicesCount = sortedRecordIndices.length;
        if (recordIndicesCount === 0) {
            return true; // nonsensical - try to avoid
        } else {
            const anchoredRecordCount = this._anchoredRecordCount;
            let nextAfterAnchoredExpectedRecordIndex = anchoredRecordCount;
            for (let i = 0; i < recordIndicesCount; i++) {
                const recordIndex = sortedRecordIndices[i];
                // ignore records for anchored columns
                if (recordIndex >= anchoredRecordCount) {
                    if (recordIndex !== nextAfterAnchoredExpectedRecordIndex) {
                        return false;
                    } else {
                        nextAfterAnchoredExpectedRecordIndex += 1;
                    }
                }
            }
            return true;
        }
    }

    areSortedIndexedRecordsAllAtEnd(sortedRecordIndices: Integer[]) {
        const recordIndicesCount = sortedRecordIndices.length;
        if (recordIndicesCount === 0) {
            return true; // nonsensical - try to avoid
        } else {
            const recordCount = this._records.length;
            const sortedRecordIndicesCount = sortedRecordIndices.length;
            const anchoredRecordCount = this._anchoredRecordCount;
            let nextExpectedRecordIndex = recordCount - 1;
            for (let i = sortedRecordIndicesCount - 1; i >= 0; i--) {
                const recordIndex = sortedRecordIndices[i];
                if (recordIndex < anchoredRecordCount) {
                    return true;
                } else {
                    if (recordIndex !== nextExpectedRecordIndex) {
                        return false;
                    } else {
                        nextExpectedRecordIndex -= 1;
                    }
                }
            }
            return true;
        }
    }

    subscribeListChangeEvent(handler: RecordList.ListChangeEventHandler) {
        return this._listChangeMultiEvent.subscribe(handler);
    }

    unsubscribeListChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._listChangeMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyListChange(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        const handlers = this._listChangeMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](listChangeTypeId, index, count);
        }
    }

    private reindex(fromIndex: Integer) {
        const count = this.count;
        const records = this._records;
        for (let i = fromIndex; i < count; i++) {
            const record = records[i];
            record.index = i;
        }
    }
}

/** @public */
export namespace AnchoredRecordsList {
    export interface Record extends IndexedRecord {
        anchored: boolean;
    }
}
