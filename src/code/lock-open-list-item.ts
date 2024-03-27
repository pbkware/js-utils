// (c) 2024 Xilytix Pty Ltd

import { MapKeyed } from './map-keyed';
import { NamedLocker, NamedOpener } from './named-locker';
import { Result } from './result';
import { IndexedRecord, Integer } from './types';

/** @public */
export interface LockOpenListItem<T, Error = string> extends MapKeyed, IndexedRecord {
    readonly lockCount: Integer;
    readonly lockers: readonly LockOpenListItem.Locker[];
    readonly openCount: Integer;
    readonly openers: readonly LockOpenListItem.Opener[];

    tryLock(locker: LockOpenListItem.Locker): Promise<Result<void, Error>>;
    openLocked(opener: LockOpenListItem.Opener): void;
    closeLocked(opener: LockOpenListItem.Opener): void;
    unlock(locker: LockOpenListItem.Locker): void;
    isLocked(ignoreOnlyLocker: LockOpenListItem.Locker | undefined): boolean;

    // tryProcessFirstLock(locker: LockOpenListItem.Locker): Promise<Result<void>>;
    // processLastUnlock(locker: LockOpenListItem.Locker): void;
    // processFirstOpen(opener: LockOpenListItem.Opener): void;
    // processLastClose(opener: LockOpenListItem.Opener): void;

    equals(other: T): boolean;
}

/** @public */
export namespace LockOpenListItem {
    export type Locker = NamedLocker;
    export type Opener = NamedOpener;
}
