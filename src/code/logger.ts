
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
        __pbkwareLogger__?: Logger;
    }
}

/** @public */
export function getOrCreateLoggerGlobalAlias(loggerGlobalAliasKey: string) {
    let pbkwareLogger = window.__pbkwareLogger__;
    if (pbkwareLogger === undefined) {
        pbkwareLogger = new Logger();
        window.__pbkwareLogger__ = pbkwareLogger;
    }

    let aliasLogger = window[loggerGlobalAliasKey] as Logger | undefined;
    if (aliasLogger === undefined || aliasLogger !== pbkwareLogger) {
        aliasLogger = pbkwareLogger;
        window[loggerGlobalAliasKey] = aliasLogger;
    }

    return aliasLogger;
}

/** @public */
export class Logger {
    private readonly _bufferedLogEvents = new Array<Logger.LogEvent>(); // Used to buffer events prior to Eventer being defined

    private _logEventer: Logger.LogEventer | undefined;

    get logEventer() { return this._logEventer; }

    setLogEventer(value: Logger.LogEventer) {
        this._logEventer = value;
        if (this._bufferedLogEvents.length > 0) {
            this._bufferedLogEvents.forEach((event) => value(event));
            this._bufferedLogEvents.length = 0;
        }
    }

    log(levelId: Logger.LevelId, text: string, maxTextLength?: number, telemetryAndExtra?: string) {
        const logEvent = this.createLogEvent(levelId, text, maxTextLength, telemetryAndExtra);
        this.notifyLogEvent(logEvent);
    }

    logDebug(text: string, maxTextLength?: number, telemetryAndExtra?: string) {
        const logEvent = this.createLogEvent(Logger.LevelId.Debug, text, maxTextLength, telemetryAndExtra);
        this.notifyLogEvent(logEvent);
    }

    logInfo(text: string, telemetryAndExtra?: string) {
        const logEvent = this.createLogEvent(Logger.LevelId.Info, text, undefined, telemetryAndExtra);
        this.notifyLogEvent(logEvent);
    }

    logWarning(text: string, telemetryAndExtra = '') {
        const logEvent = this.createLogEvent(Logger.LevelId.Warning, text, undefined, telemetryAndExtra);
        this.notifyLogEvent(logEvent);
    }

    logError(text: string, maxTextLength?: number, telemetryAndExtra = '') {
        const logEvent = this.createLogEvent(Logger.LevelId.Error, text, maxTextLength, telemetryAndExtra);
        this.notifyLogEvent(logEvent);
    }

    logSevere(text: string, maxTextLength?: number, telemetryAndExtra = '') {
        const logEvent = this.createLogEvent(Logger.LevelId.Severe, text, maxTextLength, telemetryAndExtra);
        this.notifyLogEvent(logEvent);
    }

    private notifyLogEvent(logEvent: Logger.LogEvent) {
        if (this._logEventer !== undefined) {
            this._logEventer(logEvent);
        } else {
            this._bufferedLogEvents.push(logEvent);
        }
    }

    private createLogEvent(
        levelId: Logger.LevelId,
        text: string,
        maxTextLength: number | undefined,
        telemetryAndExtra: string | undefined
    ) {
        const logEvent: Logger.LogEvent = {
            levelId,
            text,
            maxTextLength,
            telemetryAndExtra,
        };
        return logEvent;
    }
}

/** @public */
export namespace Logger {
    export type LogEventer = (this: void, logEvent: LogEvent) => void;

    export const enum LevelId {
        Debug,
        Info,
        Warning,
        Error,
        Severe,
    }

    // do not use InternalErrors as causes circular loop
    export class UnreachableCaseError extends Error {
        constructor(code: string, value: never) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            super(`Logger Unreachable error. Code: ${code} Value: ${value}`);
        }
    }

    export interface LogEvent {
        readonly levelId: LevelId;
        readonly text: string;
        readonly maxTextLength: number | undefined;
        readonly telemetryAndExtra: string | undefined;
    }
}
