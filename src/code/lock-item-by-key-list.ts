/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { LockOpenListItem } from './lock-open-list-item';
// import { MultiEvent } from './multi-event';
// import { NamedLocker, NamedOpener } from './named-locker';
import { Result } from './result';
import { MapKey } from './types';

/** @public */
export interface LockItemByKeyList<Item extends LockOpenListItem<Item, Error>, Error = string> {

    tryLockItemByKey(key: MapKey, locker: LockOpenListItem.Locker): Promise<Result<Item | undefined, Error>>;
    unlockItem(item: Item, locker: LockOpenListItem.Locker): void;
}
