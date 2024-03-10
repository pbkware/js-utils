// (c) 2024 Xilytix Pty Ltd

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
        const logEvent = this.createLogEvent(levelId, undefined, text, maxTextLength, telemetryAndExtra)
        this.notifyLogEvent(logEvent);
    }

    logDebug(text: string, maxTextLength?: number, telemetryAndExtra?: string) {
        const logEvent = this.createLogEvent(Logger.LevelId.Debug, undefined, text, maxTextLength, telemetryAndExtra)
        this.notifyLogEvent(logEvent);
    }

    logInfo(text: string, telemetryAndExtra?: string) {
        const logEvent = this.createLogEvent(Logger.LevelId.Info, undefined, text, undefined, telemetryAndExtra)
        this.notifyLogEvent(logEvent);
    }

    logWarning(text: string, telemetryAndExtra = '') {
        const logEvent = this.createLogEvent(Logger.LevelId.Warning, undefined, text, undefined, telemetryAndExtra)
        this.notifyLogEvent(logEvent);
    }

    logError(text: string, maxTextLength?: number, telemetryAndExtra = '') {
        const logEvent = this.createLogEvent(Logger.LevelId.Error, undefined, text, maxTextLength, telemetryAndExtra)
        this.notifyLogEvent(logEvent);
    }

    logPersistError(code: string, text?: string, maxTextLength?: number, telemetryAndExtra = '') {
        this.logCodeError(Logger.ErrorTypeId.Persist, code, text, maxTextLength, telemetryAndExtra)
    }

    logExternalError(code: string, text: string, maxTextLength?: number, telemetryAndExtra = '') {
        this.logCodeError(Logger.ErrorTypeId.External, code, text, maxTextLength, telemetryAndExtra)
    }

    logDataError(code: string, text: string, maxTextLength?: number, telemetryAndExtra = '') {
        this.logCodeError(Logger.ErrorTypeId.Data, code, text, maxTextLength, telemetryAndExtra)
    }

    logLayoutError(code: string, text: string, maxTextLength?: number, telemetryAndExtra = '') {
        this.logCodeError(Logger.ErrorTypeId.Layout, code, text, maxTextLength, telemetryAndExtra)
    }

    logConfigError(code: string, text: string, maxTextLength?: number, telemetryAndExtra = '') {
        this.logCodeError(Logger.ErrorTypeId.Config, code, text, maxTextLength, telemetryAndExtra)
    }

    logSevere(text: string, maxTextLength?: number, telemetryAndExtra = '') {
        const logEvent = this.createLogEvent(Logger.LevelId.Severe, undefined, text, maxTextLength, telemetryAndExtra)
        this.notifyLogEvent(logEvent);
    }

    private logCodeError(
        errorTypeId: Logger.ErrorTypeId | undefined,
        code: string,
        text: string | undefined,
        maxTextLength: number | undefined,
        telemetryAndExtra: string | undefined,
    ) {
        if (text === undefined) {
            text = code;
        } else {
            text = `${code}: ${text}`
        }
        const logEvent = this.createLogEvent(Logger.LevelId.Error, errorTypeId, text, maxTextLength, telemetryAndExtra)
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
        errorTypeId: Logger.ErrorTypeId | undefined,
        text: string,
        maxTextLength: number | undefined,
        telemetryAndExtra: string | undefined
    ) {
        const logEvent: Logger.LogEvent = {
            levelId,
            errorTypeId,
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

    export const enum ErrorTypeId {
        General,
        Persist,
        External,
        Data,
        Config,
        Layout,
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
        readonly errorTypeId: Logger.ErrorTypeId | undefined;
        readonly text: string;
        readonly maxTextLength: number | undefined;
        readonly telemetryAndExtra: string | undefined;
    }
}

/** @public */
export const logger = new Logger();
