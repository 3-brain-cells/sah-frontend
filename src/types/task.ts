import { colors } from '../components/_lib/colors';

export interface TaskDefinition {
    id: string;
    number: number;
    sizes: string[];
    profile: {
        groupId: string;
        id: string;
    };
    options: Record<string, unknown>;
}

export interface Release {
    id: string;
    name: string;
    site: string;
    proxyList: string;
    prevNumber: number;
    options: Record<string, unknown>;
    tasks: Record<string, TaskDefinition>;
    monitorDelay: number;
    errorDelay: number;
}

export interface StatusUpdate {
    releaseId: string;
    taskId: string;
    status: Status;
}

export interface Status {
    status: StatusType;
    data: unknown;
}

export enum StatusType {
    FINISHED = 'finished',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    WAITING = 'waiting',
    WAITING_FOR_PROXY = 'waiting_for_proxy',
    RUNNING = 'running',
}

const STATUS_TYPE_TEXT = {
    [StatusType.FINISHED]: 'Finished',
    [StatusType.FAILED]: 'Failed',
    [StatusType.CANCELLED]: 'Cancelled',
    [StatusType.WAITING]: 'Waiting',
    [StatusType.WAITING_FOR_PROXY]: 'Waiting for proxy',
    [StatusType.RUNNING]: 'Running',
};

export function resolveStatusTypeText(statusType: StatusType | null): string {
    if (statusType === null) {
        return 'Ready';
    }
    return STATUS_TYPE_TEXT[statusType];
}

const STATUS_TYPE_COLOR = {
    [StatusType.FINISHED]: colors['green+10'],
    [StatusType.FAILED]: colors['red+10'],
    [StatusType.CANCELLED]: colors['red+10'],
    [StatusType.WAITING]: colors['orange+10'],
    [StatusType.WAITING_FOR_PROXY]: colors['orange+10'],
    [StatusType.RUNNING]: colors['yellow+10'],
};

export function resolveStatusTypeColor(statusType: StatusType | null): string {
    if (statusType === null) {
        return colors['blue+10'];
    }
    return STATUS_TYPE_COLOR[statusType];
}

const STATUS_TYPE_BG_COLOR = {
    [StatusType.FINISHED]: colors['green-10'],
    [StatusType.FAILED]: colors['red-10'],
    [StatusType.CANCELLED]: colors['red-10'],
    [StatusType.WAITING]: colors['orange-10'],
    [StatusType.WAITING_FOR_PROXY]: colors['orange-10'],
    [StatusType.RUNNING]: colors['yellow-10'],
};

export function resolveStatusTypeBgColor(statusType?: StatusType): string {
    if (!statusType) {
        return colors['blue-10'];
    }
    return STATUS_TYPE_BG_COLOR[statusType];
}

export interface Task {
    definition: TaskDefinition;
    status: Status | null;
}

export interface WaitingData {
    start: string;
    end: string;
}

/**
 * Summaries a `StatusType` to determine the execution type
 * (running, ready, or stopped)
 */
export enum StatusExecutionType {
    READY,
    RUNNING,
    STOPPED,
}

export function getStatusExecutionType(status: Status | null): StatusExecutionType {
    if (status === null) {
        return StatusExecutionType.READY;
    }

    switch (status.status) {
        case StatusType.FINISHED:
        case StatusType.CANCELLED:
        case StatusType.FAILED:
            return StatusExecutionType.STOPPED;
        default:
            return StatusExecutionType.RUNNING;
    }
}
