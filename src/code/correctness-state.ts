
import { MultiEvent } from './multi-event';

/** @public */
export interface CorrectnessState<Badness> {
    badness: Badness;
    usable: boolean;

    setUsable(badness: Badness): void;
    setUnusable(badness: Badness): void;
    checkSetUnusable(badness: Badness): void;

    subscribeUsableChangedEvent(handler: CorrectnessState.UsableChangedEventHandler): MultiEvent.SubscriptionId;
    unsubscribeUsableChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void;

    subscribeBadnessChangedEvent(handler: CorrectnessState.BadnessChangedEventHandler): MultiEvent.SubscriptionId;
    unsubscribeBadnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void;
}

/** @public */
export namespace CorrectnessState {
    export type UsableChangedEventHandler = (this: void) => void;
    export type BadnessChangedEventHandler = (this: void) => void;
}
