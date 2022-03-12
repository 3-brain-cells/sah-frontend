import React from 'react';
import styled from '@emotion/styled';

import StatusText from './StatusText';
import { Status, StatusType, WaitingData } from '../../types/task';
import TaskStatusWaitingBar from './TaskStatusWaitingBar';

const Styled = {
    TaskStatus: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    `,
};

export type TaskStatusProps = {
    status: Status | null;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Aggregate component containing a `<StatusText>` component
 * and the loading bar if it is in a waiting state
 */
export default function TaskStatus({
    status,
    style,
    className,
}: TaskStatusProps): React.ReactElement {
    return (
        <Styled.TaskStatus className={className} style={style}>
            <StatusText status={status?.status ?? null} />
            {status?.status === StatusType.WAITING && status?.data != null && (
                <TaskStatusWaitingBar {...(status.data as WaitingData)} />
            )}
        </Styled.TaskStatus>
    );
}
