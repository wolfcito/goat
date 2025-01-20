const isEnabled: boolean = process.env.ENABLE_LOGS !== "false";
const logLevel: string = process.env.LOG_LEVEL ?? "info";

const levels = ["debug", "info", "warn", "error"];

function shouldLog(level: string): boolean {
    const currentLevelIndex = levels.indexOf(logLevel);
    const logLevelIndex = levels.indexOf(level);

    return isEnabled && logLevelIndex >= currentLevelIndex;
}

function log(level: string, message: string, data?: unknown): void {
    if (shouldLog(level)) {
        const timestamp = new Date().toISOString();
        switch (level) {
            case "info":
                console.info(`[INFO] ${timestamp} - ${message}`);
                break;
            case "warn":
                console.warn(`[WARN] ${timestamp} - ${message}`);
                break;
            case "error":
                console.error(`[ERROR] ${timestamp} - ${message}`);
                break;
            case "debug":
                console.debug(`[DEBUG] ${timestamp} - ${message}`);
                break;
        }
        if (data) {
            console.table(data);
        }
    }
}

export const Logger = {
    info: (message: string, data?: unknown) => log("info", message, data),
    warn: (message: string, data?: unknown) => log("warn", message, data),
    error: (message: string, data?: unknown) => log("error", message, data),
    debug: (message: string, data?: unknown) => log("debug", message, data),
};
