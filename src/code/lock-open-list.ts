/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { LockOpenListItem } from './lock-open-list-item';
// import { MultiEvent } from './multi-event';
// import { NamedLocker, NamedOpener } from './named-locker';
import { Result } from './result';
import { Integer, MapKey } from './types';
import { UsableListChangeTypeId } from './usable-list-change-type';

// This should be in Rev and expose only tryLockItemByKey() & unlockItem()
// Maybe call RevLockList
/** @public */
export interface LockOpenList<Item extends LockOpenListItem<Item, Error>, Error = string> {

    // // get nullListId(): Guid;
    // get count(): Integer;

    // getItemByKey(key: MapKey): Item | undefined;
    // getAt(idx: Integer): Item;

    // toArray(): readonly Item[];

    // getItemLockCount(item: Item): Integer;
    // getItemAtIndexLockCount(index: Integer): Integer;
    // getItemLockers(item: Item): readonly NamedLocker[];
    // getItemOpeners(item: Item): readonly NamedOpener[];

    // indexOf(item: Item): Integer;
    // indexOfKey(key: MapKey): Integer;
    // find(predicate: (item: Item) => boolean): Item | undefined;

    // deleteItem(item: Item): void;
    // deleteItemAtIndex(idx: Integer): void;
    // deleteItemsAtIndex(idx: Integer, count: Integer): void;

    // addItem(item: Item): void;
    // addItems(items: Item[], addCount?: Integer): void;

    // clearItems(): void;

    tryLockItemByKey(key: MapKey, locker: LockOpenListItem.Locker): Promise<Result<Item | undefined, Error>>;
    // tryLockItemAtIndex(idx: Integer, locker: LockOpenListItem.Locker): Promise<Result<Item>>;
    unlockItem(item: Item, locker: LockOpenListItem.Locker): void;
    // unlockItemAtIndex(idx: Integer, locker: NamedLocker): void;

    // isItemLocked(item: Item, ignoreOnlyLocker: NamedLocker | undefined): boolean;
    // isItemAtIndexLocked(idx: Integer, ignoreOnlyLocker: NamedLocker | undefined): boolean;
    // isAnyItemLocked(): boolean;
    // isAnyItemInRangeLocked(idx: Integer, count: Integer): boolean;

    // openLockedItem(item: Item, opener: NamedOpener): void;
    // closeLockedItem(item: Item, opener: NamedOpener): void;

    // lockAllItems(locker: LockOpenListItem.Locker): Promise<Result<Item>[]>;
    // lockItems(items: Item[], locker: LockOpenListItem.Locker): Promise<Result<Item | undefined>[]>;

    // unlockItems(items: readonly Item[], locker: LockOpenListItem.Locker): void;

    // subscribeListChangeEvent(handler: LockOpenList.ListChangeEventHandler): MultiEvent.SubscriptionId;

    // unsubscribeListChangeEvent(subscriptionId: MultiEvent.SubscriptionId): void;
}

/** @public */
export namespace LockOpenList {
    export type ListChangeEventHandler = (this: void, listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) => void;
}
