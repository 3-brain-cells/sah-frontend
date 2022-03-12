export interface LogEntry {
    type: LogEntryType;
    data: unknown;
    timestamp: string;
}

export enum LogEntryType {
    PROXY_UPDATE = 'new_proxy_acquired',
    PROFILE_UPDATE = 'current_profile_updated',
    NEW_PROFILE = 'new_profile',
    ERROR = 'error',
    TASK_UPDATE = 'task_update',
    STATUS_CHANGED = 'status_changed',
}
